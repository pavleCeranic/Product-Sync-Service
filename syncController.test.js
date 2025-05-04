const pimService = require('./services/pimService');
const recieverService = require('./services/recieverService');
const syncProducts = require('./controllers/syncController');
const httpMocks = require('node-mocks-http');

describe('syncProducts', () => {
    it('should call createProduct or updateProduct as expected', async () => {

        const mockPimProducts = [
            { node: { handle: 'shirt', title: 'Blue Shirt', vendor: 'Lemon', productType: 'Clothing' } },
            { node: { handle: 'hat', title: 'Black Hat', vendor: 'Lemon', productType: 'Accessories' } }
        ];

        const mockRecieverProducts = [
            { node: { handle: 'shirt', title: 'Old Shirt', vendor: 'Lemon', productType: 'Clothing' } }
        ];

        jest.spyOn(pimService, 'getPimProducts').mockResolvedValue(mockPimProducts);
        jest.spyOn(recieverService, 'getRecieverProducts').mockResolvedValue(mockRecieverProducts);

        const updateMock = jest.spyOn(recieverService, 'updateProduct').mockImplementation(() => { });
        const createMock = jest.spyOn(recieverService, 'createProduct').mockImplementation(() => { });

        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();

        await syncProducts(req, res);

        expect(updateMock).toHaveBeenCalledWith(mockPimProducts[0].node);
        expect(createMock).toHaveBeenCalledWith(mockPimProducts[1].node);

        const json = res._getJSONData();
        expect(json.status).toBe('Sync completed');
        expect(json.synced).toBe(mockPimProducts.length);
    });
});
