import mongoose from "mongoose";
import Category from "./category.js";
import {indexProductToES, deleteProductFromES} from '../services/esSyncProduct.js';
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    views: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    isOnSale: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.post("save", async function (doc) {
  try {
    const cat = await Category.findById(doc.category).lean();
    const productForIndex = {
      ...doc.toObject(),
      categoryName: cat ? cat.name : null,
    };
    await indexProductToES(productForIndex);
  } catch (err) {
    console.error("Error sync save:", err);
  }
});

productSchema.post("remove", async function (doc) {
  try {
    await deleteProductFromES(doc._id);
  } catch (err) {
    console.error("Error sync remove:", err);
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;