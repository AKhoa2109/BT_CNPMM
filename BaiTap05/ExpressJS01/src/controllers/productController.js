import {getProducts} from '../services/productService.js';

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