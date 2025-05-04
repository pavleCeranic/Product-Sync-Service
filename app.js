require('dotenv').config();
const express = require('express');
const syncProducts = require('./controllers/syncController');

const app = express();
app.use(express.json());

app.post('/sync-products', syncProducts);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
