import express, { Application } from "express"; // nạp express
import bodyParser from "body-parser"; // nạp body-parser
import viewEngine from "./config/viewEngine"; // nạp viewEngine
import initWebRoutes from "./route/web"; // nạp file web từ Route
import connectDB from "./config/configdb";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // gọi hàm config của dotenv để chạy lệnh process.env.PORT

const app: Application = express();

// config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views"))); // đảm bảo đúng đường dẫn khi build TS

// cấu hình view engine và routes
viewEngine(app);
initWebRoutes(app);

// kết nối DB
connectDB();

// lấy port từ env hoặc default 6969
const port: number = Number(process.env.PORT) || 6969;

// chạy server
app.listen(port, () => {
  console.log(`✅ Backend Nodejs is running on the port : ${port}`);
});
