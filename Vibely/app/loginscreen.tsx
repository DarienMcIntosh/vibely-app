import React, { useState } from 'react';
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
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#FF5722', '#FF8A65', '#FFB74D']}
        style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                  <Text style={{ color: 'white', marginBottom: 4, marginLeft: 4 }}>Username</Text>
                  <TextInput
                    style={{ 
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
                      backgroundColor: 'white', 
                      borderRadius: 6, 
                      padding: 12, 
                      marginBottom: 32 
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
                    <TouchableOpacity>
                      <Text style={{ color: 'black', fontWeight: 'bold' }}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {/* Divider */}
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginBottom: 24 
                  }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white', opacity: 0.5 }} />
                    <Text style={{ marginHorizontal: 16, color: 'white' }}>OR</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white', opacity: 0.5 }} />
                  </View>
                  
                  {/* Social Login Buttons */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity 
                      style={{ 
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
                      <Text style={{ color: 'black', marginLeft: 4, fontSize: 12 }}>Login with Google</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={{ 
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
          
          {/* Bottom section with crowd silhouette - only visible when keyboard is not shown */}
          {Platform.OS === 'ios' ? (
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              width: '100%', 
              height: 80, 
              zIndex: -1 
            }}>
              <Image
                source={require('../assets/images/crowd.png')}
                style={{ width: '100%', height: '100%', opacity: 0.3 }}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={{ width: '100%' }}>
              <Image
                source={require('../assets/images/crowd.png')}
                style={{ width: '100%', height: 120, opacity: 0.3 }}
                resizeMode="cover"
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}