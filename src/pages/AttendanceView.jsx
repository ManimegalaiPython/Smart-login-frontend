import { useState, useEffect } from 'react';
import api from '../service/api';

const AttendanceView = ({ isAdmin }) => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAttendances(); }, []);

  const fetchAttendances = async () => {
    try {
      const res = await api.get('/api/attendances/');
      setAttendances(res.data);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (status) => {
    try {
      await api.post('/api/attendances/', { status });
      fetchAttendances();
    } catch (err) {
      alert('Failed to mark attendance');
    }
  };

  if (loading) return <div className="spinner-center"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header">
        <h3>Attendance</h3>
        <div>
          <button className="btn-primary" onClick={() => markAttendance('present')}>Mark Present</button>
          <button className="btn-warning" onClick={() => markAttendance('leave')}>Mark Leave</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr><th>Date</th><th>Employee</th><th>Status</th><th>Check In</th><th>Check Out</th></tr>
          </thead>
          <tbody>
            {attendances.map(att => (
              <tr key={att.id}>
                <td>{att.date}</td>
                <td>{att.employee_name}</td>
                <td>{att.status}</td>
                <td>{att.check_in || '-'}</td>
                <td>{att.check_out || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceView;