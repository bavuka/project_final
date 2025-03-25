import { sequelize } from "../config/postgres.js";
import Appointment from "./appointmentModel.js";
import Doctor from "./doctorModel.js";
import User from "./userModel.js";

// Define associations

// An appointment belongs to a doctor
Appointment.belongsTo(Doctor, {
  foreignKey: "docId",
  as: "doctor",
});

// A doctor can have many appointments
Doctor.hasMany(Appointment, {
  foreignKey: "docId",
  as: "appointments",
});

// An appointment belongs to a user (patient)
Appointment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// A user can have many appointments
User.hasMany(Appointment, {
  foreignKey: "userId",
  as: "appointments",
});

const db = {
  sequelize,
  Appointment,
  Doctor,
  User,
};

export default db;
