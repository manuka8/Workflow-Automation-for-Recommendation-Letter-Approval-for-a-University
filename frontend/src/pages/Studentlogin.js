import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Studentlogin = () => {
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
