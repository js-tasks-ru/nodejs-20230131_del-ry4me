const { forEach } = require('lodash');
const {category} = require('../mappers/category');
const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const query = await Category.find();
  query.forEach((item) => {
    item = category(item);
  })
  ctx.body = {categories: query};
};
