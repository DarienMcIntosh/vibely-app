import { config } from "dotenv";
config();

export default {
  expo: {
    name: "YourAppName",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    },
    plugins: [],
  },
};
