import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("Jessica");
  const [username, setUsername] = useState("jess.j");
  const [bio, setBio] = useState("I'm all about having a good time! 😊");
  const [profileImage, setProfileImage] = useState(
    require("../assets/images/rema.jpg")
  );

  useEffect(() => {
    // Load user profile data from AsyncStorage when component mounts
    const loadProfileData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.name) setName(parsedData.name);
          if (parsedData.username) setUsername(parsedData.username);
          if (parsedData.bio) setBio(parsedData.bio);
          // Note: Can't dynamically load images from AsyncStorage this way
          // This would require additional setup for image handling
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  const saveChanges = async () => {
    try {
      // Save profile data to AsyncStorage
      const userData = {
        name,
        username,
        bio,
        // Note: Saving image references would need a different approach
      };

      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // Set a flag to indicate profile was updated
      await AsyncStorage.setItem("profileUpdated", "true");

      // Show success message
      Alert.alert("Success", "Profile updated successfully!");

      // Navigate back to profile
      navigation.goBack();
    } catch (error) {
      console.error("Error saving profile data:", error);
      Alert.alert("Error", "Failed to save profile data. Please try again.");
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />

      <LinearGradient colors={["#3F0F00", "#000000"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView style={{ flex: 1 }}>
            {/* Header with back button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <TouchableOpacity onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Profile Image with edit button */}
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <View style={{ position: "relative" }}>
                <Image
                  source={profileImage}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    borderWidth: 2,
                    borderColor: "#ff9900ab",
                  }}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    bottom: 5,
                    right: 5,
                    backgroundColor: "#FF9800",
                    borderRadius: 20,
                    width: 32,
                    height: 32,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="camera" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Form fields */}
            <View style={{ paddingHorizontal: 20 }}>
              {/* Name Field */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{ color: "#FF9800", marginBottom: 8, fontSize: 16 }}
                >
                  Name:
                </Text>
                <View
                  style={{
                    backgroundColor: "rgba(80, 80, 80, 0.5)",
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={{
                      flex: 1,
                      color: "white",
                      fontSize: 16,
                      paddingVertical: 12,
                    }}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                  />
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={20} color="#FF9800" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Username Field */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{ color: "#FF9800", marginBottom: 8, fontSize: 16 }}
                >
                  Username:
                </Text>
                <View
                  style={{
                    backgroundColor: "rgba(80, 80, 80, 0.5)",
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    style={{
                      flex: 1,
                      color: "white",
                      fontSize: 16,
                      paddingVertical: 12,
                    }}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                  />
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={20} color="#FF9800" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bio Field */}
              <View style={{ marginBottom: 40 }}>
                <Text
                  style={{ color: "#FF9800", marginBottom: 8, fontSize: 16 }}
                >
                  Bio:
                </Text>
                <View
                  style={{
                    backgroundColor: "rgba(80, 80, 80, 0.5)",
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <TextInput
                    value={bio}
                    onChangeText={setBio}
                    style={{
                      flex: 1,
                      color: "white",
                      fontSize: 16,
                      paddingVertical: 12,
                      minHeight: 80,
                      textAlignVertical: "top",
                    }}
                    multiline={true}
                    numberOfLines={3}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                  />
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={20} color="#FF9800" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={saveChanges}
                style={{
                  backgroundColor: "#FF9800",
                  borderRadius: 25,
                  paddingVertical: 14,
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
