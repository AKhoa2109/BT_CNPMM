import Product from "../models/product.js";
import { esClient, PRODUCT_INDEX } from "../config/elasticsearch.js";
import util from "util";
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

export const searchProducts = async ({ q = "", filters = {}, sort = { field: "_score", order: "desc" }, page = 1, limit = 10, debugExplain = false }) => {
  try {
    const mustFilters = []; // for filter clauses
    if (filters.category) mustFilters.push({ term: { category: filters.category } });
    if (filters.priceMin != null || filters.priceMax != null) {
      const rangeQuery = {};
      if (filters.priceMin != null) rangeQuery.gte = filters.priceMin;
      if (filters.priceMax != null) rangeQuery.lte = filters.priceMax;
      mustFilters.push({ range: { price: rangeQuery } });
    }

    const should = [];
    if (q && q.trim().length > 0) {
      // 1) Exact phrase match on name (highest priority)
      should.push({ match_phrase: { name: { query: q, boost: 6 } } });

      // 2) Prefix phrase (good for "starts with" / autocomplete)
      should.push({ match_phrase_prefix: { name: { query: q, boost: 3 } } });

      // 3) Multi-match with controlled fuzziness and boosts
      should.push({
        multi_match: {
          query: q,
          fields: ["name^3", "description"],
          type: "best_fields",
          fuzziness: "AUTO", // you can change to 1 or remove if too fuzzy
          max_expansions: 50,
        },
      });

      // optional: small match on categoryName
      should.push({ match: { categoryName: { query: q, boost: 1 } } });
    } else {
      // if q empty -> match_all behavior
      should.push({ match_all: {} });
    }

    // require at least one should clause if q present
    const boolQuery = {
      bool: {
        must: mustFilters,
        should,
        minimum_should_match: q && q.trim().length > 0 ? 1 : 0,
      },
    };

    const esSort = [];
    if (sort.field === "_score") {
      esSort.push({ _score: { order: sort.order } });
    } else {
      esSort.push({ [sort.field]: { order: sort.order } });
    }

    const from = (page - 1) * limit;

    const body = {
      query: boolQuery,
      from,
      size: limit,
      sort: esSort,
    };

    // add explain for debugging if needed
    const esRes = await esClient.search({ index: PRODUCT_INDEX, body, explain: debugExplain });

    console.log("ES raw response:", util.inspect(esRes, { depth: 4 }));

    const getHitsArray = (r) =>
      (r && r.body && r.body.hits && r.body.hits.hits) ||
      (r && r.hits && r.hits.hits) ||
      [];

    const hitsArr = getHitsArray(esRes);

    // total handling
    let total = 0;
    const totalRaw =
      (esRes && esRes.body && esRes.body.hits && esRes.body.hits.total) ||
      (esRes && esRes.hits && esRes.hits.total);
    if (totalRaw != null) total = typeof totalRaw === "object" ? totalRaw.value : totalRaw;

    const hits = hitsArr.map((h) => {
      const source = h._source || (h.body && h.body._source) || {};
      return {
        id: h._id || (h.body && h.body._id) || source.id,
        ...source,
        score: h._score ?? (h.body && h.body._score) ?? null,
      };
    });

    return { products: hits, total, page, totalPages: Math.ceil(total / limit) };
  } catch (err) {
    console.error("searchProducts err", err);
    throw err;
  }
};


