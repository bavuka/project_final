import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: "postgres",
    port: process.env.PG_PORT || 5432,
    logging: false, // Set to true to log SQL queries
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database Connected Successfully");
    } catch (err) {
        console.error("Database Connection Error:", err.message);
        process.exit(1);
    }
};

export { sequelize, connectDB };
