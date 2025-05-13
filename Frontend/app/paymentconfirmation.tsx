import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Define interface for route params
interface RouteParams {
  totalAmount: number;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export default function PaymentConfirmationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { totalAmount, ticketTypes } = route.params as RouteParams;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1A0F0B" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0F0B" />
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#333",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Payment Confirmation
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View
          style={{
            backgroundColor: "#28170F",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Order Summary
          </Text>

          {/* Ticket Details */}
          {ticketTypes.map((ticket) => (
            <View
              key={ticket.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 15,
                paddingBottom: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#444",
              }}
            >
              <View>
                <Text style={{ color: "white", fontSize: 16 }}>
                  {ticket.name}
                </Text>
                <Text style={{ color: "#CCC", fontSize: 14 }}>
                  Qty: {ticket.quantity}
                </Text>
              </View>
              <Text style={{ color: "white", fontSize: 16 }}>
                ${(ticket.price * ticket.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Total */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Total
            </Text>
            <Text
              style={{ color: "#FF5722", fontSize: 18, fontWeight: "bold" }}
            >
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View
          style={{
            backgroundColor: "#28170F",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 15,
            }}
          >
            Payment Method
          </Text>

          {/* Credit Card Option */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#444",
            }}
          >
            <Ionicons name="card-outline" size={24} color="#FF5722" />
            <Text style={{ color: "white", marginLeft: 10, fontSize: 16 }}>
              Credit/Debit Card
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#888"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          {/* PayPal Option */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <Ionicons name="logo-paypal" size={24} color="#FF5722" />
            <Text style={{ color: "white", marginLeft: 10, fontSize: 16 }}>
              PayPal
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#888"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Payment Button */}
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#FF5722",
            borderRadius: 25,
            paddingVertical: 15,
            alignItems: "center",
          }}
          onPress={() => {
            // Handle payment confirmation
            navigation.navigate("Home");
          }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
            Confirm Payment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
