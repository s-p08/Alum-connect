// client/src/routes/AdminNetwork.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axios from 'axios';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useSidebarLayout } from '../../hooks/useSidebarLayout';

const AdminNetwork = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useSidebarLayout(true);
  // Fetch all jobs from the admin endpoint
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backend_URL}/api/jobs/admin`,
          { withCredentials: true }
        );
        console.log("Admin jobs fetched:", res.data);
        setJobs(res.data);
      } catch (err) {
        console.error('Error fetching admin jobs:', err);
        setError('Failed to load admin network data');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Accept: update job status to "active"
  const handleAccept = async (jobId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}/status`,
        { status: 'active' },
        { withCredentials: true }
      );
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === jobId ? res.data.data : job))
      );
    } catch (err) {
      console.error('Error accepting job:', err);
      setError('Failed to accept job.');
    }
  };

  // Reject: delete the job from the database
  const handleReject = async (jobId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_backend_URL}/api/jobs/admin/${jobId}`,
        { withCredentials: true }
      );
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error('Error rejecting job:', err);
      setError('Failed to reject job.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-blue-600 font-medium">Loading Admin Network data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-8 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <span className="text-gray-500 text-sm">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
          </span>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-600 text-center">No job opportunities found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 p-6 flex flex-col justify-between"
              >
                {/* Job Info */}
                <div>
                  <div className="mb-4 h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Logo</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                  <div className="mt-2 text-sm text-gray-500 space-y-1">
                    <p>
                      Type: <span className="font-medium">{job.employmentType}</span>
                    </p>
                    {job.salary && (
                      <p>
                        Salary: <span className="font-medium">{job.salary}</span>
                      </p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Job Status Badge */}
                <div className="mt-4">
                  <StatusBadge status={job.status} />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center gap-3">
                  {job.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleAccept(job._id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
                      >
                        <CheckCircle2 size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(job._id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(job._id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const StatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'active':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'filled':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'expired':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default AdminNetwork;
