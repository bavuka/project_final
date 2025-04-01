import axios from "axios";
import base64 from "base-64";
import ZoomMeeting from "../models/ZoomMeeting.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Generate Zoom API Authentication Headers
const getAuthHeaders = () => ({
  Authorization: `Basic ${base64.encode(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  )}`,
  "Content-Type": "application/json",
});

// Get Zoom Access Token
const generateZoomAccessToken = async () => {
  try {
    const response = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Zoom Access Token Error:", err.response?.data || err.message);
    throw err;
  }
};

// Generate a Zoom Meeting
 const generateZoomMeeting = async (doctorId, patientId, patientEmail) => {
  try {
    const zoomAccessToken = await generateZoomAccessToken();

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        agenda: "My meeting",
        duration: 60,
        password: "123456",
        settings: {
          allow_multiple_devices: true,
          max_participants: 1,
          alternative_hosts_email_notification: true,
          contact_email: "bavukakayalot@gmail.com",
          contact_name: "Bavuka K",
          email_notification: true,
          encryption_type: "enhanced_encryption",
          focus_mode: true,
          host_video: true,
          join_before_host: true,
          mute_upon_entry: true,
          participant_video: true,
          private_meeting: true,
          waiting_room: false,
          continuous_meeting_chat: {
            enable: true,
            auto_add_invited_external_users: true,
            auto_add_meeting_participants: true,
          },
        },
        start_time: new Date().toISOString(),
        timezone: "Asia/Kolkata",
        topic: "Welcome to AI Doc Finder",
        type: 2, // Scheduled meeting
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${zoomAccessToken}`,
        },
      }
    );

    const { join_url, start_time } = response.data;

    // Store meeting details in the database
    const newMeeting = await ZoomMeeting.create({
      patient_id: patientId,
      doctor_id: doctorId,
      meeting_url: join_url,
      start_time,
    });

    // Send email to the patient
    await sendMeetingEmail(patientEmail, join_url);

    return newMeeting;
  } catch (err) {
    console.error("generateZoomMeeting Error:", err.response?.data || err.message);
    throw err;
  }
};

// Send Meeting Link via Email
const sendMeetingEmail = async (to, meetingUrl) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your AI DOC FINDER Consultation Link",
    text: `Hello,\n\nHere is your Zoom meeting link: ${meetingUrl} \n\nPlease join on time.\n\nBest regards,\nAI DOC FINDER`,
  };

  await transporter.sendMail(mailOptions);
};

export { generateZoomMeeting };
