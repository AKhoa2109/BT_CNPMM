import { Sequelize } from 'sequelize';
// const { Sequelize } = require('sequelize'); // ES5 module

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('cnpm_new', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  port: 3306
});

let connectDB = async () => {

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
};

export default connectDB;
