import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Define the type for our navigation to ensure type safety
type RootStackParamList = {
  Home: undefined;
  Trending: undefined;
  Map: undefined;
  Profile: undefined;
  Search: undefined;
  EventDetails: { eventId: string };
  RSVP: { event: Event };
};

export default function TrendingScreen() {
  // Type the navigation to ensure proper type checking
  const navigation = useNavigation<any>();
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Sample event data
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

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "MARK'S POST-INDEPENDENCE PARTY",
      date: "20",
      month: "Jul",
      image: require("../assets/images/event1.jpg"),
      saved: false,
      liked: false,
      comments: [],
    },
    {
      id: "2",
      title: "JOSHUA'S BIRTHDAY PARTY",
      date: "15",
      month: "Aug",
      image: require("../assets/images/event2.jpg"),
      saved: false,
      liked: false,
      comments: [],
    },
    {
      id: "3",
      title: "DJ RYAN'S YACHT PARTY",
      date: "09",
      month: "Sep",
      image: require("../assets/images/event3.jpg"),
      saved: false,
      liked: false,
      comments: [],
    },
  ]);

  const refreshTrending = () => {
    setRefreshing(true);
    // Simulate refresh with timeout
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleLike = (id: string): void => {
    setEvents(
      events.map((event: Event) =>
        event.id === id ? { ...event, liked: !event.liked } : event
      )
    );
  };

  const toggleSave = (id: string): void => {
    setEvents(
      events.map((event: Event) =>
        event.id === id ? { ...event, saved: !event.saved } : event
      )
    );
  };

  const openComments = (id: string) => {
    setCurrentEventId(id);
    setCommentModalVisible(true);
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const updatedEvents = events.map((event) => {
      if (event.id === currentEventId) {
        return {
          ...event,
          comments: [
            {
              id: Date.now().toString(),
              username: user.name.toLowerCase(),
              comment: newComment,
              timeAgo: "now",
              likes: 0,
            },
            ...event.comments,
          ],
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    setNewComment("");
  };

  const openRSVP = (event: Event) => {
    navigation.navigate("RSVP", { event });
  };

  const shareEvent = (event: Event) => {
    // Share functionality would go here
    alert(`Sharing ${event.title}`);
  };

  // Function to navigate to Home screen
  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  // Function to navigate to Trending screen
  const navigateToTrending = () => {
    navigation.navigate("Trending");
  };

  // Function to navigate to Map screen
  const navigateToMap = () => {
    navigation.navigate("Map");
  };

  // Function to navigate to Profile screen
  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
      <LinearGradient colors={["#3E0F00", "#000000"]} style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 12,
            marginBottom: 16,
            marginTop: 10,
          }}
        >
          <View>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
              Trending
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Event List */}
        <ScrollView
          style={{ flex: 1 }}
          refreshing={refreshing}
          onRefresh={refreshTrending}
        >
          {events.map((event) => (
            <View
              key={event.id}
              style={{ marginHorizontal: 20, marginBottom: 25 }}
            >
              {/* Event Card */}
              <View
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                {/* Event Image with Overlay Title */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate("RSVP", { event })}
                >
                  <View style={{ position: "relative" }}>
                    <Image
                      source={event.image}
                      style={{ width: "100%", height: 180 }}
                      resizeMode="cover"
                    />

                    {/* Date Overlay */}
                    <View
                      style={{
                        position: "absolute",
                        left: 16,
                        top: 16,
                        backgroundColor: "#FF5722",
                        borderRadius: 8,
                        padding: 8,
                        alignItems: "center",
                        minWidth: 45,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      >
                        {event.date}
                      </Text>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 12,
                          textTransform: "uppercase",
                        }}
                      >
                        {event.month}
                      </Text>
                    </View>

                    {/* Title Overlay - Positioned at bottom of image with semi-transparent background */}
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "bold",
                          textShadowColor: "rgba(0, 0, 0, 0.75)",
                          textShadowOffset: { width: 0, height: 1 },
                          textShadowRadius: 2,
                        }}
                      >
                        {event.title}
                      </Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Action Buttons - Outside the card */}
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 12,
                  paddingTop: 8,
                }}
              >
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => toggleLike(event.id)}
                >
                  <Ionicons
                    name={event.liked ? "heart" : "heart-outline"}
                    size={20}
                    color={event.liked ? "#FF5722" : "white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => openComments(event.id)}
                >
                  <Ionicons name="chatbubble-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => openRSVP(event)}
                >
                  <Image
                    source={require("../assets/images/rsvp.png")}
                    style={{ width: 24, height: 24 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 20 }}
                  onPress={() => toggleSave(event.id)}
                >
                  <Ionicons
                    name={event.saved ? "bookmark" : "bookmark-outline"}
                    size={20}
                    color={event.saved ? "#FF5722" : "white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => shareEvent(event)}>
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {/* Add extra padding at bottom to ensure content isn't hidden behind the nav */}
          <View style={{ paddingBottom: 80 }} />
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            paddingVertical: 12,
            backgroundColor: "black",
            borderTopWidth: 0.5,
            borderTopColor: "rgba(255, 255, 255, 0.1)",
            elevation: 10,
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
            onPress={refreshTrending}
          >
            <Image
              source={require("../assets/images/trending.png")}
              style={{ width: 24, height: 24, tintColor: "#FF5722" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => navigation.navigate("Map")}
          >
            <Image
              source={require("../assets/images/location.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("../assets/images/profile.png")}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Comments Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
          <LinearGradient colors={["#3E0F00", "#000000"]} style={{ flex: 1 }}>
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.1)",
              }}
            >
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                style={{ marginRight: 20 }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Comments
              </Text>
            </View>

            {/* Comments List */}
            <FlatList
              data={
                currentEventId
                  ? events.find((e) => e.id === currentEventId)?.comments || []
                  : []
              }
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    padding: 15,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Image
                    source={{
                      uri: `https://i.pravatar.cc/150?u=${item.username}`,
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          marginRight: 5,
                        }}
                      >
                        {item.username}
                      </Text>
                      <Text
                        style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      >
                        {item.timeAgo}
                      </Text>
                    </View>
                    <Text style={{ color: "white", marginTop: 3 }}>
                      {item.comment}
                    </Text>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      <TouchableOpacity style={{ marginRight: 20 }}>
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 12,
                          }}
                        >
                          Reply
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Ionicons
                          name="heart-outline"
                          size={12}
                          color="rgba(255,255,255,0.6)"
                          style={{ marginRight: 3 }}
                        />
                        <Text
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 12,
                          }}
                        >
                          {item.likes}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="heart-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Comment Input */}
            <View
              style={{
                flexDirection: "row",
                padding: 10,
                borderTopWidth: 1,
                borderTopColor: "rgba(255,255,255,0.1)",
                alignItems: "center",
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  color: "white",
                  marginRight: 10,
                }}
                placeholder="Add a comment..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Ionicons name="send" size={24} color="#FF5722" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* RSVP Modal would be implemented as a separate screen in navigation */}
    </SafeAreaView>
  );
}
