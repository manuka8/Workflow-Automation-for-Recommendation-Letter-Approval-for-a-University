import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Mainlogin = () => {
  const navigation = useNavigation();

  return (
    <View className="container">
      <div className="login-as-container">
        <Text className="title">LOGIN AS A</Text>
        <div className="role-buttons">
          <Button className="btn-login" title="Student" onPress={() => navigation.navigate('StudentLogin')} />
          <Button className="btn" title="Staff" onPress={() => {}} />
          <Button className="btn" title="Admin" onPress={() => {}} />
        </div>
      </div>
    </View>
  );
};

export default Mainlogin;
