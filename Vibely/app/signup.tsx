import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';


export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#FF5722', '#FFB74D']}
        style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'center' }}>
              
              {/* Logo and form section */}
              <View style={{ alignItems: 'center', marginTop: 24 }}>
                {/* Logo */}
                <View style={{ 
                  backgroundColor: 'black', 
                  borderRadius: 9999, 
                  width: 96, 
                  height: 96, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: 40 
                }}>
                  <Text style={{ color: '#FF5722', fontSize: 24, fontWeight: 'bold' }}>vibely</Text>
                </View>
                
                {/* Form */}
                <View style={{ width: '100%' }}>
                  <Text style={{ color: 'white', marginBottom: 4, marginLeft: 4 }}>Email</Text>
                  <TextInput
                    style={{ 
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'white', 
                      borderRadius: 6, 
                      padding: 12, 
                      marginBottom: 18
                    }}
                    placeholder=""
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  
                  <Text style={{ color: 'white', marginBottom: 4, marginLeft: 4 }}>Username</Text>
                  <TextInput
                    style={{ 
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'white', 
                      borderRadius: 6, 
                      padding: 12, 
                      marginBottom: 18 
                    }}
                    placeholder=""
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                  
                  <Text style={{ color: 'white', marginBottom: 4, marginLeft: 4 }}>Password</Text>
                  <TextInput
                    style={{ 
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'white', 
                      borderRadius: 6, 
                      padding: 12, 
                      marginBottom: 18
                    }}
                    placeholder=""
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  
                  <Text style={{ color: 'white', marginBottom: 4, marginLeft: 4 }}>Confirm Password</Text>
                  <TextInput
                    style={{ 
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'white', 
                      borderRadius: 6, 
                      padding: 12, 
                      marginBottom: 34 
                    }}
                    placeholder=""
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  
                  <TouchableOpacity 
                    style={{ 
                      backgroundColor: 'black', 
                      borderRadius: 9999, 
                      padding: 12, 
                      alignItems: 'center', 
                      marginBottom: 16 
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign Up</Text>
                  </TouchableOpacity>
                  
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: 24 
                  }}>
                    <Text style={{ color: 'white' }}>Already have an account? </Text>
                    <Link href="/loginscreen" asChild>
                    <TouchableOpacity>
                      <Text style={{ color: 'black', fontWeight: 'bold' }}>Login</Text>
                    </TouchableOpacity>
                  </Link>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
          
          {/* Bottom section with crowd silhouette - only visible when keyboard is NOT shown */}
          {!keyboardVisible && (
            <View style={{ 
              width: '100%',
              height: Platform.OS === 'ios' ? 100 : 120
            }}>
              <Image
                source={require('../assets/images/crowd.png')}
                style={{ width: '100%', height: '100%', opacity: 0.3 }}
                resizeMode="cover"
              />
            </View>
          )}

        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}