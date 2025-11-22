import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './EditRequest.module.css';

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    serviceId: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.request) {
      const { serviceId, description,status,createDate,exceptCompletionDate} = location.state.request;
      setFormData({ serviceId: serviceId.toString(), description,status,createDate,exceptCompletionDate});
      setLoading(false);
    } else {
      axios.get(`http://localhost:8080/requests/${id}`)
        .then(response => {
          const { serviceId, description,status,createDate,exceptCompletionDate} = response.data;
          setFormData({ 
            serviceId: serviceId, 
            description :description, 
            status : status,
            createDate : createDate,
            exceptCompletionDate: exceptCompletionDate
          });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching request:', error);
          setError('Failed to load request details');
          setLoading(false);
        });
    }
  }, [id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedRequest = {
      serviceId: parseInt(formData.serviceId),
      description: formData.description,
    };

    axios.put(`http://localhost:8080/requests/edit/${id}`, updatedRequest)
      .then(() => {
        setMessage('Request updated successfully!');
        setTimeout(() => navigate('/viewrequest'), 1500);
      })
      .catch(error => {
        console.error('Error updating request:', error);
        setError(error.response?.data?.message || 'Failed to update request');
      })
  };

  if (loading) return <div className={styles.loading}>Loading request details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Edit Request</h2>
      {message && <div className={styles.success}>{message}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Service Type:</label>
          <select
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select Service</option>
            <option value="1">Plumbing</option>
            <option value="2">Electricity</option>
            <option value="3">Garbage Collection</option>
            <option value="4">Maintenance</option>
            <option value="5">Cleaning</option>
            <option value="6">Security</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            disabled={loading}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Status:</label>
          <input
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            rows="4" readOnly
            disabled={loading}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Create Date:</label>
          <input
            name="createDate"
            value={formData.createDate}
            onChange={handleChange}
            required readOnly
            rows="4"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Expect Completion Date:</label>
          <input
            name="exceptCompletionDate"
            value={formData.exceptCompletionDate}
            onChange={handleChange}
            required
            rows="4" readOnly
            disabled={loading}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Request'}
          </button>
          <button className={styles.cancel}
            type="button" 
            onClick={() => navigate(`/requestdetail/${id}`)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRequest;