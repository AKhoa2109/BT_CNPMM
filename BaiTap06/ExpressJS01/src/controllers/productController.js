import {getProducts, searchProducts} from '../services/productService.js';

export const getAllProductsByCategory = async (req, res) => {
    try{
        const categoryId = req.params.id;
        const {  page, limit } = req.query;
        const data = await getProducts(categoryId, Number(page) || 1, Number(limit) || 10);

        return res.status(200).json({
            EC:0,
            data
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            EC:1,
            EM: "Lỗi server"
        });
    }
}

export const searchProductsController = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filters = {
      category: req.query.category || undefined,
      priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
      priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
    };

    const sort = {
      field: req.query.sortField || "_score",
      order: req.query.sortOrder || "desc",
    };

    const data = await searchProducts({ q, filters, sort, page, limit });
    console.log("searchProductsController result:", { q, filters, sort, page, limit, total: data?.total, productsCount: data?.products?.length });

    return res.status(200).json({ EC: 0, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ EC: 1, EM: "Lỗi server khi search" });
  }
};