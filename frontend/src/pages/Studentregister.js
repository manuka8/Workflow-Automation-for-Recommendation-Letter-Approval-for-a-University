import React from 'react';
import { View, Text, TextInput, Button } from 'react';

const Studentregister= () => {
  return (
    <View className="container">
      <div className="form-container">
        <Text className="title">Student Registration</Text>
        <TextInput className="input" placeholder="Student ID" />
        <TextInput className="input" placeholder="Faculty" />
        <TextInput className="input" placeholder="Department" />
        <TextInput className="input" placeholder="Email" keyboardType="email-address" />
        <TextInput className="input" placeholder="Position" />
        <TextInput className="input" placeholder="Password" secureTextEntry />
        <TextInput className="input" placeholder="Confirm Password" secureTextEntry />
        <Button className="btn-register" title="Register" onPress={() => {}} />
      </div>
    </View>
  );
};

export default Studentregister;
