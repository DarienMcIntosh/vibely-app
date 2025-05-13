import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define interface for the event data passed through navigation
interface Comment {
  id: string;
  username: string;
  comment: string;
  timeAgo: string;
  likes: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  month: string;
  image: any;
  saved: boolean;
  liked: boolean;
  comments: Comment[];
}

// Define the route params interface
interface RouteParams {
  event: Event;
}

export default function RSVPScreen() {
  // Default event data in case none is provided via navigation
  const defaultEvent = {
    id: "default",
    title: "JOSLYN'S BIRTHDAY PARTY",
    date: "15",
    month: "Aug",
    image: require("../assets/images/event2.jpg"),
    saved: false,
    liked: false,
    comments: [],
  };
  const navigation = useNavigation();
  const route = useRoute();
  // Add null check for route.params
  const routeParams = route.params as RouteParams | undefined;
  const event = routeParams?.event;

  // Use the event from route params if available, otherwise use default
  const currentEvent = event || defaultEvent;

  const [isSaved, setIsSaved] = useState(currentEvent.saved);
  const [rsvpStatus, setRsvpStatus] = useState<"none" | "interested" | "going">(
    "none"
  );

  // Mock data for the event details
  const eventDetails = {
    organizer: "Joslyn Reid",
    location: "Lot 56, Tropical Street, Bogue Heights Dr.",
    guests: [
      { id: "1", avatar: "https://i.pravatar.cc/150?u=joslynreid" },
      { id: "2", avatar: "https://i.pravatar.cc/150?u=guest2" },
    ],
    date: `${currentEvent.month}. ${currentEvent.date}, 2025`,
    deadline: `${currentEvent.month}. ${
      currentEvent.date < "10"
        ? "0" + (parseInt(currentEvent.date) - 5)
        : parseInt(currentEvent.date) - 5
    }, 2025`,
    admission: "FREE",
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleRSVP = (status: "interested" | "going") => {
    setRsvpStatus(status);

    // When interested is pressed, navigate to the ticket purchase screen
    if (status === "interested") {
      // Navigate to the TicketPurchaseScreen with all necessary event information
      navigation.navigate("TicketPurchase", {
        eventTitle: currentEvent.title,
        eventDate: currentEvent.date,
        eventMonth: currentEvent.month,
        eventTime: "6AM - 3PM EST", // Since this isn't in your event object, could be added or fetched
        eventLocation: eventDetails.location,
        eventOrganizer: eventDetails.organizer,
      });
    } else {
      // For other statuses, show the original alert
      Alert.alert(
        "RSVP Confirmation",
        `You have marked yourself as ${status} for ${currentEvent.title}`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient colors={["#3F0F00", "#000000"]} style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={{ marginRight: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Event Details
          </Text>
        </View>

        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          {/* Event Card */}
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {/* Event Image */}
            <Image
              source={currentEvent.image}
              style={{
                width: "95%",
                height: 160,
                borderRadius: 12,
                marginTop: 15,
                marginLeft: 10,
                marginRight: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
              resizeMode="cover"
            />

            {/* Event Details */}
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  marginBottom: 40,
                }}
              >
                {currentEvent.title}
              </Text>

              {/* Organizer */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    width: 120,
                  }}
                >
                  Event Organizer:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#FF5722",
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {eventDetails.organizer}
                </Text>
              </View>

              {/* Location */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    width: 120,
                  }}
                >
                  Location:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#FF5722",
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {eventDetails.location}
                </Text>
              </View>

              {/* Guests */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    width: 120,
                  }}
                >
                  Guests:
                </Text>
                <View style={{ flexDirection: "row" }}>
                  {eventDetails.guests.map((guest) => (
                    <Image
                      key={guest.id}
                      source={{ uri: guest.avatar }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        marginRight: 5,
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Two-column layout for Date and Deadline */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      marginBottom: 4,
                    }}
                  >
                    Date:
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#FF5722",
                      fontWeight: "500",
                    }}
                  >
                    {eventDetails.date}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "500",
                      marginBottom: 4,
                    }}
                  >
                    Deadline to RSVP:
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#FF5722",
                      fontWeight: "500",
                    }}
                  >
                    {eventDetails.deadline}
                  </Text>
                </View>
              </View>

              {/* Admission */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    width: 120,
                  }}
                >
                  Admission:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#FF5722",
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {eventDetails.admission}
                </Text>
              </View>

              {/* Save for Later button */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 8,
                }}
                onPress={handleSave}
              >
                <Ionicons
                  name={isSaved ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={isSaved ? "#FF5722" : "#000000"}
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 14 }}>Save for Later</Text>
              </TouchableOpacity>

              {/* RSVP Buttons */}
              <View style={{ marginBottom: 30 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      rsvpStatus === "interested" ? "#ffe710e8" : "#FF5722",
                    borderRadius: 30,
                    paddingVertical: 15,
                    alignItems: "center",
                    marginTop: 100,
                  }}
                  onPress={() => handleRSVP("interested")}
                >
                  <Text
                    style={{ color: "black", fontWeight: "bold", fontSize: 16 }}
                  >
                    Interested
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
