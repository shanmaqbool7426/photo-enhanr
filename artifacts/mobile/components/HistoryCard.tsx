import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Enhancement } from "@/contexts/AppContext";

interface Props {
  item: Enhancement;
  onPress: () => void;
  onDelete: () => void;
}

export function HistoryCard({ item, onPress, onDelete }: Props) {
  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={styles.imgWrap}>
        <Image source={{ uri: item.originalUri }} style={styles.imgBefore} resizeMode="cover" />
        <Image source={{ uri: item.enhancedUri }} style={styles.imgAfter} resizeMode="cover" />
        <View style={styles.divider} />
      </View>
      <View style={styles.info}>
        <View style={styles.modePill}>
          <LinearGradient
            colors={item.modeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modeGrad}
          >
            <Text style={styles.modeName}>{item.modeName}</Text>
          </LinearGradient>
        </View>
        <Text style={styles.dateText}>{dateStr} · {timeStr}</Text>
        <Text style={styles.timeText}>{item.processingTime.toFixed(1)}s processing</Text>
      </View>
      <Pressable
        onPress={onDelete}
        hitSlop={10}
        style={({ pressed }) => [styles.deleteBtn, { opacity: pressed ? 0.6 : 1 }]}
      >
        <Feather name="trash-2" size={16} color="#ef4444" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10101E",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1E1E3A",
    overflow: "hidden",
    gap: 12,
    padding: 12,
  },
  imgWrap: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
  },
  imgBefore: {
    width: 38,
    height: 76,
  },
  imgAfter: {
    width: 38,
    height: 76,
  },
  divider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 37,
    width: 2,
    backgroundColor: "#fff",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  modePill: {
    alignSelf: "flex-start",
    borderRadius: 20,
    overflow: "hidden",
  },
  modeGrad: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  modeName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  dateText: {
    color: "#8888BB",
    fontSize: 12,
  },
  timeText: {
    color: "#5a5a8a",
    fontSize: 11,
  },
  deleteBtn: {
    padding: 8,
  },
});
