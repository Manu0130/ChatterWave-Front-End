# Chatter Wave - Mobile App (Frontend)

This is the official frontend for the Chatter Wave chat application, built using React Native and Expo. It provides a clean, modern, and cross-platform user experience for seamless communication.

**Note:** This application requires the [Chatter Wave Backend Server](https://github.com/your-username/chatter-wave-backend-repo) to be running and accessible.

## Features

* [cite_start]User Sign-Up and Login functionality. [cite: 38]
* Real-time one-to-one messaging.
* [cite_start]Ability to select and send images from the device gallery. [cite: 78, 79]
* A user-friendly interface with custom fonts and design elements.

## Technology Stack

* [cite_start]**Framework:** React Native [cite: 11]
* [cite_start]**Platform:** Expo [cite: 11]
* **Libraries Used:**
    * [cite_start]`@expo/vector-icons` [cite: 44]
    * [cite_start]`expo-font` [cite: 44]
    * [cite_start]`expo-splash-screen` [cite: 44]
    * [cite_start]`expo-linear-gradient` [cite: 68, 69]
    * [cite_start]`expo-image` [cite: 72, 73]
    * [cite_start]`expo-image-picker` [cite: 78, 79]

## Getting Started

Follow these instructions to get the mobile application running on your local machine for development and testing.

### Prerequisites

* Node.js (LTS version)
* Expo Go application on your Android/iOS device or a configured simulator.

### Installation and Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/chatter-wave-frontend-repo.git](https://github.com/your-username/chatter-wave-frontend-repo.git)
    cd chatter-wave-frontend-repo
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```
    or if you use Yarn:
    ```sh
    yarn install
    ```

3.  **Configure the Backend URL:**
    * The backend server must be running and accessible via a URL (e.g., an Ngrok URL).
    * Locate the API configuration file within the project source code (e.g., `config/api.js` or a similar file).
    * Update the `BASE_URL` or equivalent constant to the URL of your running backend server.

4.  **Run the application:**
    ```sh
    npx expo start
    ```

5.  **Launch the App:**
    * Scan the QR code generated in the terminal using the Expo Go app on your mobile phone.
    * Alternatively, you can run the app on a connected simulator by selecting the appropriate option in the terminal.

## Project Structure

* [cite_start]`assets/`: Contains static assets like fonts, and images. [cite: 45]
* `components/`: Reusable UI components used throughout the application.
* `screens/`: Main screen components of the application (e.g., LoginScreen, ChatScreen).
* `App.js`: The main entry point of the application.

## License

This project is licensed under the MIT License.
