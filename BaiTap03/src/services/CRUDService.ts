import bcrypt from 'bcryptjs'; // import thư viện bcryptjs
import db from '../models/index'; //import database
import { User } from '../models/user';
const salt = bcrypt.genSaltSync(10); // thuật toán hash password

class CRUDService {
    // Hàm hash password
    public hashUserPassword = async (password: string): Promise<string> => {
        return bcrypt.hashSync(password, salt);
    };

    // Hàm tạo user mới
    public createNewUser = async (data: User): Promise<string> => {
    try {
        const hashPasswordFromBcrypt = await this.hashUserPassword(data.password);

        await (db.User as typeof User).create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === ("1" as any) ? true : false, // nếu gender là string
        roleId: data.roleId,
        });

        return "OK create a new user successfully";
    } catch (e) {
        throw e;
    }
    };


    //lấy tất cả findALL CRUD
    public getAllUser = async (): Promise<User[]> => {
    try {
        const users = await (db.User as typeof User).findAll({
        raw: true,
        });
        return users as unknown as User[];
    } catch (e) {
        throw e;
    }
    };

    //lấy findOne CRUD
    public getUserInfoById = async (userId: number): Promise<User | null> => {
    try {
        const user = await (db.User as typeof User).findOne({
        where: { id: userId },
        raw: true,
        });
        return user as unknown as User | null;
    } catch (e) {
        throw e;
    }
    };

    //hàm put CRUD
    public updateUser = async (data: Partial<User> & { id: number }): Promise<User[] | undefined> => {
    try {
        const user = await (db.User as typeof User).findOne({
        where: { id: data.id },
        });

        if (user) {
        user.firstName = data.firstName ?? user.firstName;
        user.lastName = data.lastName ?? user.lastName;
        user.address = data.address ?? user.address;

        await user.save();

        const allUsers = await (db.User as typeof User).findAll();
        return allUsers;
        } else {
        return undefined;
        }
    } catch (e) {
        throw e;
    }
    };

    //hàm xóa user
    public deleteUserById = async (userId: number): Promise<void> => {
    try {
        const user = await (db.User as typeof User).findOne({
        where: { id: userId },
        });
        if (user) {
        await user.destroy();
        }
    } catch (e) {
        throw e;
    }
    };

}
export default  CRUDService;