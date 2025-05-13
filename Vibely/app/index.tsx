import { createStackNavigator } from "@react-navigation/stack"; // Import from the correct library
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import CreateEvent from "./createevent";
import EditProfile from "./editprofile";
import EventOrganizerScreen from "./eventorganizer";
import HomeScreen from "./home";
import LoginScreen from "./loginscreen";
import Map from "./map";
import OrganizerHome from "./organizerhome";
import PaymentConfirmation from "./paymentconfirmation";
import Profile from "./profile";
import RSVP from "./rsvp";
import SelectUser from "./selectuser";
import SignupScreen from "./signup";
import TicketPurchase from "./ticketpurchase";
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
      initialRouteName="OrganizerHome"
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
      <Stack.Screen name="TicketPurchase" component={TicketPurchase} />
      <Stack.Screen
        name="PaymentConfirmation"
        component={PaymentConfirmation}
      />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="OrganizerHome" component={OrganizerHome} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
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
