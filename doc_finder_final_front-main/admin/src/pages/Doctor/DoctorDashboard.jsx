import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } =
    useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  const navigate = useNavigate();

  const [meetingUrls, setMeetingUrls] = useState({}); // Store meeting links for each appointment

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  const handleGoLive = async (appointmentId, item) => {
    try {
      const zoomRes = await axios.post("http://localhost:4000/api/zoom/create-meeting", {
        doctorId: item.docId,
        patientId: item.userId,
        patientEmail: item.userData.email,
      });

      const meetingLink = zoomRes.data.meeting.meeting_url;

      // Store the meeting URL for this specific appointment only
      setMeetingUrls((prev) => ({
        ...prev,
        [appointmentId]: meetingLink,
      }));
    } catch (err) {
      console.error("Zoom Error:", err.response?.data || err.message);
    }
  };

  // Function to navigate to the doctor's medical records view
  const handleViewRecords = (item) => {
    navigate(`/doctor/medical-records/${item.userId}`, {
      state: { patient: item.userData },
    });
  };

  return (
    dashData && (
      <div className="m-5">
        {/* Earnings, Appointments, Patients Section */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="Earnings" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency} {dashData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="Appointments" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="Patients" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white mt-10">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
            <img src={assets.list_icon} alt="Bookings" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
                <img className="rounded-full w-10" src={item.userData.image} alt="User" />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">{item.userData.name}</p>
                  <p className="text-gray-600">
                    Booking on {slotDateFormat(item.slotDate)}
                  </p>
                </div>

                {/* Show status or actions */}
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">Completed</p>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Cancel and Complete Buttons */}
                    <img
                      onClick={() => cancelAppointment(item.id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                    <img
                      onClick={() => completeAppointment(item.id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                      alt="Complete"
                    />
                    
                    {/* Go Live or Join Meeting Button */}
                    {!meetingUrls[item._id] ? (
                      <button
                        onClick={() => handleGoLive(item._id, item)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                      >
                        Go Live
                      </button>
                    ) : (
                      <a
                        href={meetingUrls[item._id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                      >
                        Join Meeting
                      </a>
                    )}

                    {/* New Records Button */}
                    <button
                      onClick={() => handleViewRecords(item)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs"
                    >
                      Records
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
