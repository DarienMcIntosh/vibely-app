import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { City, Country, ICity, ICountry } from "country-state-city";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

interface EventCategory {
  id: string;
  name: string;
  selected: boolean;
}

// Custom Alert component
const CustomAlert = ({
  visible,
  title,
  message,
  buttons,
  type = "success",
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress?: () => void;
    style?: "default" | "cancel" | "destructive";
  }>;
  type?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}) => {
  if (!visible) return null;

  // Determine colors based on alert type
  const getColors = () => {
    switch (type) {
      case "success":
        return { bg: "#FF5722", icon: "checkcircle" };
      case "error":
        return { bg: "#F44336", icon: "closecircle" };
      case "warning":
        return { bg: "#FF9800", icon: "exclamationcircle" };
      case "info":
      default:
        return { bg: "#2196F3", icon: "infocirlce" };
    }
  };

  const colors = getColors();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={alertStyles.overlay}>
        <Animatable.View
          animation="zoomIn"
          duration={300}
          style={alertStyles.container}
        >
          <LinearGradient
            colors={[colors.bg, lightenColor(colors.bg, 30)]}
            style={alertStyles.gradientHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <AntDesign name={colors.icon} size={32} color="white" />
          </LinearGradient>

          <View style={alertStyles.content}>
            <Text style={alertStyles.title}>{title}</Text>
            <Text style={alertStyles.message}>{message}</Text>

            <View style={alertStyles.buttonContainer}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    alertStyles.button,
                    index === buttons.length - 1 && alertStyles.primaryButton,
                    button.style === "cancel" && alertStyles.cancelButton,
                  ]}
                  onPress={() => {
                    onClose();
                    button.onPress && button.onPress();
                  }}
                >
                  <Text
                    style={[
                      alertStyles.buttonText,
                      index === buttons.length - 1 &&
                        alertStyles.primaryButtonText,
                      button.style === "cancel" && alertStyles.cancelButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

// Helper function to lighten a color
const lightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
};

// Improved SearchableLocationDropdown with optimization
const SearchableLocationDropdown = ({
  isCountry = true,
  selectedCountry = null as ICountry | null,
  value,
  onSelect,
  placeholder,
}: {
  isCountry?: boolean;
  selectedCountry?: ICountry | null;
  value: any;
  onSelect: (item: any) => void;
  placeholder: string;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<(ICountry | ICity)[]>([]);

  // Initialize data with useMemo to prevent unnecessary re-computation
  const allData = useMemo(() => {
    if (isCountry) {
      // Get all countries
      return Country.getAllCountries();
    } else if (selectedCountry) {
      // Get cities for the selected country
      return City.getCitiesOfCountry(selectedCountry.isoCode) || [];
    }
    return [];
  }, [isCountry, selectedCountry?.isoCode]);

  // Pre-filter the most common countries to show first if no search query
  const initialCountries = useMemo(() => {
    if (isCountry) {
      const popularCodes = [
        "US",
        "GB",
        "CA",
        "AU",
        "IN",
        "FR",
        "DE",
        "JP",
        "CN",
        "BR",
      ];
      const popular = allData.filter((country) =>
        popularCodes.includes((country as ICountry).isoCode)
      );
      const others = allData.filter(
        (country) => !popularCodes.includes((country as ICountry).isoCode)
      );
      return [...popular, ...others.slice(0, 30)]; // Show popular + first 30 other countries
    }
    return allData.slice(0, 50); // For cities, just show first 50 by default
  }, [isCountry, allData]);

  // Filter data based on search query - with debounce-like effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        setFilteredData(
          allData
            .filter((item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 50)
        );
      } else {
        setFilteredData(initialCountries);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allData, initialCountries]);

  // Initialize filtered data when modal opens
  useEffect(() => {
    if (modalVisible) {
      setFilteredData(initialCountries);
    }
  }, [modalVisible, initialCountries]);

  interface HandleSelectParams {
    name: string;
    isoCode?: string;
  }

  const handleSelect = (item: HandleSelectParams): void => {
    onSelect(item);
    setModalVisible(false);
    setSearchQuery("");
  };

  const displayValue = value ? value.name : placeholder;

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.dropdownButtonText, !value && styles.placeholderText]}
        >
          {displayValue}
        </Text>
        <Feather name="chevron-down" size={18} color="#7d3a11" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Animatable.View
            animation="slideInUp"
            duration={300}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery("");
                }}
              >
                <Feather name="x" size={24} color="4caf50" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{placeholder}</Text>
            </View>

            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#7d3a11" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor="#9e9e9e"
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Feather name="x-circle" size={20} color="#7d3a11" />
                </TouchableOpacity>
              ) : null}
            </View>

            <FlatList
              data={filteredData as (ICountry | ICity)[]}
              keyExtractor={(item, index) =>
                `${(item as ICountry).isoCode || ""}${item.name}-${index}`
              }
              renderItem={({ item }: { item: ICountry | ICity }) => (
                <TouchableOpacity
                  style={styles.itemButton}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                  {isCountry && "isoCode" in item && (
                    <Text style={styles.itemSubtext}>{item.isoCode}</Text>
                  )}
                </TouchableOpacity>
              )}
              style={styles.listContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={5}
              removeClippedSubviews={true}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No results found</Text>
                </View>
              }
            />
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

