import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { auth, firestore } from "./firebaseConfig";
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useTheme } from "./ThemeContext";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function TaskListScreen({ navigation }) {
  const { theme } = useTheme();
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [category, setCategory] = useState("General");
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const tasksRef = collection(firestore, "tasks");
      const q = query(tasksRef, where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
      });
      return unsubscribe;
    }
  }, [user]);

  const handleAddTask = async () => {
    if (task.trim()) {
      await addDoc(collection(firestore, "tasks"), {
        task,
        priority,
        category,
        userId: user.uid,
      });
      setTask("");
      setPriority("Normal");
      setCategory("General");
      setModalVisible(false);
    }
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(firestore, "tasks", id));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Work":
        return "work";
      case "Personal":
        return "person";
      case "General":
        return "star";
      default:
        return "star";
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#333" : "#F5F5F5" },
      ]}
    >
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskContainer,
              { backgroundColor: theme === "dark" ? "#444" : "#fff" },
            ]}
          >
            <Icon
              name={getCategoryIcon(item.category)}
              size={24}
              color={theme === "dark" ? "#FFF" : "#000"}
            />
            <Text
              style={[
                styles.taskText,
                { color: theme === "dark" ? "#FFF" : "#000" },
              ]}
            >
              {item.task} -{" "}
              <Text style={styles.priorityText(item.priority)}>
                {item.priority}
              </Text>{" "}
              - {item.category}
            </Text>
            <TouchableOpacity
              onPress={() => handleDeleteTask(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Add Task"
        onPress={() => setModalVisible(true)}
        color="#28A745"
      />

      {/* Modal for Adding Task */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollView}>
              <TextInput
                style={styles.input}
                placeholder="Task Description"
                placeholderTextColor={theme === "dark" ? "#888" : "#aaa"}
                value={task}
                onChangeText={setTask}
              />
              <Text
                style={[
                  styles.label,
                  { color: theme === "dark" ? "#FFF" : "#000" },
                ]}
              >
                Priority:
              </Text>
              <Picker
                selectedValue={priority}
                style={[
                  styles.picker,
                  { backgroundColor: theme === "dark" ? "#444" : "#fff" },
                ]}
                onValueChange={(itemValue) => setPriority(itemValue)}
              >
                <Picker.Item label="Normal" value="Normal" />
                <Picker.Item label="High" value="High" />
                <Picker.Item label="Low" value="Low" />
              </Picker>
              <Text
                style={[
                  styles.label,
                  { color: theme === "dark" ? "#FFF" : "#000" },
                ]}
              >
                Category:
              </Text>
              <Picker
                selectedValue={category}
                style={[
                  styles.picker,
                  { backgroundColor: theme === "dark" ? "#444" : "#fff" },
                ]}
                onValueChange={(itemValue) => setCategory(itemValue)}
              >
                <Picker.Item label="General" value="General" />
                <Picker.Item label="Work" value="Work" />
                <Picker.Item label="Personal" value="Personal" />
              </Picker>
              <View style={styles.buttonContainer}>
                <Button
                  title="Add Task"
                  onPress={handleAddTask}
                  color="#28A745"
                />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  color="#DC3545"
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
    marginBottom: 8,
    padding: 10,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  priorityText: (priority) => ({
    color:
      priority === "High" ? "#FF6347" : priority === "Low" ? "#32CD32" : "#000",
    fontWeight: "bold",
  }),
  deleteButton: {
    backgroundColor: "#DC3545",
    padding: 8,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalScrollView: {
    paddingBottom: 20,
  },
  picker: {
    height: 50,
    marginVertical: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
