import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Define interface for route params
interface RouteParams {
  eventTitle?: string;
  eventDate?: string;
  eventMonth?: string;
  eventTime?: string;
  eventLocation?: string;
  eventOrganizer?: string;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  saleEndDate?: string;
  quantity: number;
}

export default function TicketPurchaseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    eventTitle = "SUNRISE BREAKFAST PARTY",
    eventDate = "27",
    eventMonth = "Apr",
    eventTime = "6AM - 3PM EST",
    eventLocation = "Lot 56, Tropical Street, Bogue Heights Dr.",
    eventOrganizer = "Vibely Events",
  } = route.params as RouteParams;

  // State for promo code
  const [promoCode, setPromoCode] = useState("");

  // Available ticket types
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    {
      id: "early-bird",
      name: "Early Bird",
      price: 50.0,
      saleEndDate: "March 18, 2025",
      quantity: 0,
    },
    {
      id: "duo",
      name: "Duo",
      price: 110.0,
      quantity: 0,
    },
    {
      id: "group",
      name: "Group",
      price: 265.0,
      quantity: 0,
    },
  ]);

  // Function to increase ticket quantity
  const increaseQuantity = (ticketId: string) => {
    setTicketTypes(
      ticketTypes.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, quantity: ticket.quantity + 1 }
          : ticket
      )
    );
  };

  // Function to decrease ticket quantity
  const decreaseQuantity = (ticketId: string) => {
    setTicketTypes(
      ticketTypes.map((ticket) =>
        ticket.id === ticketId && ticket.quantity > 0
          ? { ...ticket, quantity: ticket.quantity - 1 }
          : ticket
      )
    );
  };

  // Calculate total amount
  const totalAmount = ticketTypes.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  // Handle checkout
  const handleCheckout = () => {
    // Implement checkout logic here
    navigation.navigate("PaymentConfirmation", {
      totalAmount,
      ticketTypes: ticketTypes.filter((ticket) => ticket.quantity > 0),
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1A0F0B" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0F0B" />
      <View style={{ flex: 1 }}>
        {/* Header - Static part */}
        <View style={{ position: "relative" }}>
          <Image
            source={require("../assets/images/event1.jpg")}
            style={{ width: "100%", height: 200 }}
            resizeMode="cover"
          />

          {/* Overlay with event title */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                paddingHorizontal: 16,
              }}
            >
              {eventTitle}
            </Text>
          </View>

          {/* Back button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 15,
              left: 15,
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 20,
              padding: 8,
            }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Event date and time */}
        <View
          style={{
            backgroundColor: "#2C1A10",
            padding: 12,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 14 }}>
            Sunday, {eventMonth} {eventDate}, 2025 - {eventTime}
          </Text>
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 80 }} // Add padding to avoid checkout button overlap
        >
          {/* Promo Code Section */}
          <View
            style={{
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Promo Code</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextInput
                style={{
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#FF5722",
                  color: "white",
                  width: 150,
                }}
                value={promoCode}
                onChangeText={setPromoCode}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  padding: 8,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#FF5722" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ticket Types */}
          {ticketTypes.map((ticket) => (
            <View
              key={ticket.id}
              style={{
                backgroundColor: "#FFFFFF",
                margin: 16,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "500" }}>
                  {ticket.name}
                  {ticket.id === "group" && " (5 Persons)"}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => decreaseQuantity(ticket.id)}
                    style={{
                      width: 30,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#DDD",
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>-</Text>
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 10 }}>
                    {ticket.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => increaseQuantity(ticket.id)}
                    style={{
                      width: 30,
                      height: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#FF5722",
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontSize: 18, color: "white" }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: 16,
                  paddingBottom: 12,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "700" }}>
                  ${ticket.price.toFixed(2)}
                </Text>
                {ticket.saleEndDate && (
                  <Text style={{ fontSize: 12, color: "#666" }}>
                    Sales end on {ticket.saleEndDate}
                  </Text>
                )}
                <Text style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  No Refund! All Sales Are Final.
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Checkout Button with black background */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#000",
            paddingTop: 10,
            paddingBottom: 20,
            borderTopWidth: 1,
            borderTopColor: "#333",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#FF773E",
              marginHorizontal: 16,
              borderRadius: 25,
              paddingVertical: 15,
              alignItems: "center",
            }}
            onPress={handleCheckout}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
              Check Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