const UserCustomize = () => {
  // Import router for navigation
  const router = useRouter();

  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  // New state for custom alert
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [] as Array<{
      text: string;
      onPress?: () => void;
      style?: "default" | "cancel" | "destructive";
    }>,
    type: "success" as "success" | "error" | "warning" | "info",
  });

  // New state to track form validity
  const [isFormValid, setIsFormValid] = useState(false);

  // Event categories
  const [categories, setCategories] = useState<EventCategory[]>([
    { id: "1", name: "Music", selected: true },
    { id: "2", name: "Party", selected: true },
    { id: "3", name: "Food & Drink", selected: true },
    { id: "4", name: "Charity Events", selected: true },
    { id: "5", name: "Corporate Events", selected: true },
  ]);

  // Show custom alert
  const showAlert = (
    title: string,
    message: string,
    buttons: Array<{
      text: string;
      onPress?: () => void;
      style?: "default" | "cancel" | "destructive";
    }>,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      buttons,
      type,
    });
  };

  // Close custom alert
  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  // Toggle event category selection
  const toggleCategory = (id: string) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    // Request permissions first (for iOS)
    if (Platform.OS !== "web") {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        showAlert(
          "Permission Required",
          "Please grant camera and photo library permissions to upload a profile picture.",
          [{ text: "OK" }],
          "warning"
        );
        return;
      }
    }

    // Show action sheet with options using our custom alert
    showAlert(
      "Upload Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () => takePhoto(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => pickImage(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      "info"
    );
  };

  // Function to take a photo with the camera
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      showAlert(
        "Error",
        "Failed to take photo. Please try again.",
        [{ text: "OK" }],
        "error"
      );
    }
  };

  // Function to pick an image from the gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showAlert(
        "Error",
        "Failed to select image. Please try again.",
        [{ text: "OK" }],
        "error"
      );
    }
  };

  // Reset city when country changes
  useEffect(() => {
    setSelectedCity(null);
  }, [selectedCountry]);

  // Check form validity when any field changes
  useEffect(() => {
    // Check if required fields are filled
    const hasRequiredFields =
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      username.trim() !== "" &&
      selectedCountry !== null;

    // Check if at least one category is selected
    const hasSelectedCategory = categories.some(
      (category) => category.selected
    );

    // Update form validity
    setIsFormValid(hasRequiredFields && hasSelectedCategory);
  }, [firstName, lastName, username, selectedCountry, categories]);

  // Handle continue button press
  const handleContinue = () => {
    if (isFormValid) {
      // Save user data (you would typically send this to your backend)
      const userData = {
        firstName,
        lastName,
        username,
        bio,
        profileImageUri: profileImage,
        country: selectedCountry?.name,
        city: selectedCity?.name,
        preferences: categories
          .filter((cat) => cat.selected)
          .map((cat) => cat.name),
      };

      // Log the data (for development purposes)
      console.log("User data saved:", userData);

      // Show success message with green color (#4CAF50)
      showAlert(
        "Profile Created",
        "Your profile has been successfully created!",
        [
          {
            text: "Welcome to Vibely!",
            onPress: () => {
              // Navigate to home screen
              router.replace("/home");
            },
          },
        ],
        "success"
      );
    } else {
      // Show validation error
      showAlert(
        "Missing Information",
        "Please fill out all required fields (First Name, Last Name, Username, Country) and select at least one event preference.",
        [{ text: "OK" }],
        "error"
      );
    }
  };

  // Handle back button press - navigate to selectuser screen
  const handleBack = () => {
    router.replace("/selectuser");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient colors={["#FF5722", "#FFB74D"]} style={styles.gradient}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text style={styles.timeText}>Create Profile</Text>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.ScrollView}
        >
          {/* Profile Image Section */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../assets/images/avatar.png")
                }
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleImageUpload}
              >
                <Ionicons name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.uploadText}>Upload Profile Picture</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Name Field */}
            <Text style={styles.label}>
              First Name: <Text style={styles.required}>*</Text>
            </Text>
            <Animatable.View
              animation="fadeIn"
              duration={500}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#9e9e9e"
              />
              <TouchableOpacity style={styles.editButton}>
                <Feather name="edit-2" size={18} color="#7d3a11" />
              </TouchableOpacity>
            </Animatable.View>

            <Text style={styles.label}>
              Last Name: <Text style={styles.required}>*</Text>
            </Text>
            <Animatable.View
              animation="fadeIn"
              delay={100}
              duration={500}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#9e9e9e"
              />
              <TouchableOpacity style={styles.editButton}>
                <Feather name="edit-2" size={18} color="#7d3a11" />
              </TouchableOpacity>
            </Animatable.View>

            {/* Username Field */}
            <Text style={styles.label}>
              Username: <Text style={styles.required}>*</Text>
            </Text>
            <Animatable.View
              animation="fadeIn"
              delay={200}
              duration={500}
              style={styles.inputContainer}
            >
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                placeholderTextColor="#9e9e9e"
              />
              <TouchableOpacity style={styles.editButton}>
                <Feather name="edit-2" size={18} color="#7d3a11" />
              </TouchableOpacity>
            </Animatable.View>

            {/* Country Dropdown - Using SearchableLocationDropdown */}
            <Text style={styles.label}>
              Country: <Text style={styles.required}>*</Text>
            </Text>
            <Animatable.View animation="fadeIn" delay={300} duration={500}>
              <SearchableLocationDropdown
                isCountry={true}
                value={selectedCountry}
                onSelect={setSelectedCountry}
                placeholder="Select a country"
              />
            </Animatable.View>

            {/* City Dropdown - only show if country is selected */}
            {selectedCountry && (
              <Animatable.View animation="fadeIn" duration={500}>
                <Text style={styles.label}>City:</Text>
                <SearchableLocationDropdown
                  isCountry={false}
                  selectedCountry={selectedCountry}
                  value={selectedCity}
                  onSelect={setSelectedCity}
                  placeholder="Select a city"
                />
              </Animatable.View>
            )}

            {/* Bio Field */}
            <Text style={styles.label}>Bio:</Text>
            <Animatable.View
              animation="fadeIn"
              delay={400}
              duration={500}
              style={styles.bioContainer}
            >
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9e9e9e"
              />
              <TouchableOpacity style={styles.bioEditButton}>
                <Feather name="edit-2" size={18} color="#7d3a11" />
              </TouchableOpacity>
            </Animatable.View>
          </View>

          {/* Event Preferences */}
          <Animatable.View
            animation="fadeIn"
            delay={500}
            duration={500}
            style={styles.preferencesContainer}
          >
            <Text style={styles.preferencesTitle}>
              What are your preferred events?{" "}
              <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.categoriesContainer}>
              {categories.map((category, index) => (
                <Animatable.View
                  key={category.id}
                  animation="zoomIn"
                  delay={600 + index * 100}
                  duration={300}
                >
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      category.selected && styles.categoryButtonSelected,
                      category.name.length > 10 && styles.categoryButtonWide,
                    ]}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        category.selected && styles.categoryTextSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>

          {/* Continue Button */}
          <Animatable.View animation="fadeInUp" delay={800} duration={500}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                isFormValid
                  ? styles.continueButtonActive
                  : styles.continueButtonInactive,
              ]}
              onPress={handleContinue}
              disabled={!isFormValid}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
        onClose={closeAlert}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
    flexDirection: "row", // Added to align text beside the arrow
    alignItems: "center",
  },
  ScrollView: {
    marginTop: 50,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginLeft: 100,
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 30,
  },
  profileImageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF5722",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  uploadText: {
    marginTop: 10,
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    color: "black",
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 25,
  },
  required: {
    color: "#ff0000",
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#7d3a11",
    fontSize: 16,
  },
  editButton: {
    padding: 5,
  },
  bioContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    position: "relative",
    marginLeft: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bioInput: {
    color: "#7d3a11",
    fontSize: 16,
    textAlignVertical: "top",
    paddingRight: 30,
  },
  bioEditButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  dropdownContainer: {
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  dropdownButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownButtonText: {
    color: "#7d3a11",
    fontSize: 16,
  },
  placeholderText: {
    color: "#9e9e9e",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#7d3a11",
    marginRight: 30, // To offset the close button
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    flex: 1,
  },
  itemButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  itemSubtext: {
    fontSize: 14,
    color: "#888",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#9e9e9e",
    fontStyle: "italic",
  },
  preferencesContainer: {
    marginBottom: 30,
  },
  preferencesTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    fontStyle: "italic",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  categoryButton: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 5,
    minWidth: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonSelected: {
    backgroundColor: "#FF5722",
  },
  categoryButtonWide: {
    minWidth: 200,
  },
  categoryText: {
    color: "#7d3a11",
    fontSize: 14,
  },
  categoryTextSelected: {
    color: "white",
  },
  continueButton: {
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButtonActive: {
    backgroundColor: "black",
  },
  continueButtonInactive: {
    backgroundColor: "#999999",
  },
  continueText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

// Custom Alert styles
const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  gradientHeader: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "4caf50",
    textAlign: "center",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#FF5722",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#666",
  },
});

export default UserCustomize;
