import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}

const getProductsApi = (id, page, limit=3) => {
    const URL_API = `/v1/api/products/by-category/${id}?page=${page}&limit=${limit}`;
    return axios.get(URL_API)
}

const getAllCategoriesApi = () => {
    const URL_API = "/v1/api/categories";
    return axios.get(URL_API)
}

export {
    createUserApi, loginApi, getUserApi, getProductsApi,
    getAllCategoriesApi
}
