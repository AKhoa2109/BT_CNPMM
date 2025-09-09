// services/esInit.js
import { esClient, PRODUCT_INDEX } from "../config/elasticsearch.js";

export const initProductIndex = async () => {
  const exists = await esClient.indices.exists({ index: PRODUCT_INDEX });
  if (!exists) {
    await esClient.indices.create({
      index: PRODUCT_INDEX,
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            description: { type: "text" },
            price: { type: "float" },
            category: { type: "keyword" },
            categoryName: { type: "text" },
            createdAt: { type: "date" }
          }
        }
      }
    });
    console.log(`Index ${PRODUCT_INDEX} created ✅`);
  } else {
    console.log(`Index ${PRODUCT_INDEX} already exists ⚡`);
  }
};


export default initProductIndex;
