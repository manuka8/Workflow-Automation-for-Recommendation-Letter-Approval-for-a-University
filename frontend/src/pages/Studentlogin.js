import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Studentlogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  return (
    <View className="container">
      <div>
      <h2>Student Login</h2>
      <form>
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
