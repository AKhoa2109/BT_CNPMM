import Category from "../models/category.js";
export const getCagtegoryies = async () => {
    try{
        const categories = await Category.find({});
        return categories;
    }
    catch(error){
        console.log(error);
        return null;
    }
}