import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE_URL = "https://{AUTH0_DOMAIN}/api/v2/";

export default function SelectUserScreen() {
  const [selectedUserType, setSelectedUserType] = useState<
    "attendee" | "organizer" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEventGoerSelection = () => {
    setSelectedUserType("attendee");
  };

  const handleEventOrganizerSelection = () => {
    setSelectedUserType("organizer");
  };

  const handleContinue = async () => {
    if (!selectedUserType) return;

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      // Update user type in the backend
      const response = await axios.post(
        `${API_BASE_URL}/api/set-user-type`,
        { user_type: selectedUserType },
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.status === 200) {
        // Store user type in local storage for future reference
        await AsyncStorage.setItem("userType", selectedUserType);

        // Navigate to the appropriate screen based on user type
        if (selectedUserType === "attendee") {
          router.replace("/usercustomize");
        } else if (selectedUserType === "organizer") {
          router.replace("/eventorganizer");
        }
      }
    } catch (error) {
      console.error("Error setting user type:", error);
      let errorMessage = "Failed to set user type. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message || errorMessage; // Access standard Error message
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "detail" in error.response.data &&
        typeof error.response.data.detail === "string"
      ) {
        errorMessage = error.response.data.detail; // Access the specific detail if the structure matches
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient colors={["#FF5722", "#FFB74D"]} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Logo and Title */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            {/* Logo */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/images/vibely.png")}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
              />
            </View>

            <Text style={{ color: "#FFF", fontSize: 24, fontWeight: "bold" }}>
              Select One
            </Text>
          </View>

          {/* Selection Options */}
          <View style={{ width: "100%", alignItems: "center", gap: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 9999,
                padding: 16,
                paddingHorizontal: 32,
                width: "80%",
                alignItems: "center",
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                borderWidth: selectedUserType === "attendee" ? 3 : 0,
                borderColor:
                  selectedUserType === "attendee" ? "#FFB74D" : "transparent",
              }}
              onPress={handleEventGoerSelection}
              disabled={isLoading}
            >
              <Text
                style={{
                  color: "#FF5722",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Event-Goer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                borderRadius: 9999,
                padding: 16,
                paddingHorizontal: 32,
                width: "80%",
                alignItems: "center",
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                borderWidth: selectedUserType === "organizer" ? 3 : 0,
                borderColor:
                  selectedUserType === "organizer" ? "#FFB74D" : "transparent",
              }}
              onPress={handleEventOrganizerSelection}
              disabled={isLoading}
            >
              <Text
                style={{
                  color: "#FF5722",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Event-Organizer
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <View style={{ width: "100%", alignItems: "center", marginTop: 40 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                borderRadius: 9999,
                padding: 16,
                width: "80%",
                alignItems: "center",
                opacity: selectedUserType && !isLoading ? 1 : 0.5,
              }}
              onPress={handleContinue}
              disabled={!selectedUserType || isLoading}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {isLoading ? "Processing..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom section with crowd silhouette */}
        <View
          style={{
            width: "100%",
            height: Platform.OS === "ios" ? 100 : 120,
          }}
        >
          <Image
            source={require("../assets/images/crowd.png")}
            style={{ width: "100%", height: "100%", opacity: 0.3 }}
            resizeMode="cover"
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
