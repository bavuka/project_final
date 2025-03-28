// src/components/VisitedDoctors.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const VisitedDoctors = () => {
  const { token, userData } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [visitedDoctors, setVisitedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisitedDoctors = async () => {
    if (!userData || !userData.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${backendUrl}/medicalrecords/user/${userData.id}/doctors`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.doctors?.length) {
        setVisitedDoctors(response.data.doctors);
      } else {
        setError('No visited doctors found.');
      }
    } catch (err) {
      console.error("Error fetching visited doctors:", err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchVisitedDoctors();
    }
  }, [userData]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Visited Doctors</h2>

      {loading && (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500 text-xl">Loading visited doctors...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchVisitedDoctors} 
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && visitedDoctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visitedDoctors.map((doctor) => (
            <Link
              key={doctor.id}
              to={`/medical-records/${doctor.id}`}
              state={{ doctor }}
            >
              <div className="bg-white border rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1 p-4">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
                <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                <p className="text-gray-600 mb-2">{doctor.speciality}</p>
                <p className={`font-medium ${doctor.available ? 'text-green-600' : 'text-red-600'}`}>
                  {doctor.available ? 'Available' : 'Not Available'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && visitedDoctors.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No visited doctors found.</p>
      )}
    </div>
  );
};

export default VisitedDoctors;
