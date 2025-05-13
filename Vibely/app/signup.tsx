import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
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

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
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
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient colors={["#FF5722", "#FFB74D"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flex: 1,
                paddingHorizontal: 32,
                justifyContent: "center",
              }}
            >
              {/* Logo and form section */}
              <View style={{ alignItems: "center", marginTop: 24 }}>
                {/* Logo */}
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../assets/images/vibely.png")}
                    style={{ width: 220, height: 220 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Form */}
                <View style={{ width: "100%" }}>
                  <Text
                    style={{ color: "black", marginBottom: 4, marginLeft: 4 }}
                  >
                    Email
                  </Text>
                  <TextInput
                    style={{
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                      backgroundColor: "white",
                      borderRadius: 6,
                      padding: 12,
                      marginBottom: 18,
                      paddingLeft: 10,
                    }}
                    placeholder=""
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Text
                    style={{ color: "black", marginBottom: 4, marginLeft: 4 }}
                  >
                    Password
                  </Text>
                  <TextInput
                    style={{
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                      backgroundColor: "white",
                      borderRadius: 6,
                      padding: 12,
                      marginBottom: 42,
                      paddingLeft: 15,
                    }}
                    placeholder=""
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity
                    style={{
                      backgroundColor: "black",
                      borderRadius: 9999,
                      padding: 12,
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "white",
                        opacity: 0.5,
                      }}
                    />
                    <Text style={{ marginHorizontal: 16, color: "black" }}>
                      OR
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        height: 1,
                        backgroundColor: "white",
                        opacity: 0.5,
                      }}
                    />
                  </View>

                  {/* Social Login Buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 32,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: 9999,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        flex: 1,
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor: "#E5E5E5",
                      }}
                    >
                      <Image
                        source={require("../assets/images/google.png")}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{ color: "black", marginLeft: 4, fontSize: 12 }}
                      >
                        Login with Google
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: 9999,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        flex: 1,
                        marginLeft: 8,
                        borderWidth: 1,
                        borderColor: "#E5E5E5",
                      }}
                    >
                      <Image
                        source={require("../assets/images/apple.png")}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{ color: "black", marginLeft: 4, fontSize: 12 }}
                      >
                        Login with Apple
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                    }}
                  >
                    <Text style={{ color: "white" }}>
                      Already have an account?{" "}
                    </Text>
                    <Link href="/loginscreen" asChild>
                      <TouchableOpacity>
                        <Text style={{ color: "black", fontWeight: "bold" }}>
                          Login
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom section with crowd silhouette - only visible when keyboard is NOT shown */}
          {!keyboardVisible && (
            <View
              style={{
                width: "100%",
                height: Platform.OS === "ios" ? 100 : 120,
                zIndex: 1,
              }}
            >
              <Image
                source={require("../assets/images/crowd.png")}
                style={{ width: "100%", height: "100%", opacity: 0.3 }}
                resizeMode="cover"
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
