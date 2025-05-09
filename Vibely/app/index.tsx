import { createStackNavigator } from "@react-navigation/stack"; // Import from the correct library
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import EventOrganizerScreen from "./eventorganizer";
import HomeScreen from "./home";
import LoginScreen from "./loginscreen";
import Map from "./map";
import RSVP from "./rsvp";
import SelectUser from "./selectuser";
import SignupScreen from "./signup";
import Trending from "./trending";
import UserCustomize from "./usercustomize";

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
    <Stack.Navigator
      initialRouteName="RSVP"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SelectUser" component={SelectUser} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EventOrganizer" component={EventOrganizerScreen} />
      <Stack.Screen name="UserCustomize" component={UserCustomize} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Trending" component={Trending} />
      <Stack.Screen name="RSVP" component={RSVP} />
    </Stack.Navigator>
  );
}

function SplashScreen() {
  return (
    <LinearGradient colors={["#FF5722", "#FFB74D"]} style={{ flex: 1 }}>
      <View className="flex-1 justify-center items-center">
        {/* Logo */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/images/vibely.png")}
            style={{ width: 250, height: 250 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

export default App;
