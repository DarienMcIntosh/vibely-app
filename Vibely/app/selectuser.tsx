import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  SafeAreaView, 
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function SelectUserScreen() {
  const navigation = useNavigation();
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleEventGoerSelection = () => {
    setSelectedUserType('event-goer');
  };

  const handleEventOrganizerSelection = () => {
    setSelectedUserType('event-organizer');
  };

  const handleContinue = () => {
    if (selectedUserType === 'event-goer') {
      // Navigate to Home screen
      router.replace('/home');
    } else if (selectedUserType === 'event-organizer') {
      // Navigate to Event Organizer screen
      router.replace('/eventorganizer');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient
        colors={['#FF5722', '#FFB74D']}
        style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Logo and Title */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            {/* Logo */}
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center', 
            }}>
              <Image
                source={require('../assets/images/vibely.png')}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
            </View>
            
            <Text style={{ color: '#FFF', fontSize: 24, fontWeight: 'bold' }}>Select One</Text>
          </View>
          
          {/* Selection Options */}
          <View style={{ width: '100%', alignItems: 'center', gap: 20 }}>
            <TouchableOpacity 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: 9999, 
                padding: 16,
                paddingHorizontal: 32,
                width: '80%',
                alignItems: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                borderWidth: selectedUserType === 'event-goer' ? 3 : 0,
                borderColor: selectedUserType === 'event-goer' ? '#FFB74D' : 'transparent',
              }}
              onPress={handleEventGoerSelection}
            >
              <Text style={{ 
                color: '#FF5722', 
                fontWeight: 'bold', 
                fontSize: 18 
              }}>Event-Goer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: 9999, 
                padding: 16,
                paddingHorizontal: 32,
                width: '80%',
                alignItems: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                borderWidth: selectedUserType === 'event-organizer' ? 3 : 0,
                borderColor: selectedUserType === 'event-organizer' ? '#FFB74D' : 'transparent',
              }}
              onPress={handleEventOrganizerSelection}
            >
              <Text style={{ 
                color: '#FF5722', 
                fontWeight: 'bold', 
                fontSize: 18 
              }}>Event-Organizer</Text>
            </TouchableOpacity>
          </View>
          
          {/* Continue Button */}
          <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
            <TouchableOpacity 
              style={{ 
                backgroundColor: 'black', 
                borderRadius: 9999, 
                padding: 16, 
                width: '80%',
                alignItems: 'center',
                opacity: selectedUserType ? 1 : 0.5
              }}
              onPress={handleContinue}
              disabled={!selectedUserType}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bottom section with crowd silhouette */}
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
      </LinearGradient>
    </SafeAreaView>
  );
}