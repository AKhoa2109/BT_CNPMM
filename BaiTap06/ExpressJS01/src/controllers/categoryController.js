import { getCagtegoryies } from "../services/categoryService.js";
export const getCategories = async (req, res) => {
    try{
        const data = await getCagtegoryies();
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