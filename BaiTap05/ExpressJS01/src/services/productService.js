import Product from "../models/product.js";

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

