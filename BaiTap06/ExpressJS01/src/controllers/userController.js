import {createUserService, loginService, getUserService} from '../services/userService.js';
export const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data);
}

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);

    return res.status(200).json(data);
}

export const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data);
}

export const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

