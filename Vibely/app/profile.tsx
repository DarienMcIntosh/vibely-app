import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Type definition for navigation
type RootStackParamList = {
  Home: undefined;
  Trending: undefined;
  Map: undefined;
  Profile: undefined;
  Search: undefined;
  EventDetails: { eventId: string };
  RSVP: { event: Event };
  EditProfile: undefined;
};

// Type definition for event
interface Event {
  id: string;
  title: string;
  time?: string;
  image: any;
  date: string | number;
  month: string;
  saved?: boolean;
  liked?: boolean;
  comments?: Comment[];
}

// Type definition for comment
interface Comment {
  id: string;
  username: string;
  comment: string;
  timeAgo: string;
  likes: number;
}

// Type definition for user data
interface UserData {
  name: string;
  username: string;
  bio: string;
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("RSVP Events");
  const [currentMonth, setCurrentMonth] = useState("Jun");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [activeDate, setActiveDate] = useState(6);
  const [selectedFilter, setSelectedFilter] = useState("Upcoming Events");
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [calendarDays, setCalendarDays] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [rsvpEvents, setRsvpEvents] = useState<Event[]>([]);
  const [userData, setUserData] = useState<UserData>({
    name: "Jessica",
    username: "Varcian_",
    bio: "I'm all about having a good time! 😊",
  });

