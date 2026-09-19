const Product = require ('../../../models/productModel')



// create product
const createProduct = async (req, res) => {
    const { productName, productDescription, productStockQty, productStatus, productPrice } = req.body;
    if (!productName || !productDescription || !productStockQty || !productStatus || !productPrice) {
        return res.status(400).json({ message: "All fields are required" });
    }


    await Product.create({
        productName,
        productDescription,
        productStockQty,
        productStatus,
        productPrice,
        productImage: "https://res.cloudinary.com/dxjv8qg0f/image/upload/v1690911873/ddd/pexels-pixabay-163064_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.jpg"

    })
    return res.status(201).json({ message: "Product created successfully" });
}



//get all product
const getAllProduct = async (req, res) => {
    const product = await Product.find();
    return res.status(200).json({
        message: "Product fetched succesfully",
        data: product
    });
}



// /get single product

const getSingleProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product){
        return res.status(404).json({
            message: "Product not found"
        });
    }
    return res.status(200).json({
        message: " Product fetched succesfully",
        data: product
    })
}



//  update product
const updateProduct = async (req, res)=> {
    const id = req.params.id;
    const { productName, productDescription, productStockQty, productStatus, productPrice } = req.body;
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    const product = await Product.findByIdAndUpdate(id);
    if(!product) {
        return res.status(404).json({
            message: "Product not found"
        })
    }
    await Product.findByIdAndUpdate(id, {
        productName,
        productDescription,
        productStockQty,
        productStatus,
        productPrice,
        productImage: "https://res.cloudinary.com/dxjv8qg0f/image/upload/v1690911873/ddd/pexels-pixabay-163064_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.jpg"
    })
    return res.status(200).json({
        message: "Product updated successfully"
    })

// delete product
const deleteSingleProduct = async (req, res)=> {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if(!product) {
        return res.status(404).json({
            message: "Product not found"
        })
    }
    return res.status(200).json ({
        message: " Product deleted Succesfully"
    })
}






module.exports = {
    createProduct ,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteSingleProduct
}


