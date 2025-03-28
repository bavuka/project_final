import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js"; // Ensure correct path
import User from "./userModel.js";
import Doctor from "./doctorModel.js";

const MedicalRecord = sequelize.define(
  "MedicalRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE", // Delete medical records if the user is deleted
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Doctor,
        key: "id",
      },
      onDelete: "CASCADE", // Delete medical records if the doctor is deleted
    },
    medicalHistory: {
      type: DataTypes.TEXT, // Stores direct text
      allowNull: false,
      validate: {
        len: [5, 10000], // Ensuring reasonable text length
      },
    },
    filePath: {
      type: DataTypes.STRING, // Stores the path to a file if needed
      allowNull: true,
    },
    fileType: {
      type: DataTypes.STRING, // Example: '.pdf', '.txt'
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "medical_records",
  }
);

// Define associations
MedicalRecord.belongsTo(User, { foreignKey: "userId" });
MedicalRecord.belongsTo(Doctor, { foreignKey: "doctorId" });

export default MedicalRecord;
