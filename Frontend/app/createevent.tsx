import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Date formatting helper
const formatDate = (date: Date): string => {
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
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

// Time formatting helper
const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

export default function CreateEventScreen() {
  const navigation = useNavigation<any>();
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState(["General Admission"]);
  const [image, setImage] = useState(null);

  // Sample guest data
  const guests = [
    { id: "1", avatar: require("../assets/images/avatar1.jpg") },
    { id: "2", avatar: require("../assets/images/avatar2.jpg") },
    { id: "3", avatar: require("../assets/images/avatar3.jpg") },
    { id: "4", avatar: require("../assets/images/avatar4.jpg") },
    { id: "5", avatar: require("../assets/images/avatar5.jpg") },
  ];

  // Ticket types
  const ticketTypes = [
    { id: "1", name: "General Admission" },
    { id: "2", name: "VIP" },
    { id: "3", name: "Family" },
    { id: "4", name: "Group" },
    { id: "5", name: "Earlybird" },
    { id: "6", name: "Free" },
  ];

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const toggleTicketType = (ticketName: string) => {
    if (selectedTickets.includes(ticketName)) {
      setSelectedTickets(selectedTickets.filter((name) => name !== ticketName));
    } else {
      setSelectedTickets([...selectedTickets, ticketName]);
    }
  };

  const handleUploadImage = () => {
    // This would typically open image picker
    Alert.alert("Upload Image", "This would open your device's image picker");
  };

  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      Alert.alert("Missing Information", "Please enter an event name");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Missing Information", "Please enter a location");
      return;
    }

    // Create event object
    const newEvent = {
      id: Date.now().toString(),
      title: eventName.toUpperCase(),
      date: date.getDate().toString(),
      month: formatDate(date).split(" ")[0],
      time: formatTime(time),
      location: location,
      ticketTypes: selectedTickets,
      image: image || require("../assets/images/default_event.jpg"),
      saved: false,
      liked: false,
      comments: [],
    };

    // In a real app, this would be sent to an API
    console.log("Event created:", newEvent);

    // Navigate back or to home/organizer page
    Alert.alert(
      "Success!",
      "Your event has been created and will appear on trending and home pages.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#3F0F00", "#000000"]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Event Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={eventName}
              onChangeText={setEventName}
            />
          </View>

          {/* Date and Time */}
          <View style={styles.row}>
            <View style={[styles.section, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
                <Ionicons name="calendar-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={[styles.section, { flex: 1 }]}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
                <Ionicons name="time-outline" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Event summary text */}
          <Text style={styles.eventSummary}>
            This event will take place on {formatDate(date)} at{" "}
            {formatTime(time)}
          </Text>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Add Guest */}
          <View style={styles.section}>
            <Text style={styles.label}>Add Guest</Text>
            <View style={styles.addGuestRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                placeholder=""
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Guest Avatars */}
            <View style={styles.guestAvatars}>
              {guests.map((guest) => (
                <Image
                  key={guest.id}
                  source={guest.avatar}
                  style={styles.avatar}
                />
              ))}
            </View>
          </View>

          {/* Ticket Types */}
          <View style={styles.section}>
            <Text style={styles.label}>Ticket Types</Text>
            <View style={styles.ticketGrid}>
              {ticketTypes.slice(0, 6).map((ticket) => (
                <TouchableOpacity
                  key={ticket.id}
                  style={[
                    styles.ticketOption,
                    selectedTickets.includes(ticket.name) &&
                      styles.ticketSelected,
                  ]}
                  onPress={() => toggleTicketType(ticket.name)}
                >
                  <View style={styles.radioCircle}>
                    {selectedTickets.includes(ticket.name) && (
                      <View style={styles.radioFilled} />
                    )}
                  </View>
                  <Text style={styles.ticketText}>{ticket.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.moreTicketsButton}>
              <Text style={styles.moreTicketsText}>More +</Text>
            </TouchableOpacity>
          </View>

          {/* Upload Image */}
          <View style={styles.section}>
            <Text style={styles.label}>Upload Image</Text>
            <TouchableOpacity
              style={styles.uploadContainer}
              onPress={handleUploadImage}
            >
              <Text style={styles.uploadText}>Upload Here</Text>
            </TouchableOpacity>
          </View>

          {/* Create Event Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateEvent}
          >
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>

          {/* Bottom Spacer */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    height: 48,
    padding: 12,
    color: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTimeText: {
    color: "white",
  },
  eventSummary: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 20,
  },
  addGuestRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  guestAvatars: {
    flexDirection: "row",
    marginTop: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -10,
    borderWidth: 2,
    borderColor: "#1E1E1E",
  },
  ticketGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  ticketOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    width: "30%",
  },
  ticketSelected: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  radioCircle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  radioFilled: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  ticketText: {
    color: "white",
    fontSize: 12,
  },
  moreTicketsButton: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  moreTicketsText: {
    color: "#FFD700",
    fontSize: 12,
  },
  uploadContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: "rgba(255,255,255,0.5)",
  },
  createButton: {
    backgroundColor: "#FF7043",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
