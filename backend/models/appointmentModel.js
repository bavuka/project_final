import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Appointment = sequelize.define("Appointment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    docId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    slotDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slotTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userData: {
        type: DataTypes.JSONB, // PostgreSQL supports JSONB for object storage
        allowNull: false,
    },
    docData: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.BIGINT, // Storing as Unix timestamp
        allowNull: false,
    },
    cancelled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    payment: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "appointments",
    timestamps: true, // Automatically adds createdAt & updatedAt fields
});

export default Appointment;
