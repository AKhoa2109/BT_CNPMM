import db from "../models/index"; // import database
import { User } from "../models/user";
import CRUDService from "../services/CRUDService"; // import service
import { Request, Response, RequestHandler } from "express";
const UserModel =  db.User as typeof User; // lấy model User
const crudService = new CRUDService();
class HomeController {
  // GET /
  public getHomePage: RequestHandler = async (req: Request, res: Response) => {
    try {
      const data = await UserModel.findAll(); // lấy dữ liệu từ models/index
      console.log("....................");
      console.log(data);
      console.log("....................");

      return res.render("homepage.ejs", {
        data: JSON.stringify(data), // trả dữ liệu ra view
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Error loading homepage");
    }
  };

  // GET /about
  public getAboutPage: RequestHandler = (req: Request, res: Response) => {
    return res.render("test/about.ejs");
  };

  // GET /crud
  public getCRUD: RequestHandler = (req: Request, res: Response) => {
    return res.render("crud.ejs");
  };

  // GET /get-crud
  public getFindAllCrud: RequestHandler = async (req: Request, res: Response) => {
    const data = await crudService.getAllUser();
    return res.render("users/findAllUser.ejs", {
      datalist: data,
    });
  };

  // POST /post-crud
  public postCRUD: RequestHandler = async (req: Request, res: Response) => {
    const message = await crudService.createNewUser(req.body);
    console.log(message);
    return res.send("Post crud to server");
  };

  // GET /edit-crud
  public getEditCRUD: RequestHandler = async (req: Request, res: Response) => {
    const userId = req.query.id as string | undefined;
    if (userId) {
      const userData = await crudService.getUserInfoById(Number(userId));
      return res.render("users/updateUser.ejs", {
        data: userData,
      });
    } else {
      return res.send("Không lấy được id");
    }
  };

  // POST /put-crud
  public putCRUD: RequestHandler = async (req: Request, res: Response) => {
    const data = req.body;
    const data1 = await crudService.updateUser(data);
    return res.render("users/findAllUser.ejs", {
      datalist: data1,
    });
  };

  // GET /delete-crud
  public deleteCRUD: RequestHandler = async (req: Request, res: Response) => {
    const id = req.query.id as string | undefined;
    if (id) {
      await crudService.deleteUserById(Number(id));
      return res.send("Deleted!!!!!!!!!!!!!!");
    } else {
      return res.send("Not find user");
    }
  };
}

export default new HomeController();