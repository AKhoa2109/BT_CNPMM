import express from 'express';
import {createUser, handleLogin, getUser, getAccount} from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import delay from '../middleware/delay.js';
import { getAllProductsByCategory } from '../controllers/productController.js';
import { getCategories } from '../controllers/categoryController.js';

const routerAPI = express.Router();

routerAPI.use(auth); //global middleware

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.get("/categories", getCategories);
routerAPI.get("/products/by-category/:id", getAllProductsByCategory);
routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

export default routerAPI; //export default
