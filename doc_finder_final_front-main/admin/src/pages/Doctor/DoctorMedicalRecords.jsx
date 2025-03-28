  import React, { useState, useEffect, useContext } from 'react';
  import axios from 'axios';
  import { useParams, useLocation } from 'react-router-dom';
  import { DoctorContext } from '../../context/DoctorContext';

  const DoctorMedicalRecords = () => {
    const { dToken, backendUrl, profileData, getProfileData } = useContext(DoctorContext);
    const { patientId } = useParams();
    const location = useLocation();
    const patient = location.state?.patient; // Passed from doctor dashboard

    // Ensure doctorId is fetched before using it
    useEffect(() => {
      if (!profileData) {
        getProfileData();  // Fetch profile data if it's not available
      }
    }, [profileData, getProfileData]);

    // Get doctorId from profileData or fallback from localStorage
    const doctorId = profileData?.id || localStorage.getItem('doctorId');

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ medicalHistory: '', file: null });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);
    const [viewedPdf, setViewedPdf] = useState(null);

    useEffect(() => {
      if (patientId && doctorId) {
        fetchRecords();
      }
    }, [patientId, doctorId]);

    const fetchRecords = async () => {
      if (!patientId || !doctorId) {
        console.warn('Missing patientId or doctorId:', { patientId, doctorId });
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${backendUrl}/medicalrecords/user/${patientId}/${doctorId}`,
          { headers: { Authorization: `Bearer ${dToken}` } }
        );
        setRecords(res.data?.medicalRecords || []);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.response?.data?.message || 'Error fetching records');
      } finally {
        setLoading(false);
      }
    };

    const handleInputChange = (e) => {
      const { name, value, files } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'file' ? files[0] : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitLoading(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      try {
        let response;
        const data = new FormData();
        data.append('userId', patientId);
        data.append('doctorId', doctorId);
        if (formData.file) {
          data.append('file', formData.file);
        } else if (formData.medicalHistory) {
          data.append('medicalHistory', formData.medicalHistory);
        } else {
          setSubmitError('Please provide either a file or medical history text.');
          setSubmitLoading(false);
          return;
        }
        response = await axios.post(`${backendUrl}/medicalrecords`, data, {
          headers: { Authorization: `Bearer ${dToken}`, 'Content-Type': 'multipart/form-data' },
        });
        setSubmitSuccess('Record stored successfully!');
        setFormData({ medicalHistory: '', file: null });
        fetchRecords();
      } catch (err) {
        console.error('Submit error:', err);
        setSubmitError(err.response?.data?.message || 'Failed to store record');
      } finally {
        setSubmitLoading(false);
      }
    };

    return (
      <div className="p-4 max-w-screen-xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Medical Records for {patient ? patient.name : `Patient ID: ${patientId}`}
        </h2>

        <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Medical History (Text)</label>
            <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} className="w-full border rounded px-3 py-2" rows="4"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Or Upload a File (PDF or text)</label>
            <input type="file" name="file" accept="application/pdf,text/*" onChange={handleInputChange} className="w-full" />
          </div>
          {submitError && <div className="mb-4 text-red-600">{submitError}</div>}
          {submitSuccess && <div className="mb-4 text-green-600">{submitSuccess}</div>}
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" disabled={submitLoading}>
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
              const fileUrl = `${backendUrl}/${record.medicalHistory.replace(/\\/g, '/')}`;
              return (
                <div key={record.id} className="border rounded p-4 shadow-sm">
                  <p><strong>Medical History:</strong></p>
                  {record.isFile ? (
                    <div className='flex flex-col gap-2' >
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open PDF in New Tab</a>
                      <button onClick={() => setViewedPdf(viewedPdf === fileUrl ? null : fileUrl)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        {viewedPdf === fileUrl ? 'Hide Inline PDF' : 'View Inline PDF'}
                      </button>
                      {viewedPdf === fileUrl && <iframe src={fileUrl} title={`PDF-${record.id}`} className="w-full h-96 border mt-2"></iframe>}
                    </div>
                  ) : (
                    <p>{record.medicalHistory}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No medical records found.</p>
        )}
      </div>
    );
  };

  export default DoctorMedicalRecords;
