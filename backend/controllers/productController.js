const Product = require('../models/productModel'); // Example model
const ErrorHandler =require('../utils/errorHandler')
const catchAsyncError =require('../middlewares/catchAsyncError')
const APIFeatures =require('../utils/apiFeatures')
exports.getProduct = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Product.find(),req.query).search().filter().paginate()
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products
    });
});

exports.newProduct = catchAsyncError(async (req, res, next) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400)); // Send error response
    }
  });
  

exports.getsingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    });
};

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    });
};

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    await Product.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
};

exports.getActiveProduct = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Product.find({ status: true }),req.query).search().filter().paginate()
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products
    });
});
