import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Studentlogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password }),
      });

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('ID', studentId);
        localStorage.setItem('type', 'student');
        console.log(data.token) // Store token if needed
        navigate(`/studentdashboard`); // Redirect to student dashboard
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <View className="container">
      <div>
      <h2>Student Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label>Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter your student ID"
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
    </View>
  );
};

export default Studentlogin;
