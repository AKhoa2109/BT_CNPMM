import dotenv from 'dotenv';
dotenv.config();
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const createUserService = async (name, email, password) => {
    try {
        //check user exist
        const user = await User.findOne({ email });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }

        //hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export const loginService = async (email, password) => {
    try {
        //fetch user by email
        const user = await User.findOne({ email: email });
        if (user) {
            //compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                }
            }
            else {
            //create an access token
            const payload = {
                email: user.email,
                name: user.name
            }

            const access_token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRE
                }
            )

            return {
                EC: 0,
                access_token,
                user: {
                    email: user.email,
                    name: user.name
                }
            };
            }
        } 
        else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 1,
            EM: "Lỗi hệ thống"
        }
    }
}

export const getUserService = async () => {
    try {
        const users = await User.find({}).select('-password');
        return users;
    } catch (error) {
        console.log(error);
        return null;
    }
}
