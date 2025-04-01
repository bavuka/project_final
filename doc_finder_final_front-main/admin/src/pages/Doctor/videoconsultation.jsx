// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function VideoConsultation() {
//   const [meetingUrl, setMeetingUrl] = useState("");
//   const [appointmentData, setAppointmentData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleGoLive = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       // Fetch appointment details (doctor ID, patient ID, patient email, etc.)
//       const appointmentRes = await axios.post("http://localhost:4000/api/user/book-appointment");
//       const data = appointmentRes.data;
//       if (data && data.docId && data.userId && data.userData?.email) {
//         setAppointmentData(data);
  
//         // Generate Zoom meeting
//         const zoomRes = await axios.post("http://localhost:4000/api/zoom/meeting", {
//           doctorId: data.docId,
//           patientId: data.userId,
//           patientEmail: data.userData.email,
//         });
  
//         if (zoomRes.data?.meeting_url) {
//           setMeetingUrl(zoomRes.data.meeting_url);
//         } else {
//           setError("Failed to retrieve meeting URL.");
//         }
//       } else {
//         setError("Invalid appointment data received.");
//       }
//     } catch (err) {
//       setError("Failed to create Zoom meeting. Try again.");
//       console.error("Zoom Error:", err.response?.data || err.message);
//     }
//     setLoading(false);
//   };

//   const handleViewMedicalRecords = () => {
//     if (appointmentData && !isNaN(Number(appointmentData.userId))) {
//       // Navigate to the doctor's medical records module with patient data.
//       navigate(`/doctor/medical-records/${appointmentData.userId}`, { 
//         state: { patient: appointmentData.userData } 
//       });
//     } else {
//       setError("Invalid appointment data. Cannot view medical records.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-4">Doctor Video Consultation</h1>
//       <button
//         onClick={handleGoLive}
//         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//         disabled={loading}
//       >
//         {loading ? "Starting..." : "Go Live"}
//       </button>

//       {meetingUrl && (
//         <div className="mt-4 p-4 bg-white shadow rounded-lg">
//           <p className="font-semibold">Meeting Link:</p>
//           <a
//             href={meetingUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline"
//           >
//             Join Meeting
//           </a>
//         </div>
//       )}

//       {appointmentData && (
//         <button
//           onClick={handleViewMedicalRecords}
//           className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
//         >
//           Records
//         </button>
//       )}

//       {error && <p className="text-red-500 mt-4">{error}</p>}
//     </div>
//   );
// }
