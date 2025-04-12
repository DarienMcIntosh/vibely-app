import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LoginScreen } from './loginscreen';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources or initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return <LoginScreen />;
}

function SplashScreen() {
  return (
    <LinearGradient
      colors={['#FF5722', '#FF8A65', '#FFB74D']}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center items-center">
        <View className="bg-black rounded-full w-32 h-32 items-center justify-center mb-6">
          <Text className="text-orange-500 text-3xl font-bold">vibely</Text>
        </View>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </LinearGradient>
  );
}