const { all } = require('axios');
const pimService = require('../services/pimService');
const recieverService = require('../services/recieverService');

async function syncProducts(req, res) {

    //get PIM
    const pimProducts = await pimService.getPimProducts();

    // get Reciever
    const recieverProducts = await recieverService.getRecieverProducts();

    // compare for create or update and act correspondingly
    let nodesToBeUpdated = [];
    let nodesToBeCreated = [];
    let listOfHandles = [];

    recieverProducts.forEach((recieverPorduct) => { console.log('RECIEVER PRODUCT: ', recieverPorduct.node.handle) })
    pimProducts.forEach((pimProduct) => { console.log('PIM PRODUCT: ', pimProduct.node.handle) })

    for (let i = 0; i < pimProducts.length; i++) {
        const pimProduct = pimProducts[i];

        recieverProducts.forEach((recieverPorduct) => {
            if (pimProduct.node.handle === recieverPorduct.node.handle) {
                listOfHandles.push(pimProduct.node.handle);
                nodesToBeUpdated.push(pimProduct.node);
                recieverService.updateProduct(pimProduct.node);
                return
            }
        });

        if (!listOfHandles.includes(pimProduct.node.handle)) {
            nodesToBeCreated.push(pimProduct.node);
            listOfHandles.push(pimProduct.node.handle);
            recieverService.createProduct(pimProduct.node);
        }

    }

    console.log('NUMBER OF PRODUCTS ON PIM: ', pimProducts.length);
    console.log('NUMBER OF PRODUCTS TO BE UPDATED: ', nodesToBeUpdated.length);
    console.log('NUMBER OF PRODUCTS TO BE CREATED: ', nodesToBeCreated.length);

    res.json({ status: 'Sync completed', synced: pimProducts.length });
}

module.exports = syncProducts;
