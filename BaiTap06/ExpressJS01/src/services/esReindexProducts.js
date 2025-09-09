// esReindexProducts.js
import { esClient, PRODUCT_INDEX } from "../config/elasticsearch.js";
import Product from "../models/product.js";

export const reindexAllProducts = async () => {
  try {
    console.log("Bắt đầu reindex dữ liệu từ MongoDB sang Elasticsearch...");

    const products = await Product.find().lean();
    if (!products.length) {
      console.log("Không có sản phẩm nào trong MongoDB.");
      return;
    }

    // ensure index exists first
    const existsRes = await esClient.indices.exists({ index: PRODUCT_INDEX });
    const exists = (typeof existsRes === "object" && "body" in existsRes) ? existsRes.body : existsRes;
    if (!exists) {
      console.log(`Index ${PRODUCT_INDEX} chưa tồn tại - tạo index trước khi reindex.`);
      await esClient.indices.create({ index: PRODUCT_INDEX });
    }

    // chuẩn bị dữ liệu bulk
    const body = products.flatMap((product) => [
      { index: { _index: PRODUCT_INDEX, _id: product._id.toString() } },
      {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category?.toString() || null,
        categoryName: product.categoryName || null,
        image: product.image || null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    ]);

    // xóa toàn bộ dữ liệu cũ trong index (nếu có)
    await esClient.deleteByQuery({
      index: PRODUCT_INDEX,
      body: { query: { match_all: {} } },
    }).catch((e) => {
      // nếu lỗi 404 (index không tồn tại) thì bỏ qua
      if (!(e.meta && e.meta.statusCode === 404)) {
        throw e;
      }
    });

    const bulkResponse = await esClient.bulk({
      refresh: true,
      body,
    });

    if (bulkResponse.errors) {
      const erroredDocs = [];
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocs.push({
            status: action[operation].status,
            error: action[operation].error,
            doc: body[i * 2 + 1],
          });
        }
      });
      console.error("Lỗi khi reindex:", erroredDocs);
    } else {
      console.log(`Reindex thành công ${products.length} sản phẩm.`);
    }
  } catch (err) {
    console.error("Lỗi reindexAllProducts:", err);
  }
};
