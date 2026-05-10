import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface Mode {
  id: string;
  name: string;
  desc: string;
  icon: string;
  gradient: [string, string];
  isPremium?: boolean;
}

interface Props {
  mode: Mode;
  selected: boolean;
  onPress: () => void;
}

export function ModeCard({ mode, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View
        style={[
          styles.card,
          selected && styles.cardSelected,
        ]}
      >
        {selected && (
          <View style={styles.checkBadge}>
            <Feather name="check" size={10} color="#fff" />
          </View>
        )}
        <LinearGradient
          colors={mode.gradient}
          style={styles.iconCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name={mode.icon as any} size={20} color="#fff" />
        </LinearGradient>
        <Text style={styles.name} numberOfLines={1}>
          {mode.name}
        </Text>
        <Text style={styles.desc} numberOfLines={1}>
          {mode.desc}
        </Text>
        {mode.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    margin: 6,
  },
  card: {
    backgroundColor: "#10101E",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#1E1E3A",
    position: "relative",
  },
  cardSelected: {
    borderColor: "#7B61FF",
    backgroundColor: "#1A1535",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  desc: {
    color: "#8888BB",
    fontSize: 11,
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#7B61FF",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#F6D365",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  premiumText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
