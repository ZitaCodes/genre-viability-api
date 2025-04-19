const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Genre Viability Endpoint
app.post('/api/check-genre', (req, res) => {
  const { subgenre } = req.body;

  // For now, return mock data regardless of subgenre
  const response = {
    average_price: 4.99,
    average_pages: 283,
    ku_trend: "84% likely in Kindle Unlimited",
    price_range: "$3.99 – $5.99",
    explanation: "Based on similar books in this subgenre, the suggested price range aligns with current online booksellers and reader expectations."
  };

  res.json(response);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Genre Viability API running on port ${PORT}`);
});
