# Travel Buddy App

## 🗺️ Project Overview

**Travel Buddy App** is a mobile application designed to help users easily discover nearby tourist attractions and restaurants. It provides a map-based visual interface centered on the user's current location, with features for filtering places and managing a list of favorites.

A primary focus of this project has been **refactoring**, transforming an initially complex codebase into a modular, maintainable, and scalable architecture.

## ✨ Key Features (Post-Refactoring)

- **Map-Based Discovery**: Displays attractions and restaurants as markers on an interactive map centered on the user's current location.
- **Dynamic Radius**: Shows a visual circle on the map indicating the explorable radius, which changes based on the selected mode of travel (car/walking).
- **Real-Time Filtering**: Allows users to selectively view attractions, restaurants, or both.
- **Custom Markers & Callouts**: Differentiates place types with distinct marker colors and provides detailed information through custom callouts upon marker selection.
- **Modularized Core Logic**:
  - **Custom Hooks**: Reusable logic, such as location tracking (`useLocation`) and favorites management (`useFavorites`), has been extracted into custom hooks to enhance reusability.
  - **Componentization**: UI elements like map markers, info panels, and filter buttons have been broken down into individual components, reducing complexity and improving readability.
  - **Centralized Type-Safety**: TypeScript interfaces and types are centralized in `types/index.ts` to ensure data consistency across the application.

## 🛠️ Tech Stack

- **Cross-Platform**: React Native, Expo
- **Language**: TypeScript
- **State Management**: React Hooks (`useState`, `useMemo`)
- **Mapping**: `react-native-maps`
- **Location**: `expo-location`
- **Local Storage**: `@react-native-async-storage/async-storage` (for Favorites feature)
- **Task Management**: `task-master-ai` (for project management and automation)

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/travel-buddy-app.git
    cd travel-buddy-app/TravelBuddyApp
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the application**:
    ```bash
    npm run start
    ```
    - Scan the QR code with the Expo Go app or run on a simulator (iOS/Android) to view the app.

## Next Steps

- Implement User Authentication (e.g., social login)
- Integrate with a Backend Server (Firebase/Supabase or Node.js)
- Develop a Detailed Place Information Screen
- Add User Reviews and Ratings Functionality

---

This README effectively documents the project's current state and enhances its value as a portfolio piece.
