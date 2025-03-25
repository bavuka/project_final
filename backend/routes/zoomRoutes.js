import express from "express";
import { generateZoomMeeting } from "../Services/zoomService.js";

const router = express.Router();

router.post("/create-meeting", async (req, res) => {
  try {
    const { doctorId, patientId, patientEmail } = req.body;

    if (!doctorId || !patientId || !patientEmail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const meeting = await generateZoomMeeting(doctorId, patientId, patientEmail);
    res.status(201).json({ message: "Meeting created", meeting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
