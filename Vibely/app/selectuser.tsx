import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const SelectUserTypeScreen = () => {
  const navigation = useNavigation();

  const navigateToSignup = (userType: 'Event-Goer' | 'Event-Organizer') => {
    // You can pass the userType as a parameter if needed in your SignupScreen
    navigation.navigate('signup', { userType });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#FF5722', '#FFB74D']} style={styles.container}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/vibely.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.selectOneText}>Select One</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateToSignup('Event-Goer')}
          >
            <Text style={styles.buttonText}>Event-Goer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateToSignup('Event-Organizer')}
          >
            <Text style={styles.buttonText}>Event-Organizer</Text>
          </TouchableOpacity>

          {/* Continue Button (You might want to enable this after a selection) */}
          <TouchableOpacity style={styles.continueButton} onPress={() => console.log('Continue Pressed')}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Image */}
        <View style={styles.bottomImageContainer}>
          <Image
            source={require('../assets/images/crowd.png')}
            style={styles.bottomImage}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 150,
    height: 150,
  },
  selectOneText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 9999,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FF5722',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: 'black',
    borderRadius: 9999,
    paddingVertical: 16,
    paddingHorizontal: 64,
    marginTop: 32,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomImageContainer: {
    width: '100%',
    height: 120,
    position: 'absolute',
    bottom: 0,
  },
  bottomImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
});

export default SelectUserTypeScreen;