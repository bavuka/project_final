import express from "express";
import sendAppointmentNotification from "../controllers/emailController.js"; // Add .js extension

const router = express.Router();

// Appointment Booking Route
router.post("/book", async (req, res) => {
    try {
        const { patientEmail, doctor, date, time } = req.body;

        // Validate request
        if (!patientEmail || !doctor || !date || !time) {
            return res.status(400).json({ message: "❌ Missing required fields" });
        }

        // Send email notification
        const response = await sendAppointmentNotification(patientEmail, { doctor, date, time });

        if (response.success) {
            return res.status(200).json({ message: "✅ Appointment booked successfully. Email sent." });
        } else {
            return res.status(500).json(response);
        }
    } catch (error) {
        console.error("❌ Error booking appointment:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default router;
