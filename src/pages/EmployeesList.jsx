import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import api from '../service/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    address: '',
    designation: '',
    joining_date: '',
    salary: '',
    department: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/api/employees/');
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/api/departments/');
      setDepartments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const getDepartmentName = (id) => {
    const dep = departments.find((d) => d.id === id);
    return dep ? dep.name : 'N/A';
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openModal = (emp = null) => {
    if (emp) {
      setEditing(emp.id);
      setForm({
        employee_id: emp.employee_id,
        full_name: emp.full_name,
        email: emp.email,
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        password: '',
        phone: emp.phone,
        address: emp.address,
        designation: emp.designation,
        joining_date: emp.joining_date,
        salary: emp.salary,
        department: emp.department
      });
    } else {
      setEditing(null);
      setForm({
        employee_id: '',
        full_name: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        phone: '',
        address: '',
        designation: '',
        joining_date: '',
        salary: '',
        department: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        employee_id: form.employee_id,
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        designation: form.designation,
        joining_date: form.joining_date,
        salary: form.salary,
        department: form.department ? parseInt(form.department) : null,
        user: {
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
          password: form.password
        }
      };

      if (editing) {
        await api.put(`/api/employees/${editing}/`, data);
        setMessage('Employee updated successfully');
      } else {
        await api.post('/api/employees/', data);
        setMessage('Employee created successfully');
      }
      fetchEmployees();
      setShowModal(false);
    } catch (err) {
      console.log(err.response?.data);
      setMessage(JSON.stringify(err.response?.data));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await api.delete(`/api/employees/${id}/`);
      setMessage('Deleted successfully');
      fetchEmployees();
    }
  };

  return (
    <div className="p-4">
      <h2>Employee Management</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Button onClick={() => openModal()} className="mb-3">
        Add Employee
      </Button>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.employee_id}</td>
              <td>{emp.full_name}</td>
              <td>{emp.email}</td>
              <td>{getDepartmentName(emp.department)}</td>
              <td>{emp.designation}</td>
              <td>{emp.salary}</td>
              <td>
                <Button size="sm" onClick={() => openModal(emp)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(emp.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit' : 'Add'} Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              name="employee_id"
              placeholder="Employee ID"
              value={form.employee_id}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              className="mb-2"
              required
            />
            {!editing && (
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="mb-2"
                required
              />
            )}
            <Form.Control
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="mb-2"
            />
            <Form.Control
              name="designation"
              placeholder="Designation"
              value={form.designation}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              type="date"
              name="joining_date"
              value={form.joining_date}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Control
              type="number"
              name="salary"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              className="mb-2"
              required
            />
            <Form.Select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="mb-2"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </Form.Select>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeesList;