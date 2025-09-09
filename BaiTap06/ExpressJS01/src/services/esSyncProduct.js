// services/esSyncProduct.js
import { esClient, PRODUCT_INDEX } from "../config/elasticsearch.js";

export const indexProductToES = async (product) => {
  if (!product || !product._id) return;
  const body = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category?.toString() || null,
    categoryName: product.categoryName || null,
    image: product.image || null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  try {
    await esClient.index({
      index: PRODUCT_INDEX,
      id: product._id.toString(),
      body,
      refresh: "wait_for",
    });
  } catch (err) {
    console.error("indexProductToES err", err);
  }
};

export const deleteProductFromES = async (productId) => {
  try {
    await esClient.delete({
      index: PRODUCT_INDEX,
      id: productId.toString(),
      refresh: "wait_for",
    });
  } catch (err) {
    if (err.meta?.statusCode !== 404) console.error("deleteProductFromES err", err);
  }
};
