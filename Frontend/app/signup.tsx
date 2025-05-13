import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

// API configuration - use environment variables for sensitive data
const API_URL = "https://{AUTH0_DOMAIN}/api/v2/";

// Token storage keys
const AUTH_TOKENS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  TOKEN_EXPIRY: "auth_token_expiry",
  USER_DATA: "auth_user_data",
};

interface AuthTokensPayload {
  access_token?: string;
  refresh_token?: string;
}

const JWTUtils = {
  // Store tokens securely
  storeTokens: async (tokens: AuthTokensPayload): Promise<boolean> => {
    try {
      if (tokens.access_token) {
        await SecureStore.setItemAsync(
          AUTH_TOKENS.ACCESS_TOKEN,
          tokens.access_token
        );

        // Decode and store expiration
        const decodedToken: { exp?: number; user?: any } = jwtDecode(
          tokens.access_token
        );
        if (decodedToken.exp) {
          await SecureStore.setItemAsync(
            AUTH_TOKENS.TOKEN_EXPIRY,
            decodedToken.exp.toString()
          );
        }

        // Store user data if available
        if (decodedToken.user) {
          await SecureStore.setItemAsync(
            AUTH_TOKENS.USER_DATA,
            JSON.stringify(decodedToken.user)
          );
        }
      }

      // Store refresh token if available
      if (tokens.refresh_token) {
        await SecureStore.setItemAsync(
          AUTH_TOKENS.REFRESH_TOKEN,
          tokens.refresh_token
        );
      }

      return true;
    } catch (error) {
      console.error("Error storing tokens:", error);
      return false;
    }
  },

  // Check if token is expired
  isTokenExpired: async () => {
    try {
      const expiryString = await SecureStore.getItemAsync(
        AUTH_TOKENS.TOKEN_EXPIRY
      );
      if (!expiryString) return true;

      const expiry = parseInt(expiryString, 10);
      const currentTime = Math.floor(Date.now() / 1000);

      // Add a 60 second buffer
      return currentTime >= expiry - 60;
    } catch (error) {
      console.error("Error checking token expiry:", error);
      return true;
    }
  },

  // Get valid token (refresh if needed)
  getValidToken: async () => {
    try {
      const isExpired = await JWTUtils.isTokenExpired();

      if (isExpired) {
        const refreshToken = await SecureStore.getItemAsync(
          AUTH_TOKENS.REFRESH_TOKEN
        );
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/api/refresh-token`, {
          refresh_token: refreshToken,
        });

        if (response.data.access_token) {
          await JWTUtils.storeTokens(response.data);
          return response.data.access_token;
        } else {
          throw new Error("Failed to refresh token");
        }
      }

      // Return existing token if not expired
      return await SecureStore.getItemAsync(AUTH_TOKENS.ACCESS_TOKEN);
    } catch (error) {
      console.error("Error getting valid token:", error);
      // Clear tokens on refresh failure
      await JWTUtils.clearTokens();
      return null;
    }
  },

  // Clear all tokens (for logout)
  clearTokens: async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKENS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(AUTH_TOKENS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(AUTH_TOKENS.TOKEN_EXPIRY);
      await SecureStore.deleteItemAsync(AUTH_TOKENS.USER_DATA);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  },

  // Get user data from stored token
  getUserData: async () => {
    try {
      const userData = await SecureStore.getItemAsync(AUTH_TOKENS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  },
};

// Create axios instance with auth interceptor
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
authAxios.interceptors.request.use(
  async (config) => {
    const token = await JWTUtils.getValidToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token errors
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const token = await JWTUtils.getValidToken();
        if (token) {
          // Retry with new token
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axios(originalRequest);
        } else {
          // Explicitly handle the case where token is null after attempting refresh
          await JWTUtils.clearTokens(); // Ensure tokens are cleared
          router.replace("/loginscreen"); // This will now use the global router
          return Promise.reject(
            new Error("Token refresh failed and user logged out.")
          ); // Reject to stop further processing
        }
      } catch (refreshError) {
        await JWTUtils.clearTokens();
        router.replace("/loginscreen"); // This will now use the global router
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

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

  // Validate form inputs
  const validateForm = () => {
    // Reset error message
    setErrorMessage("");

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // Check if password is valid (at least 8 chars with numbers and letters)
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return false;
    }

    // Additional password strength requirements
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      setErrorMessage("Password must contain both letters and numbers");
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return false;
    }

    return true;
  };

  // Handle signup with API
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to register user using the API endpoint
      const response = await axios.post(`${API_URL}/api/register`, {
        email,
        password,
      });

      // Handle successful signup
      setIsLoading(false);

      // Store tokens securely
      if (response.data.access_token) {
        const tokenStored = await JWTUtils.storeTokens(response.data);

        if (!tokenStored) {
          throw new Error("Failed to store authentication tokens");
        }
      } else {
        throw new Error("No access token received from the server");
      }

      // Show success message
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to user type selection screen
            router.push("/selectuser");
          },
        },
      ]);
    } catch (error: any) {
      setIsLoading(false);

      if (error.response) {
        setErrorMessage(
          error.response.data?.detail || "Signup failed. Please try again."
        );
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
      } else if (error.message) {
        setErrorMessage(
          error.message || "An error occurred. Please try again."
        );
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  // Social login handlers with improved JWT handling
  const handleSocialLogin = async (provider: string, idToken: string) => {
    try {
      setIsLoading(true);

      const response = await axios.post(`${API_URL}/api/social-login`, {
        provider,
        id_token: idToken,
      });

      setIsLoading(false);

      if (response.data.access_token) {
        // Store tokens securely
        await JWTUtils.storeTokens(response.data);

        // Check user data for profile completion status
        const userData = await JWTUtils.getUserData();

        if (userData?.needs_profile_completion) {
          router.push("/selectuser");
        } else {
          router.push("/home");
        }
      } else {
        throw new Error(`No access token received from ${provider} login`);
      }
    } catch (error) {
      // error is of type 'unknown'
      setIsLoading(false);
      let alertMessage = `An error occurred during ${provider} login.`; // Default message

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (
          responseData &&
          typeof responseData === "object" &&
          "detail" in responseData &&
          typeof (responseData as any).detail === "string"
        ) {
          alertMessage = (responseData as any).detail;
        } else {
          alertMessage = error.message;
        }
      } else if (error instanceof Error) {
        alertMessage = error.message;
      }

      // If the error is not an AxiosError or a standard Error instance, the default message will be used.
      Alert.alert(`${provider} Login Failed`, alertMessage);
    }
  };

  const handleGoogleLogin = async () => {
    // This would be replaced with actual Google Auth implementation
    const googleIdToken = "GOOGLE_ID_TOKEN";
    await handleSocialLogin("google", googleIdToken);
  };

  const handleAppleLogin = async () => {
    // This would be replaced with actual Apple Auth implementation
    const appleIdToken = "APPLE_ID_TOKEN";
    await handleSocialLogin("apple", appleIdToken);
  };

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
                  {/* Error message display */}
                  {errorMessage ? (
                    <View
                      style={{
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        padding: 10,
                        borderRadius: 6,
                        marginBottom: 16,
                      }}
                    >
                      <Text style={{ color: "red" }}>{errorMessage}</Text>
                    </View>
                  ) : null}

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
                    placeholder="your@email.com"
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
                      marginBottom: 18,
                      paddingLeft: 15,
                    }}
                    placeholder="Minimum 8 characters with letters and numbers"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <Text
                    style={{ color: "black", marginBottom: 4, marginLeft: 4 }}
                  >
                    Confirm Password
                  </Text>
                  <TextInput
                    style={{
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                      backgroundColor: "white",
                      borderRadius: 6,
                      padding: 12,
                      marginBottom: 24,
                      paddingLeft: 15,
                    }}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity
                    style={{
                      backgroundColor: "black",
                      borderRadius: 9999,
                      padding: 12,
                      alignItems: "center",
                      marginBottom: 24,
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                    onPress={handleSignup}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={{ color: "white", fontWeight: "bold" }}>
                        Sign Up
                      </Text>
                    )}
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
                      onPress={handleGoogleLogin}
                      disabled={isLoading}
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
                      onPress={handleAppleLogin}
                      disabled={isLoading}
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
