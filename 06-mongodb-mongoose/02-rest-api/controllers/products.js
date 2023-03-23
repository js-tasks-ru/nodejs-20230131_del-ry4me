const { default: mongoose } = require("mongoose");
const mapProduct = require("../mappers/product");
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  
  const products = await Product.find({subcategory: subcategory}).limit(20);
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {

  const products = await Product.find();
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'wrong id');
  }
  const p = await Product.findOne({_id: ctx.params.id});
  if (!p) {
    ctx.throw(404, 'not found');
  }

  ctx.body = {product: mapProduct(p)};
};


