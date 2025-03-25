import { useState } from "react";
import axios from "axios";

export default function VideoConsultation() {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoLive = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch appointment details (doctor ID, patient ID, patient email)
      const appointmentRes = await axios.post("http://localhost:4000/api/user/book-appointment");
      const { docId, userId, userData } = appointmentRes.data;

      // Generate Zoom meeting
      const zoomRes = await axios.post("http://localhost:4000/api/zoom/meeting", {
        doctorId: docId,
        patientId: userId,
        patientEmail: userData.email,
      });

      setMeetingUrl(zoomRes.data.meeting_url);
      console.log("meetingUrl", meetingUrl)
    } catch (err) {
      setError("Failed to create Zoom meeting. Try again.");
      console.error("Zoom Error:", err.response?.data || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Video Consultation</h1>
      <button
        onClick={handleGoLive}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Starting..." : "Go Live"}
      </button>

      {meetingUrl && (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
          <p className="font-semibold">Meeting Link:</p>
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Join Meeting
          </a>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
