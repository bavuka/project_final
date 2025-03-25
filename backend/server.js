import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/postgres.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import db from "./models/index.js"; // Importing models to register associations
import zoomRoutes from "./routes/zoomRoutes.js";
import router from "./routes/appointmentRoutes.js";


const app = express();
const port = process.env.PORT || 4000;

async function startServer() {
  try {
    // Connect to PostgreSQL
    await connectDB();

    // Synchronize all models and associations with the database
    await db.sequelize.sync({ alter: true });
    console.log("Database Synced Successfully");

    // Initialize Cloudinary
    connectCloudinary();

    // Middlewares
    app.use(express.json());
    app.use(cors());

    // API endpoints
    app.use("/api/user", userRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/doctor", doctorRouter);
    app.use("/api/zoom", zoomRoutes);
    app.use("/api/appointments", router); 
    app.get("/", (req, res) => {
      res.send("API Working");
    });

    // Start the server
    app.listen(port, () => console.log(`Server started on PORT: ${port}`));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
