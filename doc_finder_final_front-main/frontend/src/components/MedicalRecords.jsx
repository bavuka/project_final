import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const MedicalRecords = () => {
  const { token, userData } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { doctorId } = useParams();
  const location = useLocation();
  const doctor = location.state?.doctor;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ medicalHistory: '', file: null });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [viewedPdf, setViewedPdf] = useState(null);

  const fetchRecords = async () => {
    if (!userData || !userData.id || !doctorId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${backendUrl}/medicalrecords/user/${userData.id}/${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords(res.data.medicalRecords);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && doctorId) {
      fetchRecords();
    }
  }, [userData, doctorId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      let response;
      if (formData.file) {
        const data = new FormData();
        data.append('userId', userData.id);
        data.append('doctorId', doctorId);
        data.append('file', formData.file);
        response = await axios.post(
          `${backendUrl}/medicalrecords`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else if (formData.medicalHistory) {
        response = await axios.post(
          `${backendUrl}/medicalrecords`,
          {
            userId: userData.id,
            doctorId: doctorId,
            medicalHistory: formData.medicalHistory,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        setSubmitError('Please provide either a file or medical history text.');
        setSubmitLoading(false);
        return;
      }
      setSubmitSuccess('Record stored successfully!');
      setFormData({ medicalHistory: '', file: null });
      fetchRecords();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to store record');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete functionality
  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(
        `${backendUrl}/medicalrecords/delete/${recordId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update UI after deletion
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting record');
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Medical Records for Dr. {doctor?.name || doctorId}
      </h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label htmlFor="medicalHistory" className="block text-gray-700 font-medium mb-2">
            Medical History (Text)
          </label>
          <textarea 
            id="medicalHistory"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
            Or Upload a File (PDF or text)
          </label>
          <input 
            type="file"
            id="file"
            name="file"
            accept="application/pdf,text/*"
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        {submitError && <div className="mb-4 text-red-600">{submitError}</div>}
        {submitSuccess && <div className="mb-4 text-green-600">{submitSuccess}</div>}
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={submitLoading}
        >
          {submitLoading ? 'Submitting...' : 'Submit Record'}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading records...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button onClick={fetchRecords} className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Retry</button>
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => {
            const isPDF = record.isFile && record.medicalHistory.toLowerCase().endsWith('.pdf');
            const fileUrl = `${backendUrl}/${record.medicalHistory.replace(/\\/g, '/')}`;
            return (
              <div key={record.id} className="border rounded p-4 shadow-sm">
                <p><strong>Medical History:</strong></p>
                {record.isFile ? (
                  <div>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open PDF in New Tab</a>
                    <div className="mt-2">
                      <button onClick={() => setViewedPdf(viewedPdf === fileUrl ? null : fileUrl)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        {viewedPdf === fileUrl ? 'Hide Inline PDF' : 'View Inline PDF'}
                      </button>
                    </div>
                    {viewedPdf === fileUrl && <iframe src={fileUrl} title={`PDF-${record.id}`} className="w-full h-96 border mt-2"></iframe>}
                  </div>
                ) : <p>{record.medicalHistory}</p>}
                {/* Delete button */}
                <button 
                  onClick={() => handleDeleteRecord(record.id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Record
                </button>
              </div>
            );
          })}
        </div>
      ) : <p className="text-gray-500">No medical records found.</p>}
    </div>
  );
};

export default MedicalRecords;
