import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SteppeText } from "@/src/components/SteppeText";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";

interface CommunityCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  memberCount?: number;
  onPress: () => void;
}

export function CommunityCard({
  name,
  description,
  imageUrl,
  memberCount,
  onPress,
}: CommunityCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <AntDesign name="team" size={32} color={Colors.green} />
        </View>
      )}
      <View style={styles.content}>
        <SteppeText style={styles.name}>{name}</SteppeText>
        {description && (
          <SteppeText style={styles.description} numberOfLines={2}>
            {description}
          </SteppeText>
        )}
        <View style={styles.meta}>
          <AntDesign name="user" size={14} color="#666" />
          <SteppeText style={styles.metaText}>
            {memberCount ?? 0} members
          </SteppeText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  placeholder: {
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
});