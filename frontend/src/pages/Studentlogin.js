import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Studentlogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  return (
    <View className="container">
      <div className="form-container">
        <Text className="title">Student Login</Text>
        <TextInput className="input" placeholder="Student ID" />
        <TextInput className="input" placeholder="Password" secureTextEntry />
        <Button className="btn-login" title="Log in" onPress={() => {}} />
      </div>
    </View>
  );
};

export default Studentlogin;
