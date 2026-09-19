const { deleteSingleProduct } = require('../../../controller/admin/product/productController');
const { createProduct} = require ('../controller/admin/productController');

const router = require ('express').Router();

router.route('/create-product').post(createProduct);
router.route('/products').get(getAllProducts);
router.route('/products/:id').get(getSinglePRoduct).patch(updateSingleProduct).delete(deleteSingleProduct)



module.exports = router;