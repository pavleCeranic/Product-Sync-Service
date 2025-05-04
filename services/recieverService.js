const axios = require('axios');
require('dotenv').config();

// Reciever Store actions
const getProductQuery = `
  query {
    products(first: 100) {
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

async function getRecieverProducts() {
    const response = await axios({
        method: 'post',
        url: process.env.RECIEVER_STORE,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': process.env.RECIEVER_TOKEN,
        },
        data: {
            query: getProductQuery
        }
    });

    if (!response.data.errors) {
        return response.data.data.products.edges;
        // console.log(response.data.data.products.edges);
    } else {
        console.error('ERROR: RECIEVER\'s data not fetched!');
    }

}

async function createProduct(node) {
    console.log("NODE TO BE CREATED: ", node)

    const response = await axios({
        method: 'post',
        url: process.env.RECIEVER_STORE,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': process.env.RECIEVER_TOKEN
        },
        data: {
            query: `
                mutation {
                    productCreate(input: {
                    title: "${node.title.replace(/"/g, '\\"')}"
                    vendor: "${node.vendor.replace(/"/g, '\\"')}",
                    productType: "${node.productType.replace(/"/g, '\\"')}",
                    }) {
                        product {
                            id
                            title
                            bodyHtml
                            vendor
                            productType
                            handle
                            status
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `
        }
    })

    if (!response.data.errors) {
        // return response.data.data.products.edges;
        console.log("SUCCESS: ", response.data.data);
    } else {
        console.error('ERROR: RECIEVER\'s product not created!', response.data.errors);
    }

}

async function updateProduct(node) {
    const res = await axios({
        baseURL: process.env.RECIEVER_STORE,
        method: 'post',
        data: {
            query: `
                mutation {
                    productUpdate(input: {
                        id: ${node.id},
                        title: ${node.title}
                    }) {
                        product {
                            id
                            title
                            bodyHtml
                            vendor
                            productType
                            handle
                            tags
                            status
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `
        },
        headers: {
            'X-Shopify-Access-Token': process.env.RECIEVER_TOKEN,
            'Content-Type': 'application/json',
        },
    });

    return res;
}

module.exports = { getRecieverProducts, createProduct, updateProduct };