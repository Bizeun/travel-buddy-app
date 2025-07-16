const dotenv = require('dotenv');
const path = require('path'); 

const envPath = path.resolve(__dirname, '../.env');

try {
  dotenv.config({ path: envPath});
  console.log(`✅ .env file loaded from: ${envPath}`);
  console.log(`API Key variable is set: ${process.env.EXPO_PUBLIC_GOOGLE_API_KEY ? 'Yes, it exists!' : 'No, it is missing or undefined!'}`);
  console.log(`API Key found: ${process.env.EXPO_PUBLIC_GOOGLE_API_KEY ? 'Yes' : 'No'}`);
} catch (e) {
  console.warn('⚠️ Could not load .env file:', e);
}


module.exports = {
  expo: {
    name: "TravelBuddyApp",
    slug: "TravelBuddyApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "travelbuddyapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.shh.travelbuddy",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "We need your location to show you the map and find places around you."
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
    ],
    experiments: {
      "typedRoutes": true
    },
    extra: {
      googleApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      
    }
  }
};
