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


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation();

  // Monitor keyboard visibility
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

    // Clean up listeners
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
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                {/* Logo */}
                <View style={{ 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                }}>
                  <Image
                    source={require('../assets/images/vibely.png')}
                    style={{ width: 220, height: 220 }}
                    resizeMode="contain"
                  />
                </View>
                
                {/* Form */}
                <View style={{ width: '100%' }}>
                  <Text style={{ color: 'white', marginBottom: 4, marginLeft: 4 }}>Username</Text>
                  <TextInput
                    style={{ 
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'white', 
                      borderRadius: 6, 
                      padding: 12, 
                      marginBottom: 16 
                    }}
                    placeholder=""
                    value={username}
                    onChangeText={setUsername}
                  />
                  
                  <Text style={{ color: 'white', marginBottom: 4, marginLeft: 4 }}>Password</Text>
                  <TextInput
                    style={{ 
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      backgroundColor: 'white', 
                      borderRadius: 6, 
                      padding: 12, 
                      marginBottom: 35 
                    }}
                    placeholder=""
                    value={password}
                    onChangeText={setPassword}
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
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
                  </TouchableOpacity>
                  
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: 24 
                  }}>
                    <Text style={{ color: 'white' }}>First Time Here? </Text>
                    <Link href="/signup" asChild>
                    <TouchableOpacity>
                      <Text style={{ color: 'black', fontWeight: 'bold' }}>Sign Up</Text>
                    </TouchableOpacity>
                  </Link>
                  </View>
                  
                  {/* Divider */}
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginBottom: 24 
                  }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white', opacity: 0.5 }} />
                    <Text style={{ marginHorizontal: 16, color: 'black' }}>OR</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white', opacity: 0.5 }} />
                  </View>
                  
                  {/* Social Login Buttons */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                    <TouchableOpacity 
                      style={{ 
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: 'white', 
                        borderRadius: 9999, 
                        paddingVertical: 8, 
                        paddingHorizontal: 16, 
                        flex: 1, 
                        marginRight: 8, 
                        borderWidth: 1, 
                        borderColor: '#E5E5E5' 
                      }}
                    >
                      <Image
                        source={require('../assets/images/google.png')}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain" 
                      />
                      <Text style={{ color: 'black', marginLeft: 4, fontSize: 12, }}>Login with Google</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={{ 
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        backgroundColor: 'white', 
                        borderRadius: 9999, 
                        paddingVertical: 8, 
                        paddingHorizontal: 16, 
                        flex: 1, 
                        marginLeft: 8, 
                        borderWidth: 1, 
                        borderColor: '#E5E5E5' 
                      }}
                    >
                      <Image
                        source={require('../assets/images/apple.png')}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain" 
                      />
                      <Text style={{ color: 'black', marginLeft: 4, fontSize: 12 }}>Login with Apple</Text>
                    </TouchableOpacity>
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