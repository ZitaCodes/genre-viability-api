const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Genre Viability Endpoint
app.post('/api/check-genre', (req, res) => {
  const { subgenre } = req.body;

  // Example: booksFiltered is your array of books that match the genre
// Simulated book matches — replace this later with real filtered data
const booksFiltered = [
  { author: "Ruby Star" },
  { author: "Samantha Dee" },
  { author: "S.J. Sanders" },
  { author: "Honey Phillips" },
  { author: "Ella Maven" },
  { author: "Tasha Black" }
];

const allAuthors = booksFiltered.map(book => book.author).filter(Boolean);

const shuffledUniqueAuthors = [...new Set(allAuthors)]
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);

  const kuLow = 2.99;
const kuHigh = 4.99;
const mainstreamLow = 4.99;
const mainstreamHigh = 6.99;

const suggestedLow = ((kuLow + mainstreamLow) / 2).toFixed(2);
const suggestedHigh = ((kuHigh + mainstreamHigh) / 2).toFixed(2);

const suggestedRange = `$${suggestedLow} – $${suggestedHigh}`;
  
const viabilityResponse = {
  subgenre_entered: subgenre,
  average_price: 4.99,
  average_page_count: 283,
  ku_trend: "84% likely in Kindle Unlimited",
  price_range_ku: "$2.99 – $4.99",
  price_range_mainstream: "$4.99 – $6.99",
  price_range_suggested: suggestedRange,
  pricing_logic: "Based on similar books in this subgenre, the suggested price range aligns with current online booksellers and reader expectations.",
  authors_in_genre: shuffledUniqueAuthors
};

res.json(viabilityResponse);

});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Genre Viability API running on port ${PORT}`);
});
