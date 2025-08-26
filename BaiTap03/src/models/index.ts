import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";

dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(path.join(__dirname, "..", "config", "config.json"))[env];

export interface Db {
  [key: string]: ModelStatic<Model> | any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: Db = {} as Db;

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load tất cả models trong thư mục hiện tại (trừ index.ts)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      file.indexOf(".test.") === -1
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      DataTypes
    ) as ModelStatic<Model>;
    db[model.name] = model;
  });

// Khởi tạo associations
Object.keys(db).forEach((modelName) => {
  const model = db[modelName] as any;
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
