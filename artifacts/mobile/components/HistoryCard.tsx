import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Enhancement } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

interface Props {
  item: Enhancement;
  onPress: () => void;
  onDelete: () => void;
}

export function HistoryCard({ item, onPress, onDelete }: Props) {
  const colors = useColors();
  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={styles.imgWrap}>
        <Image source={{ uri: item.originalUri }} style={styles.imgBefore} resizeMode="cover" />
        <Image source={{ uri: item.enhancedUri }} style={styles.imgAfter} resizeMode="cover" />
        <View style={styles.imgDivider} />
        <View style={[styles.imgLabel, { left: 4 }]}>
          <Text style={styles.imgLabelTxt}>Before</Text>
        </View>
        <View style={[styles.imgLabel, { right: 4 }]}>
          <Text style={styles.imgLabelTxt}>After</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.modePill}>
          <LinearGradient
            colors={item.modeGradient}
            style={styles.modeGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.modeName}>{item.modeName}</Text>
          </LinearGradient>
        </View>
        <Text style={[styles.dateText, { color: colors.text }]}>{dateStr} · {timeStr}</Text>
        <Text style={[styles.timeText, { color: colors.mutedForeground }]}>
          {item.processingTime.toFixed(1)}s · Tap to view
        </Text>
      </View>

      <Pressable
        onPress={onDelete}
        hitSlop={12}
        style={({ pressed }) => [
          styles.deleteBtn,
          { backgroundColor: pressed ? "#FEE2E2" : colors.secondary },
        ]}
      >
        <Feather name="trash-2" size={15} color="#EF4444" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  imgWrap: {
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "row",
    position: "relative",
  },
  imgBefore: { width: 40, height: 80 },
  imgAfter:  { width: 40, height: 80 },
  imgDivider:{ position: "absolute", top: 0, bottom: 0, left: 39, width: 2, backgroundColor: "#fff" },
  imgLabel:  { position: "absolute", bottom: 4, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  imgLabelTxt:{ color: "#fff", fontSize: 9, fontWeight: "700" },
  info:      { flex: 1, gap: 4 },
  modePill:  { alignSelf: "flex-start", borderRadius: 20, overflow: "hidden" },
  modeGrad:  { paddingHorizontal: 10, paddingVertical: 4 },
  modeName:  { color: "#fff", fontSize: 12, fontWeight: "700" },
  dateText:  { fontSize: 12, fontWeight: "500" },
  timeText:  { fontSize: 11 },
  deleteBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
