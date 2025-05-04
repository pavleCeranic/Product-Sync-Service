const axios = require('axios');
require('dotenv').config();

// PIM Store actions
const query = `
  query {
    products(first: 30) {
      edges {
        node {
          id
          title
          bodyHtml
          vendor
          productType
          handle
          tags
          status
          variants(first: 5) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    }
  }
`;

async function getPimProducts() {
  const response = await axios({
    method: 'post',
    url: process.env.PIM_STORE,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.PIM_TOKEN
    },
    data: {
      query: query
    }
  });

  if (!response.data.errors) {
    return response.data.data.products.edges;
  } else {
    console.error('ERROR: PIM\'s data not fetched!');
  }

}

module.exports = { getPimProducts };