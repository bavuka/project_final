import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Doctor.findOne({ where: { email } });
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
            res.json({ success: true, token, doctorId: user.id });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await Appointment.findAll({ where: { docId } });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await Appointment.findByPk(appointmentId);
        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.update({ cancelled: true }, { where: { id: appointmentId } });
            return res.json({ success: true, message: 'Appointment Cancelled' });
        }
        res.json({ success: false, message: 'Appointment not found or not authorized' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;
        const appointmentData = await Appointment.findByPk(appointmentId);
        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.update({ isCompleted: true }, { where: { id: appointmentId } });
            return res.json({ success: true, message: 'Appointment Completed' });
        }
        res.json({ success: false, message: 'Appointment not found or not authorized' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            attributes: { exclude: ['password', 'email'] }
        });
        res.json({ success: true, doctors });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;
        const docData = await Doctor.findByPk(docId);
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        await Doctor.update({ available: !docData.available }, { where: { id: docId } });
        res.json({ success: true, message: 'Availability Changed' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor profile for Doctor Panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body;
        const profileData = await Doctor.findByPk(docId, {
            attributes: { exclude: ['password'] }
        });
        if (!profileData) {
            return res.json({ success: false, message: "Doctor not found" });
        }
        res.json({ success: true, profileData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body;
        await Doctor.update({ fees, address, available }, { where: { id: docId } });
        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body;
        const appointments = await Appointment.findAll({ where: { docId } });
        let earnings = 0;
        appointments.forEach((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        });
        const patientsSet = new Set();
        appointments.forEach((item) => {
            patientsSet.add(item.userId);
        });
        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patientsSet.size,
            latestAppointments: appointments.reverse() // Consider sorting by date if needed
        };
        res.json({ success: true, dashData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
};