  // Sample months for the dropdown
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Years for dropdown
  const years = [2024, 2025, 2026];

  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "AVERY'S ALL-WHITE",
      time: "7:00PM",
      image: require("../assets/images/allwhite.jpg"),
      date: "6",
      month: "Jun",
      saved: false,
    },
    {
      id: "2",
      title: "DJ KASH BEACH PARTY",
      time: "9:00PM",
      image: require("../assets/images/event2.jpg"),
      date: "15",
      month: "Jun",
      saved: false,
    },
    {
      id: "3",
      title: "SUMMER JAM CONCERT",
      time: "8:30PM",
      image: require("../assets/images/event3.jpg"),
      date: "22",
      month: "Jun",
      saved: false,
    },
  ]);

  // Function to load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        const parsedData = JSON.parse(data);
        setUserData((current) => ({
          ...current,
          ...parsedData,
        }));

        // Clear the profile updated flag
        await AsyncStorage.removeItem("profileUpdated");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Use useFocusEffect to check for updates whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkForProfileUpdates = async () => {
        try {
          const isProfileUpdated = await AsyncStorage.getItem("profileUpdated");
          if (isProfileUpdated === "true") {
            loadUserData();
          }
        } catch (error) {
          console.error("Error checking profile updates:", error);
        }
      };

      checkForProfileUpdates();
    }, [])
  );

  // Initial data loading
  useEffect(() => {
    loadUserData();
  }, []);

  // Fetch saved events from AsyncStorage
  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const savedEventsData = await AsyncStorage.getItem("savedEvents");
        if (savedEventsData) {
          setSavedEvents(JSON.parse(savedEventsData));
        }
      } catch (error) {
        console.error("Error fetching saved events:", error);
      }
    };

    fetchSavedEvents();
  }, [activeTab]);

  // Fetch RSVP events from AsyncStorage
  useEffect(() => {
    const fetchRSVPEvents = async () => {
      try {
        const rsvpEventsData = await AsyncStorage.getItem("rsvpEvents");
        if (rsvpEventsData) {
          setRsvpEvents(JSON.parse(rsvpEventsData));
        }
      } catch (error) {
        console.error("Error fetching RSVP events:", error);
      }
    };

    fetchRSVPEvents();
  }, [activeTab]);

  // Generate calendar days based on selected month and year
  useEffect(() => {
    const generateDays = () => {
      const monthIndex = months.findIndex((m) => m === currentMonth);
      const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      return days;
    };

    setCalendarDays(generateDays());

    // Reset selected date if it's beyond the number of days in the new month
    if (selectedDate && selectedDate > calendarDays.length) {
      setSelectedDate(null);
      setActiveDate(1);
    }
  }, [currentMonth, selectedYear]);

  // Filter events based on selected date and month
  const getFilteredEvents = () => {
    if (activeTab === "RSVP Events") {
      return rsvpEvents.filter(
        (event) =>
          String(event.date) === String(activeDate) &&
          event.month === currentMonth
      );
    } else {
      // For Saved tab
      return savedEvents;
    }
  };

  const filteredEvents = getFilteredEvents();

  // Navigate to EditProfile screen
  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  // Generate calendar days for current view
  const renderCalendarDays = () => {
    // This will show the days in rows of 7 (a week)
    const rows = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      const rowDays = calendarDays.slice(i, i + 7);
      rows.push(
        <View
          key={`row-${i}`}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          {rowDays.map((date) => (
            <TouchableOpacity
              key={date}
              onPress={() => {
                setActiveDate(date);
                setSelectedDate(date);
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor:
                  date === activeDate ? "#FFFFFF" : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: date === activeDate ? "#000000" : "white",
                  fontSize: 14,
                }}
              >
                {date}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Fill empty spaces if needed */}
          {Array(7 - rowDays.length)
            .fill(0)
            .map((_, index) => (
              <View key={`empty-${index}`} style={{ width: 30 }} />
            ))}
        </View>
      );
    }
    return rows;
  };

  // Navigate to other screens
  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  const navigateToTrending = () => {
    navigation.navigate("Trending");
  };

  const navigateToMap = () => {
    navigation.navigate("Map");
  };

  const toggleSaveEvent = async (event: Event) => {
    try {
      const updatedEvent = { ...event, saved: !event.saved };

      // Update the saved events list
      const updatedSavedEvents = event.saved
        ? savedEvents.filter((e) => e.id !== event.id)
        : [...savedEvents, updatedEvent];

      setSavedEvents(updatedSavedEvents);

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "savedEvents",
        JSON.stringify(updatedSavedEvents)
      );
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />

      {/* Main gradient background */}
      <LinearGradient colors={["#3F0F00", "#000000"]} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {/* Profile section with image and info */}
          <View style={{ paddingHorizontal: 16 }}>
            {/* Profile header with image, name, and buttons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 16,
                paddingHorizontal: 8,
                paddingTop: 16,
              }}
            >
              {/* Profile image and name container */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../assets/images/rema.jpg")}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "#ff9900ab",
                  }}
                />

                {/* Username and following details */}
                <View style={{ marginLeft: 16 }}>
                  <Text
                    style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                  >
                    {userData.username}
                  </Text>
                  <Text style={{ color: "white", fontSize: 13, marginTop: 4 }}>
                    Following 25
                  </Text>
                </View>
              </View>

              {/* Edit and Settings buttons */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  style={{ marginRight: 16 }}
                  onPress={navigateToEditProfile}
                >
                  <Ionicons name="pencil" size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="settings-outline" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bio line - Display bio from userData */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
                marginLeft: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 14 }}>
                {userData.bio}
              </Text>
            </View>

            {/* Private landing status */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
                marginLeft: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 14 }}>
                Private Landing
              </Text>
              <Ionicons
                name="flame"
                size={14}
                color="#FFD700"
                style={{ marginLeft: 5 }}
              />
              <Ionicons
                name="lock-closed"
                size={14}
                color="#FFD700"
                style={{ marginLeft: 2 }}
              />
            </View>

            {/* Tabs - RSVP Events and Saved */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.2)",
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderBottomWidth: activeTab === "RSVP Events" ? 2 : 0,
                  borderBottomColor: "#FF9800",
                }}
                onPress={() => setActiveTab("RSVP Events")}
              >
                <Text
                  style={{
                    color: activeTab === "RSVP Events" ? "#FF9800" : "white",
                  }}
                >
                  RSVP Events
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderBottomWidth: activeTab === "Saved" ? 2 : 0,
                  borderBottomColor: "#FF9800",
                }}
                onPress={() => setActiveTab("Saved")}
              >
                <Text
                  style={{ color: activeTab === "Saved" ? "#FF9800" : "white" }}
                >
                  Saved
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar box - only show if in RSVP Events tab */}
            {activeTab === "RSVP Events" && (
              <View
                style={{
                  backgroundColor: "rgba(173, 121, 20, 0.25)",
                  borderRadius: 16,
                  padding: 16,
                  marginTop: 16,
                }}
              >
                {/* Year and Month selector row */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  {/* Month selector with dropdown */}
                  <View style={{ position: "relative", flex: 1 }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setShowMonthDropdown(!showMonthDropdown);
                        setShowYearDropdown(false);
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 24,
                          fontWeight: "500",
                        }}
                      >
                        {currentMonth}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color="white"
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>

                    {/* Month dropdown */}
                    {showMonthDropdown && (
                      <View
                        style={{
                          position: "absolute",
                          top: 40,
                          left: 0,
                          backgroundColor: "#3E2613",
                          borderRadius: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 4,
                          zIndex: 10,
                          width: 80,
                          maxHeight: 200,
                        }}
                      >
                        <ScrollView>
                          {months.map((month) => (
                            <TouchableOpacity
                              key={month}
                              style={{
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                backgroundColor:
                                  month === currentMonth
                                    ? "rgba(255,255,255,0.2)"
                                    : "transparent",
                              }}
                              onPress={() => {
                                setCurrentMonth(month);
                                setShowMonthDropdown(false);
                                setSelectedDate(null);
                              }}
                            >
                              <Text style={{ color: "white" }}>{month}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* Year selector with dropdown */}
                  <View style={{ position: "relative" }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setShowYearDropdown(!showYearDropdown);
                        setShowMonthDropdown(false);
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 24,
                          fontWeight: "500",
                        }}
                      >
                        {selectedYear}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color="white"
                        style={{ marginLeft: 4 }}
                      />
                    </TouchableOpacity>

                    {/* Year dropdown */}
                    {showYearDropdown && (
                      <View
                        style={{
                          position: "absolute",
                          top: 40,
                          right: 0,
                          backgroundColor: "#3E2613",
                          borderRadius: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 4,
                          zIndex: 10,
                          width: 80,
                        }}
                      >
                        {years.map((year) => (
                          <TouchableOpacity
                            key={year}
                            style={{
                              paddingVertical: 8,
                              paddingHorizontal: 12,
                              backgroundColor:
                                year === selectedYear
                                  ? "rgba(255,255,255,0.2)"
                                  : "transparent",
                            }}
                            onPress={() => {
                              setSelectedYear(year);
                              setShowYearDropdown(false);
                              setSelectedDate(null);
                            }}
                          >
                            <Text style={{ color: "white" }}>{year}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* Calendar days header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <View
                      key={index}
                      style={{ width: 30, alignItems: "center" }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        {day}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Calendar dates - dynamically generated */}
                {renderCalendarDays()}
              </View>
            )}

            {/* White content area */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                marginTop: 16,
                overflow: "hidden",
                marginBottom: 80, // Add bottom margin for bottom nav
              }}
            >
              {/* Event filter buttons - only show for RSVP Events tab */}
              {activeTab === "RSVP Events" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: 12,
                    backgroundColor: "white",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        selectedFilter === "Past Events"
                          ? "#FF9800"
                          : "#E0E0E0",
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                      marginRight: 12,
                    }}
                    onPress={() => setSelectedFilter("Past Events")}
                  >
                    <Text
                      style={{
                        color:
                          selectedFilter === "Past Events"
                            ? "white"
                            : "#333333",
                        fontWeight:
                          selectedFilter === "Past Events" ? "500" : "normal",
                      }}
                    >
                      Past Events
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        selectedFilter === "Upcoming Events"
                          ? "#FF9800"
                          : "#E0E0E0",
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                    }}
                    onPress={() => setSelectedFilter("Upcoming Events")}
                  >
                    <Text
                      style={{
                        color:
                          selectedFilter === "Upcoming Events"
                            ? "white"
                            : "#333333",
                        fontWeight:
                          selectedFilter === "Upcoming Events"
                            ? "500"
                            : "normal",
                      }}
                    >
                      Upcoming Events
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Event cards */}
              <View style={{ padding: 12 }}>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 12,
                        overflow: "hidden",
                        marginBottom: 12,
                      }}
                      onPress={() => navigation.navigate("RSVP", { event })}
                    >
                      <Image
                        source={event.image}
                        style={{ width: "100%", height: 120 }}
                        resizeMode="cover"
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: 14,
                            textTransform: "uppercase",
                            flex: 1,
                          }}
                        >
                          {event.title}
                        </Text>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {event.time && (
                            <Text
                              style={{
                                color: "#FF9800",
                                fontWeight: "bold",
                                marginRight: 10,
                              }}
                            >
                              {event.time}
                            </Text>
                          )}
                          {activeTab === "Saved" && (
                            <TouchableOpacity
                              onPress={() => toggleSaveEvent(event)}
                            >
                              <Ionicons
                                name="bookmark"
                                size={22}
                                color="#FF9800"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={{ alignItems: "center", paddingVertical: 20 }}>
                    <Text
                      style={{
                        color: "#999999",
                        textAlign: "center",
                        marginTop: 8,
                        marginBottom: 16,
                        fontSize: 12,
                      }}
                    >
                      {activeTab === "RSVP Events"
                        ? "That's All The Events For This Day!"
                        : "No Saved Events Yet!"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Tab Navigation */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            paddingVertical: 16,
            backgroundColor: "black",
            borderTopWidth: 0.5,
            borderTopColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={navigateToHome}
          >
            <Image
              source={require("../assets/images/home.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={navigateToTrending}
          >
            <Image
              source={require("../assets/images/trending.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={navigateToMap}
          >
            <Image
              source={require("../assets/images/location.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => {}}
          >
            <Image
              source={require("../assets/images/profile.png")}
              style={{ width: 24, height: 24, tintColor: "#FF9800" }}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
