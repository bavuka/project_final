import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js"; // Importing Sequelize instance

const Doctor = sequelize.define("Doctor", {
    id: {
        type: DataTypes.UUID, // Using UUID for unique IDs
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensures valid email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    speciality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    degree: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    experience: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    fees: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    slots_booked: {
        type: DataTypes.JSONB, // Using JSONB to store object data in PostgreSQL
        defaultValue: {},
    },
    address: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    date: {
        type: DataTypes.BIGINT, // Storing date as timestamp (milliseconds)
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: "doctors",
});

export default Doctor;
