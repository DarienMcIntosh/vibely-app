import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  SafeAreaView, 
  StatusBar,
  Platform,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EventOrganizerScreen() {
  const [eventTypes, setEventTypes] = useState({
    music: false,
    party: false,
    foodDrink: false,
    community: false,
    hobbies: false,
    other: false
  });
  
  const [eventsPerYear, setEventsPerYear] = useState(null);
  const [eventSize, setEventSize] = useState(null);
  
  const eventYearOptions = ["1-5", "6-10", "11-20", "20+"];
  const eventSizeOptions = ["Small (< 50 people)", "Medium (50-200 people)", "Large (200-500 people)", "Very Large (500+ people)"];
  
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const toggleEventType = (type: keyof typeof eventTypes) => {
    setEventTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  const handleBackPress = () => {
    // Navigate back to the select user screen instead of using router.back()
    router.replace('/selectuser');
  };
  
  const handleContinue = () => {
    // Navigate to the next screen (home or another onboarding step)
    router.replace('/home');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient
        colors={['#FF5722', '#FFB74D']}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Back Button */}
          <TouchableOpacity 
            style={{ padding: 16 }} 
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={require('../assets/images/vibely.png')}
              style={{ width: 120, height: 120 }}
              resizeMode="contain"
            />
          </View>
          
          {/* Form Content */}
          <View style={{ paddingHorizontal: 24 }}>
            {/* Event Types */}
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '500', marginBottom: 10 }}>
              What type of events do you host?
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              <TouchableOpacity 
                style={{ 
                  backgroundColor: eventTypes.music ? '#333' : 'white',
                  borderRadius: 50,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                onPress={() => toggleEventType('music')}
              >
                <Text style={{ 
                  color: eventTypes.music ? 'white' : 'black',
                }}>Music</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: eventTypes.party ? '#333' : 'white',
                  borderRadius: 50,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                onPress={() => toggleEventType('party')}
              >
                <Text style={{ 
                  color: eventTypes.party ? 'white' : 'black',
                }}>Party</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: eventTypes.foodDrink ? '#333' : 'white',
                  borderRadius: 50,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                onPress={() => toggleEventType('foodDrink')}
              >
                <Text style={{ 
                  color: eventTypes.foodDrink ? 'white' : 'black',
                }}>Food & Drink</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: eventTypes.community ? '#333' : 'white',
                  borderRadius: 50,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                onPress={() => toggleEventType('community')}
              >
                <Text style={{ 
                  color: eventTypes.community ? 'white' : 'black',
                }}>Community</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: eventTypes.hobbies ? '#333' : 'white',
                  borderRadius: 50,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                onPress={() => toggleEventType('hobbies')}
              >
                <Text style={{ 
                  color: eventTypes.hobbies ? 'white' : 'black',
                }}>Hobbies & Special Interest</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{ 
                  backgroundColor: eventTypes.other ? '#333' : 'white',
                  borderRadius: 50,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                }}
                onPress={() => toggleEventType('other')}
              >
                <Text style={{ 
                  color: eventTypes.other ? 'white' : 'black',
                }}>Other +</Text>
              </TouchableOpacity>
            </View>
            
            {/* Events Per Year */}
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '500', marginBottom: 10 }}>
              How many events do you plan to organize in the next year?
            </Text>
            <TouchableOpacity 
              style={{ 
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
              }}
              onPress={() => setShowYearDropdown(!showYearDropdown)}
            >
              <Text style={{ color: 'gray' }}>
                {eventsPerYear || "Select option"}
              </Text>
              <Ionicons name={showYearDropdown ? "chevron-up" : "chevron-down"} size={20} color="gray" />
            </TouchableOpacity>
            
            {showYearDropdown && (
              <View style={{ 
                backgroundColor: 'white',
                borderRadius: 8,
                marginTop: -20,
                marginBottom: 24,
                padding: 8,
                zIndex: 10
              }}>
                {eventYearOptions.map((option, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={{ 
                      padding: 12,
                      borderBottomWidth: index < eventYearOptions.length - 1 ? 1 : 0,
                      borderBottomColor: '#eee'
                    }}
                    onPress={() => {
                        const [eventsPerYear, setEventsPerYear] = useState<string | null>(null);
                      setShowYearDropdown(false);
                    }}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Event Size */}
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '500', marginBottom: 10 }}>
              On average, how big are your events?
            </Text>
            <TouchableOpacity 
              style={{ 
                backgroundColor: 'white',
                borderRadius: 8,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 40
              }}
              onPress={() => setShowSizeDropdown(!showSizeDropdown)}
            >
              <Text style={{ color: 'gray' }}>
                {eventSize || "Select option"}
              </Text>
              <Ionicons name={showSizeDropdown ? "chevron-up" : "chevron-down"} size={20} color="gray" />
            </TouchableOpacity>
            
            {showSizeDropdown && (
              <View style={{ 
                backgroundColor: 'white',
                borderRadius: 8,
                marginTop: -36,
                marginBottom: 24,
                padding: 8,
                zIndex: 10
              }}>
                {eventSizeOptions.map((option, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={{ 
                      padding: 12,
                      borderBottomWidth: index < eventSizeOptions.length - 1 ? 1 : 0,
                      borderBottomColor: '#eee'
                    }}
                    onPress={() => {
                        const [eventSize, setEventSize] = useState<string | null>(null);
                      setShowSizeDropdown(false);
                    }}
                  >
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {/* Continue Button */}
            <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 32 }}>
              <TouchableOpacity 
                style={{ 
                  backgroundColor: 'black', 
                  borderRadius: 9999, 
                  padding: 16, 
                  width: '100%',
                  alignItems: 'center',
                }}
                onPress={handleContinue}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        {/* Bottom section with crowd silhouette */}
        <View style={{ 
          width: '100%',
          height: Platform.OS === 'ios' ? 100 : 120,
          position: 'absolute',
          bottom: 0,
          zIndex: -1
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