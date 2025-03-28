import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: "postgres",
  }
);

// Test the connection
try {
  await sequelize.authenticate();
  console.log("Connected to PostgreSQL");
} catch (err) {
  console.error("Unable to connect to the database:", err);
}

export default sequelize;
