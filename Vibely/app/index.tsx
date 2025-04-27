import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'; // Import from the correct library
import LoginScreen from './loginscreen';
import SignupScreen from './signup';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
import SelectUser from './selectuser';
import HomeScreen from './home';
import EventOrganizerScreen from './eventorganizer';

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="SelectUser" component={SelectUser} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EventOrganizer" component={EventOrganizerScreen} />
      </Stack.Navigator>
  );
}

function SplashScreen() {
  return (
    <LinearGradient
      colors={['#FF5722', '#FFB74D']}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center">
        {/* Logo */}
        <View style={{ 
          alignItems: 'center', 
          justifyContent: 'center', 
        }}>
        <Image
        source={require('../assets/images/vibely.png')}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
        />
        </View>
      </View>
    </LinearGradient>
  );
}

export default App;