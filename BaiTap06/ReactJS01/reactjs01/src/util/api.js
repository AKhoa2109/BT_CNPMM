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

const searchProductsApi = ({ q = "", category, page = 1, limit = 10, priceMin, priceMax, isOnSale, sortField, sortOrder }) => {
  let params = new URLSearchParams();
  if (q) params.append("q", q);
  if (category) params.append("category", category);
  if (priceMin != null) params.append("priceMin", priceMin);
  if (priceMax != null) params.append("priceMax", priceMax);
  if (isOnSale != null) params.append("isOnSale", isOnSale);
  if (sortField) params.append("sortField", sortField);
  if (sortOrder) params.append("sortOrder", sortOrder);
  params.append("page", page);
  params.append("limit", limit);

  const URL_API = `/v1/api/search?${params.toString()}`;
  return axios.get(URL_API);
};

export {
    createUserApi, loginApi, getUserApi, getProductsApi,
    getAllCategoriesApi, searchProductsApi
}
