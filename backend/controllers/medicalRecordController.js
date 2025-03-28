import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import MedicalRecord from "../models/medicalRecordModel.js";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import { ensureUploadsDirectory } from "../utils/fileUtils.js";
import Appointment from "../models/appointmentModel.js";
// Handle `__dirname` in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists before any file operations
ensureUploadsDirectory();

// Store a medical record (text or file)
export const storeMedicalRecord = async (req, res) => {
  const { userId, doctorId, medicalHistory } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    let record;
    if (req.file) {
      const filePath = path.join("uploads", req.file.filename);
      record = await MedicalRecord.create({
        userId,
        doctorId,
        medicalHistory: filePath,
        fileType: path.extname(req.file.originalname).toLowerCase(),
      });
    } else if (medicalHistory) {
      record = await MedicalRecord.create({
        userId,
        doctorId,
        medicalHistory,
        fileType: "text",
      });
    } else {
      return res.status(400).json({ message: "Medical history or file is required" });
    }

    return res.status(201).json({ message: "Medical record stored successfully", record });
  } catch (error) {
    console.error("Error storing medical record:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Fetch all medical records for a specific user and doctor
export const getAllMedicalRecordsJSON = async (req, res) => {
  // Remove parseInt conversions to keep userId and doctorId as strings (UUIDs)
  const { userId, doctorId } = req.params;

  try {
    const records = await MedicalRecord.findAll({
      where: { userId, doctorId },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Doctor, attributes: ["name", "email"] },
      ],
    });

    if (!records.length) {
      return res.status(404).json({ message: "No medical records found" });
    }

    const medicalRecords = await Promise.all(
      records.map(async (record) => {
        const filePath = path.resolve(__dirname, "../", record.medicalHistory);
        let isFile = false;
        try {
          await fs.access(filePath);
          isFile = true;
        } catch (error) {
          isFile = false;
        }
        return {
          id: record.id,
          medicalHistory: record.medicalHistory,
          isFile,
          user: { name: record.User.name, email: record.User.email },
          doctor: { name: record.Doctor.name, email: record.Doctor.email },
        };
      })
    );

    return res.status(200).json({ medicalRecords });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Fetch all medical records for a user
export const getMedicalRecordsByUser = async (req, res) => {
  // Keep userId as string (UUID)
  const { userId } = req.params;

  try {
    const records = await MedicalRecord.findAll({
      where: { userId },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: Doctor, attributes: ["name", "email"] },
      ],
    });

    if (!records.length) {
      return res.status(404).json({ message: "No medical records found" });
    }

    const medicalRecords = await Promise.all(
      records.map(async (record) => {
        const filePath = path.resolve(__dirname, "../", record.medicalHistory);
        let isFile = false;
        try {
          await fs.access(filePath);
          isFile = true;
        } catch (error) {
          isFile = false;
        }
        return {
          id: record.id,
          medicalHistory: record.medicalHistory,
          isFile,
          user: { name: record.User.name, email: record.User.email },
          doctor: { name: record.Doctor.name, email: record.Doctor.email },
        };
      })
    );

    return res.status(200).json({ medicalRecords });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Fetch all unique doctors a user has visited
export const getDoctorsVisitedByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Query all appointments for the user without filtering on completion or cancellation status
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [{
        model: Doctor,
        as: "doctor", // Use the alias defined in your association
        attributes: { exclude: ["password", "createdAt", "updatedAt"] }
      }],
    });

    if (!appointments.length) {
      return res.status(404).json({ message: "No appointments found for the given user" });
    }

    // Deduplicate doctors by their ID
    const uniqueDoctors = {};
    appointments.forEach((appointment) => {
      if (appointment.doctor) {
        uniqueDoctors[appointment.doctor.id] = appointment.doctor;
      } else if (appointment.docData && appointment.docData.id) {
        uniqueDoctors[appointment.docData.id] = appointment.docData;
      }
    });

    return res.status(200).json({ doctors: Object.values(uniqueDoctors) });
  } catch (error) {
    console.error("Error fetching doctors visited by user:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  const { recordId } = req.params; // Get the record ID from request params

  try {
    const record = await MedicalRecord.findByPk(recordId);

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    // Check if the record has an associated file and delete it from storage
    if (record.fileType !== "text" && record.medicalHistory) {
      const filePath = path.resolve(__dirname, "../", record.medicalHistory);
      try {
        await fs.access(filePath); // Check if file exists
        await fs.unlink(filePath); // Delete the file
      } catch (error) {
        console.warn("File not found or already deleted:", filePath);
      }
    }

    // Delete the record from the database
    await record.destroy();

    return res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
