const { default: mongoose } = require("mongoose");
const {product} = require("../mappers/product");
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();
  const sub = await Product.find({_id: subcategory});
  sub.forEach((el) => {
    el = product(el);
  })
  ctx.body = {products: sub};
};

module.exports.productList = async function productList(ctx, next) {
  const p = await Product.find();
  p.forEach((element) => {
    element = product(element);
  });
  ctx.body = {products: p};
};

module.exports.productById = async function productById(ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400, 'wrong id');
  }
  const p = await Product.findOne({_id: ctx.params.id});
  if (!p) {
    ctx.throw(404, 'not found');
  }

  ctx.body = {product: product(p)};
};

