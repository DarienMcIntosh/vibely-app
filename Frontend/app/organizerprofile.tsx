import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { default as React, useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
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
  CreateEvent: undefined;
  EditProfile: undefined;
  Calendar: undefined;
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
interface OrganizerData {
  name: string;
  username: string;
  bio: string;
  followers: number;
  verified: boolean;
  trusted: boolean;
  likes: number;
  rsvps: number;
  newFollowers: number;
}

// Type definition for calendar day
interface CalendarDay {
  day: number;
  month: string;
  year: number;
  events: number;
  isToday: boolean;
}

export default function OrganizerProfileScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState("Scheduled Events");
  const [currentMonth, setCurrentMonth] = useState("Jul");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [activeDate, setActiveDate] = useState(27);
  const [selectedFilter, setSelectedFilter] = useState("Upcoming Events");
  const [scheduledEvents, setScheduledEvents] = useState<Event[]>([]);
  const [calendarDays, setCalendarDays] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [organizerData, setOrganizerData] = useState<OrganizerData>({
    name: "MoBay Reggae Nights",
    username: "@harmonybeachpark",
    bio: "(Monthly Series)\nEndorsed by @terfjamacia @visitjamacia\nAuthentic Ja Experience>",
    followers: 2500,
    verified: true,
    trusted: true,
    likes: 43560,
    rsvps: 94768,
    newFollowers: 1200,
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
      title: "MoBay Reggae Nights",
      time: "4:00PM",
      image: require("../assets/images/reggae.jpg"),
      date: "30",
      month: "Jul",
      saved: false,
    },
  ]);

  // Function to load organizer data from AsyncStorage
  const loadOrganizerData = async () => {
    try {
      const data = await AsyncStorage.getItem("organizerData");
      if (data) {
        const parsedData = JSON.parse(data);
        setOrganizerData((current) => ({
          ...current,
          ...parsedData,
        }));

        // Clear the profile updated flag
        await AsyncStorage.removeItem("profileUpdated");
      }
    } catch (error) {
      console.error("Error fetching organizer data:", error);
    }
  };

  // Use useFocusEffect to check for updates whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkForProfileUpdates = async () => {
        try {
          const isProfileUpdated = await AsyncStorage.getItem("profileUpdated");
          if (isProfileUpdated === "true") {
            loadOrganizerData();
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
    loadOrganizerData();
  }, []);

  // Fetch scheduled events from AsyncStorage
  useEffect(() => {
    const fetchScheduledEvents = async () => {
      try {
        const scheduledEventsData = await AsyncStorage.getItem(
          "scheduledEvents"
        );
        if (scheduledEventsData) {
          setScheduledEvents(JSON.parse(scheduledEventsData));
        }
      } catch (error) {
        console.error("Error fetching scheduled events:", error);
      }
    };

    fetchScheduledEvents();
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
    if (activeTab === "Scheduled Events") {
      return events.filter(
        (event) =>
          String(event.date) === String(activeDate) &&
          event.month === currentMonth
      );
    } else {
      // For Analytics tab - return empty for now
      return [];
    }
  };

  const filteredEvents = getFilteredEvents();

  // Navigate to EditOrganizerProfile screen
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
                  color: date === activeDate ? "#4D1500" : "white",
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

  const navigateToCreateEvent = () => {
    navigation.navigate("CreateEvent");
  };

  // Render analytics cards
  const renderAnalyticsCard = (
    icon: string,
    title: string,
    value: string,
    days: number
  ) => {
    return (
      <View style={styles.analyticsCard}>
        <View style={styles.analyticsCardContent}>
          <View style={styles.analyticsIconContainer}>
            <Image
              source={
                icon === "likes"
                  ? require("../assets/images/heart.png")
                  : icon === "rsvps"
                  ? require("../assets/images/rsvp.png")
                  : require("../assets/images/followers.png")
              }
              style={styles.analyticsIcon}
            />
          </View>
          <Text style={styles.analyticsValue}>{value}</Text>
          <Text style={styles.analyticsTitle}>
            {title === "followers"
              ? "Followers"
              : title === "rsvps"
              ? "RSVP'd Events"
              : "Likes"}
          </Text>
        </View>
        <View style={styles.analyticsCardFooter}>
          <Text style={styles.daysText}>Last 7 Days</Text>
          <Text style={styles.viewMoreText}>View More</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4D1500" }}>
      <StatusBar barStyle="light-content" backgroundColor="#4D1500" />

      {/* Main gradient background */}
      <LinearGradient colors={["#4D1500", "#200800"]} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {/* Profile section with image and info */}
          <View style={styles.container}>
            {/* Profile header with image, name, and buttons */}
            <View style={styles.profileHeader}>
              {/* Profile image and name container */}
              <View style={styles.profileImageContainer}>
                <Image
                  source={require("../assets/images/reggae.jpg")}
                  style={styles.profileImage}
                />

                {/* Username and following details */}
                <View style={styles.profileTextContainer}>
                  <View style={styles.usernameContainer}>
                    <Text style={styles.username}>{organizerData.name}</Text>
                    {organizerData.verified && (
                      <Image
                        source={require("../assets/images/verified.png")}
                        style={styles.verifiedIcon}
                      />
                    )}
                    {organizerData.trusted && (
                      <Image
                        source={require("../assets/images/trust.png")}
                        style={styles.trustIcon}
                      />
                    )}
                  </View>
                  <Text style={styles.followersText}>
                    Followers {organizerData.followers}
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

            {/* Bio line */}
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{organizerData.bio}</Text>
            </View>

            {/* Tabs - Scheduled Events and Analytics */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "Scheduled Events" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("Scheduled Events")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Scheduled Events" && styles.activeTabText,
                  ]}
                >
                  Scheduled Events
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === "Analytics" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("Analytics")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Analytics" && styles.activeTabText,
                  ]}
                >
                  Analytics
                </Text>
              </TouchableOpacity>
            </View>

            {/* Analytics Section */}
            {activeTab === "Analytics" && (
              <View style={styles.analyticsContainer}>
                {renderAnalyticsCard(
                  "likes",
                  "likes",
                  `+${organizerData.likes.toLocaleString()}`,
                  7
                )}

                {renderAnalyticsCard(
                  "rsvps",
                  "rsvps",
                  `+${organizerData.rsvps.toLocaleString()}`,
                  7
                )}

                {renderAnalyticsCard(
                  "followers",
                  "followers",
                  `+${organizerData.newFollowers}`,
                  7
                )}
              </View>
            )}

            {/* Calendar box - only show if in Scheduled Events tab */}
            {activeTab === "Scheduled Events" && (
              <View style={styles.calendarContainer}>
                {/* Year and Month selector row */}
                <View style={styles.monthYearSelector}>
                  {/* Month selector with dropdown */}
                  <View style={styles.monthContainer}>
                    <TouchableOpacity
                      style={styles.monthSelector}
                      onPress={() => {
                        setShowMonthDropdown(!showMonthDropdown);
                        setShowYearDropdown(false);
                      }}
                    >
                      <Text style={styles.monthText}>{currentMonth}</Text>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color="white"
                        style={styles.dropdownIcon}
                      />
                    </TouchableOpacity>

                    {/* Month dropdown */}
                    {showMonthDropdown && (
                      <View style={styles.monthDropdown}>
                        <ScrollView>
                          {months.map((month) => (
                            <TouchableOpacity
                              key={month}
                              style={[
                                styles.monthOption,
                                month === currentMonth && styles.selectedMonth,
                              ]}
                              onPress={() => {
                                setCurrentMonth(month);
                                setShowMonthDropdown(false);
                                setSelectedDate(null);
                              }}
                            >
                              <Text style={styles.monthOptionText}>
                                {month}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  {/* Year selector with dropdown */}
                  <View style={styles.yearContainer}>
                    <TouchableOpacity
                      style={styles.yearSelector}
                      onPress={() => {
                        setShowYearDropdown(!showYearDropdown);
                        setShowMonthDropdown(false);
                      }}
                    >
                      <Text style={styles.yearText}>{selectedYear}</Text>
                      <Ionicons
                        name="chevron-down"
                        size={20}
                        color="white"
                        style={styles.dropdownIcon}
                      />
                    </TouchableOpacity>

                    {/* Year dropdown */}
                    {showYearDropdown && (
                      <View style={styles.yearDropdown}>
                        {years.map((year) => (
                          <TouchableOpacity
                            key={year}
                            style={[
                              styles.yearOption,
                              year === selectedYear && styles.selectedYear,
                            ]}
                            onPress={() => {
                              setSelectedYear(year);
                              setShowYearDropdown(false);
                              setSelectedDate(null);
                            }}
                          >
                            <Text style={styles.yearOptionText}>{year}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* Calendar days header */}
                <View style={styles.calendarHeader}>
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <View key={index} style={styles.calendarHeaderDay}>
                      <Text style={styles.calendarHeaderDayText}>{day}</Text>
                    </View>
                  ))}
                </View>

                {/* Calendar dates - dynamically generated */}
                {renderCalendarDays()}

                {/* Event filter buttons */}
                <View style={styles.filterContainer}>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      selectedFilter === "Past Events" &&
                        styles.activeFilterButton,
                    ]}
                    onPress={() => setSelectedFilter("Past Events")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === "Past Events" &&
                          styles.activeFilterText,
                      ]}
                    >
                      Past Events
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      selectedFilter === "Upcoming Events" &&
                        styles.activeFilterButton,
                    ]}
                    onPress={() => setSelectedFilter("Upcoming Events")}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === "Upcoming Events" &&
                          styles.activeFilterText,
                      ]}
                    >
                      Upcoming Events
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Event cards */}
                <View style={styles.eventsContainer}>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TouchableOpacity
                        key={event.id}
                        style={styles.eventCard}
                        onPress={() =>
                          navigation.navigate("EventDetails", {
                            eventId: event.id,
                          })
                        }
                      >
                        <Image
                          source={event.image}
                          style={styles.eventImage}
                          resizeMode="cover"
                        />
                        <View style={styles.editIconContainer}>
                          <Ionicons name="pencil" size={18} color="white" />
                        </View>
                        <View style={styles.eventDetails}>
                          <Text style={styles.eventTitle}>{event.title}</Text>
                          <Text style={styles.eventTime}>{event.time}</Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.noEventsContainer}>
                      <Text style={styles.noEventsText}>
                        That's All The Events For This Day!
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Tab Navigation */}
        <View style={styles.bottomTabContainer}>
          <TouchableOpacity style={styles.tabItem} onPress={navigateToHome}>
            <Image
              source={require("../assets/images/home.png")}
              style={styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={navigateToTrending}>
            <Image
              source={require("../assets/images/trending.png")}
              style={styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={navigateToCreateEvent}
          >
            <Image
              source={require("../assets/images/event.png")}
              style={styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={navigateToMap}>
            <Image
              source={require("../assets/images/location.png")}
              style={styles.tabIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => {}}>
            <Image
              source={require("../assets/images/profile.png")}
              style={[styles.tabIcon, { tintColor: "#D67D00" }]}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  profileImageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: "#D67D00",
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  trustIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  followersText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  bioContainer: {
    marginBottom: 16,
    marginLeft: 10,
  },
  bioText: {
    color: "white",
    fontSize: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 0,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#D67D00",
  },
  tabText: {
    color: "white",
    fontSize: 14,
  },
  activeTabText: {
    color: "#D67D00",
  },
  calendarContainer: {
    backgroundColor: "rgba(173, 121, 20, 0.25)",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  monthYearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  monthContainer: {
    position: "relative",
    flex: 1,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    color: "white",
    fontSize: 24,
    fontWeight: "500",
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  monthDropdown: {
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
  },
  monthOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
  },
  selectedMonth: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  monthOptionText: {
    color: "white",
  },
  yearContainer: {
    position: "relative",
  },
  yearSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  yearText: {
    color: "white",
    fontSize: 24,
    fontWeight: "500",
  },
  yearDropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#3E2613",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    zIndex: 10,
    width: 80,
  },
  yearOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
  },
  selectedYear: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  yearOptionText: {
    color: "white",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calendarHeaderDay: {
    width: 30,
    alignItems: "center",
  },
  calendarHeaderDayText: {
    color: "white",
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
    marginVertical: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 4,
  },
  activeFilterButton: {
    backgroundColor: "#D67D00",
  },
  filterButtonText: {
    color: "#555555",
    fontSize: 12,
  },
  activeFilterText: {
    color: "white",
    fontWeight: "500",
  },
  eventsContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  eventCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  editIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  eventDetails: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  eventTime: {
    color: "#D67D00",
    fontWeight: "bold",
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  noEventsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noEventsText: {
    color: "white",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
    fontSize: 12,
  },
  analyticsContainer: {
    marginTop: 16,
  },
  analyticsCard: {
    backgroundColor: "#4D1500",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  analyticsCardContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#3D1100",
  },
  analyticsIconContainer: {
    marginBottom: 8,
  },
  analyticsIcon: {
    width: 24,
    height: 24,
    tintColor: "#D67D00",
  },
  analyticsValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 4,
  },
  analyticsTitle: {
    color: "#D67D00",
    fontSize: 14,
  },
  analyticsCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  daysText: {
    color: "white",
    fontSize: 12,
  },
  viewMoreText: {
    color: "#D67D00",
    fontSize: 12,
  },
  bottomTabContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingVertical: 16,
    backgroundColor: "black",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});
