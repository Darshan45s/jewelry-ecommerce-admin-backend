const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

/**
 * CONNECT DATABASE
 */

const sequelize = new Sequelize(
  process.env.db,
  process.env.user,
  process.env.password,
  {
    host: process.env.host,
    dialect: process.env.dialect,
    operatorsAliases: 0,
    logging: false,
  }
);

sequelize.sync({ force: false }).then(() => {
  console.log("database connected!");
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("../models/adminModel")(sequelize, Sequelize);
db.vandor = require("../models/vendorModel")(sequelize, Sequelize);




module.exports = db;
