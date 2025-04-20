const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Genre Viability Endpoint
app.post('/api/check-genre', (req, res) => {
  const { subgenre } = req.body;

  // Example: booksFiltered is your array of books that match the genre
const allAuthors = booksFiltered.map(book => book.author).filter(Boolean);

// Deduplicate and shuffle
const shuffledUniqueAuthors = [...new Set(allAuthors)]
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);

// Add to final response object
const viabilityResponse = {
  subgenre_entered: genre,
  average_price: avgPrice,
  average_page_count: avgPageCount,
  ku_trend: kuTrend,
  price_range_ku: kuRange,
  price_range_mainstream: mainstreamRange,
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
