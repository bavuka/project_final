import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Use TLS (587)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Function to send email notification
const sendAppointmentNotification = async (patientEmail, appointmentData) => {
    if (!patientEmail || !appointmentData.doctor || !appointmentData.date || !appointmentData.time) {
        console.error("❌ Missing required fields for email.");
        return { success: false, message: "Missing required fields" };
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: patientEmail,
            subject: "Appointment Confirmation - AI DOC FINDER",
            text: `Dear Patient,\n\nYour appointment has been successfully booked.\n\nDoctor: ${appointmentDetails.doctor}\nDate: ${appointmentDetails.date}\nTime: ${appointmentDetails.time}\n\nThank you for choosing AI DOC FINDER.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.response);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        return { success: false, message: "Failed to send email", error: error.message };
    }
};

export default sendAppointmentNotification;
