import React from 'react';
import { 
  View, 
  Text, 
  Image,
  SafeAreaView, 
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  // Sample event data
  const events = [
    {
      id: '1',
      title: "MARK'S POST-INDEPENDENCE PARTY",
      date: '20',
      month: 'Jul',
      image: require('../assets/images/event1.jpg'),
      saved: false
    },
    {
      id: '2',
      title: "JOSHUA'S BIRTHDAY PARTY",
      date: '15',
      month: 'Aug',
      image: require('../assets/images/event2.jpg'),
      saved: true
    },
    {
      id: '3',
      title: "DJ RYAN'S YACHT PARTY",
      date: '09',
      month: 'Sep',
      image: require('../assets/images/event3.jpg'),
      saved: false
    }
  ];

  // Sample user data
  const user = {
    name: 'John'
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1E1E' }}>
    <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient
            colors={['#3E0F00', '#000000']}
            style={{ flex: 1 }}>
      
            {/* Header */}
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingHorizontal: 20,
                paddingVertical: 12,
                marginBottom: 16,
                marginTop: 10,
            }}>
                <View>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
                    Hey, {user.name}!
                </Text>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 }}>
                    Glad you're here! Ready to find some fun?
                </Text>
                </View>
                <TouchableOpacity>
                <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>
            
            {/* Event List */}
            <ScrollView style={{ flex: 1 }}>
                {events.map((event) => (
                <View key={event.id} style={{ marginHorizontal: 20, marginBottom: 25 }}>
                    {/* Event Card */}
                    <View style={{ 
                      borderRadius: 16,
                      overflow: 'hidden',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 5
                    }}>
                      {/* Event Image with Overlay Title */}
                      <View style={{ position: 'relative' }}>
                        <Image
                            source={event.image}
                            style={{ width: '100%', height: 180 }}
                            resizeMode="cover"
                        />
                        
                        {/* Date Overlay */}
                        <View style={{ 
                            position: 'absolute', 
                            left: 16, 
                            top: 16, 
                            backgroundColor: '#FF5722',
                            borderRadius: 8,
                            padding: 8,
                            alignItems: 'center',
                            minWidth: 45
                        }}>
                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                            {event.date}
                            </Text>
                            <Text style={{ color: 'white', fontSize: 12, textTransform: 'uppercase' }}>
                            {event.month}
                            </Text>
                        </View>
                        
                        {/* Title Overlay - Positioned at bottom of image with semi-transparent background */}
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.8)']}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                          }}
                        >
                          <Text style={{ 
                            color: 'white', 
                            fontSize: 16, 
                            fontWeight: 'bold',
                            textShadowColor: 'rgba(0, 0, 0, 0.75)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 2
                          }}>
                            {event.title}
                          </Text>
                        </LinearGradient>
                      </View>
                    </View>
                    
                    {/* Action Buttons - Outside the card */}
                    <View style={{ 
                      flexDirection: 'row',
                      paddingHorizontal: 12,
                      paddingTop: 8,
                    }}>
                      <TouchableOpacity style={{ marginRight: 20 }}>
                        <Ionicons name="heart-outline" size={20} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginRight: 20 }}>
                        <Ionicons name="chatbubble-outline" size={20} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginRight: 20 }}>
                        <Image source={require('../assets/images/rsvp.png')} style={{ width: 24, height: 24 }} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginRight: 20 }}>
                        <Ionicons name="bookmark-outline" size={20} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Ionicons name="share-social-outline" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                </View>
                ))}
                {/* Add extra padding at bottom to ensure content isn't hidden behind the nav */}
                <View style={{ paddingBottom: 80 }} />
            </ScrollView>
            
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    paddingVertical: 12,
                    
                }}>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/home.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/trending.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/location.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
                <Image source={require('../assets/images/profile.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </LinearGradient>
        </LinearGradient>
    </SafeAreaView>
  );
}