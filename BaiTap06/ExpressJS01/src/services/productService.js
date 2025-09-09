import Product from "../models/product.js";
import { esClient, PRODUCT_INDEX } from "../config/elasticsearch.js";

export const getProducts = async (categoryId, page,limit=3) => {
    try{
        const filter = categoryId ? { category: categoryId } : {};
        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
        .populate('category','name')
        .skip(skip)
        .limit(limit)
        .lean();

        const total = await Product.countDocuments(filter);

        return { products, total, page, totalPages: Math.ceil(total / limit) };
    }
    catch(error){
        console.log(error);
        return null;
    }
}

export const searchProducts = async ({ q = "", filters = {}, sort = { field: "_score", order: "desc" }, page = 1, limit = 10 }) => {
  try {
    const must = [];
    const filter = [];

    if (q && q.trim().length > 0) {
      must.push({
        multi_match: {
          query: q,
          fields: ["name^3", "description", "categoryName"],
          fuzziness: "AUTO",
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    if (filters.category) filter.push({ term: { category: filters.category } });

    if (filters.priceMin != null || filters.priceMax != null) {
      const rangeQuery = {};
      if (filters.priceMin != null) rangeQuery.gte = filters.priceMin;
      if (filters.priceMax != null) rangeQuery.lte = filters.priceMax;
      filter.push({ range: { price: rangeQuery } });
    }

    const esSort = [];
    if (sort.field === "_score") {
      esSort.push({ _score: { order: sort.order } });
    } else {
      esSort.push({ [sort.field]: { order: sort.order } });
    }

    const from = (page - 1) * limit;

    const body = {
      query: { bool: { must, filter } },
      from,
      size: limit,
      sort: esSort,
    };

    const res = await esClient.search({ index: PRODUCT_INDEX, body });
    const hits = res.hits.hits.map((h) => ({
      id: h._id,
      ...h._source,
      score: h._score,
    }));
    const total = res.hits.total.value || 0;

    return { products: hits, total, page, totalPages: Math.ceil(total / limit) };
  } catch (err) {
    console.error("searchProducts err", err);
    throw err;
  }
};


