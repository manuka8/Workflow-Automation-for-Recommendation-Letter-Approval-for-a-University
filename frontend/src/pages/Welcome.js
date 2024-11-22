import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <View className="container">
      <div className="welcome-container">
        <Text className="title">WELCOME</Text>
        <img src={require('../assets/welcome-icon.png')} className="welcome-icon" alt="Welcome" />
        <div className="button-group">
          <Button className="btn-login" title="Login" onPress={() => navigation.navigate('LoginAs')} />
          <Button className="btn-register" title="Register" onPress={() => navigation.navigate('RegisterAs')} />
        </div>
      </div>
    </View>
  );
};

export default Welcome;


