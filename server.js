const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/check-genre', async (req, res) => {
  const { subgenre } = req.body;

  try {
   console.log("📤 Sending to Oxylabs:", subgenre);  // 👈 Add this line
   const response = await axios.post(
  'https://realtime.oxylabs.io/v1/queries',
  {
    source: 'amazon_search',
    query: `${subgenre} books`,
    geo_location: 'United States',
    parse: true
  },
  {
    auth: {
      username: process.env.OXYLABS_USER,
      password: process.env.OXYLABS_PASS
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }
);

    const books = response.data.results[0].content.products || [];
    const topBooks = books.slice(0, 300);
    const filtered = topBooks.filter(b =>
      JSON.stringify(b).toLowerCase().includes(subgenre.toLowerCase())
    );

    const prices = filtered.map(b => parseFloat(b.price?.raw.replace('$', ''))).filter(Boolean);
    const pageCounts = filtered.map(b => parseInt(b.specifications?.pages)).filter(Boolean);
    const kuBooks = filtered.filter(b =>
      JSON.stringify(b).toLowerCase().includes('kindle unlimited')
    );
    const allAuthors = filtered.map(b => b.author?.name).filter(Boolean);
    const uniqueAuthors = [...new Set(allAuthors)];
    const shuffled = uniqueAuthors.sort(() => 0.5 - Math.random()).slice(0, 3);

    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length || 0;

    const kuLow = Math.min(...prices.filter(p => p <= 4.99));
    const kuHigh = Math.max(...prices.filter(p => p <= 4.99));
    const msLow = Math.min(...prices.filter(p => p > 4.99));
    const msHigh = Math.max(...prices.filter(p => p > 4.99));

    const suggestedLow = ((kuLow + msLow) / 2).toFixed(2);
    const suggestedHigh = ((kuHigh + msHigh) / 2).toFixed(2);

    const viabilityScore = Math.round((filtered.length / 300) * 100);

    res.json({
      subgenre_entered: subgenre,
      viability_score: viabilityScore,
      average_price: avg(prices).toFixed(2),
      average_page_count: Math.round(avg(pageCounts)),
      ku_trend: `${Math.round((kuBooks.length / filtered.length) * 100) || 0}% likely in Kindle Unlimited`,
      price_range_ku: kuLow && kuHigh ? `$${kuLow} – $${kuHigh}` : "Unavailable",
      price_range_mainstream: msLow && msHigh ? `$${msLow} – $${msHigh}` : "Unavailable",
      price_range_suggested: `$${suggestedLow} – $${suggestedHigh}`,
      pricing_logic: "Based on similar books in this subgenre, the suggested price range aligns with current online booksellers and reader expectations.",
      authors_in_genre: shuffled
    });

  } catch (error) {
    console.error("Scraper error:", error.message);
    res.status(500).json({ error: "Failed to scrape data. Please try again later." });
  }
});

// ✅ MOVE THIS TO BOTTOM OUTSIDE ROUTE
app.listen(PORT, () => {
  console.log(`✅ Genre Viability API running on port ${PORT}`);
});

