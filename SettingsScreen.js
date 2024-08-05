// SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  Alert,
  useColorScheme,
} from "react-native";
import { getAuth, updatePassword } from "firebase/auth";
import { useTheme } from "./ThemeContext";

const auth = getAuth();

export default function SettingsScreen() {
  const [newPassword, setNewPassword] = useState("");
  const { theme, setTheme } = useTheme();

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
    const user = auth.currentUser;
    updatePassword(user, newPassword)
      .then(() => {
        Alert.alert("Success", "Password updated successfully");
        setNewPassword("");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleToggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.setting}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
        />
        <Button title="Change Password" onPress={handleChangePassword} />
      </View>
      <View style={styles.setting}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={theme === "dark"} onValueChange={handleToggleDarkMode} />
      </View>
      <Button title="Sign Out" onPress={() => auth.signOut()} color="#DC3545" />
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme === "dark" ? "#333" : "#F5F5F5",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 24,
      textAlign: "center",
      color: theme === "dark" ? "#fff" : "#000",
    },
    setting: {
      marginBottom: 24,
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
      color: theme === "dark" ? "#fff" : "#000",
    },
    input: {
      height: 40,
      borderColor: theme === "dark" ? "#555" : "#ddd",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 16,
      paddingHorizontal: 12,
      backgroundColor: theme === "dark" ? "#444" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
    },
  });
