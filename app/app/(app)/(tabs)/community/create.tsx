import { View, TextInput, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SteppeTitle } from "@/src/components/SteppeTitle";
import { SteppeText } from "@/src/components/SteppeText";
import { CREATE_COMMUNITY_MUTATION, GET_COMMUNITIES_QUERY } from "@/src/slices/community/community.gql";
import { Colors } from "@/constants/Colors";

export default function CreateCommunityScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [createCommunity, { loading }] = useMutation(CREATE_COMMUNITY_MUTATION, {
    refetchQueries: [{ query: GET_COMMUNITIES_QUERY }],
  });

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await createCommunity({
        variables: {
          name: name.trim(),
          description: description.trim() || null,
          isPublic,
        },
      });
      router.back();
    } catch (error) {
      console.error("Failed to create community:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.yellow }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <SteppeTitle style={{ fontSize: 28, marginBottom: 24 }}>
          Create Community
        </SteppeTitle>

        <View style={styles.field}>
          <SteppeText style={styles.label}>Name *</SteppeText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Community name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <SteppeText style={styles.label}>Description</SteppeText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this community about?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.switchRow}>
          <SteppeText style={styles.label}>Public Community</SteppeText>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: "#CCC", true: Colors.green }}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={!name.trim() || loading}
        >
          <SteppeText style={styles.buttonText}>
            {loading ? "Creating..." : "Create Community"}
          </SteppeText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    paddingTop: 60,
  },
  content: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.green,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});