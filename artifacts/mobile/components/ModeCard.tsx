import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import MODE_IMAGES from "@/constants/modeImages";

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
  const image = MODE_IMAGES[mode.id];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={[styles.card, selected && styles.cardSelected]}>
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={mode.gradient}
            style={styles.imageFallback}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name={mode.icon as any} size={32} color="#fff" />
          </LinearGradient>
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {mode.name}
          </Text>
          <Text style={styles.desc} numberOfLines={1}>
            {mode.desc}
          </Text>
        </View>

        {selected && (
          <View style={styles.checkBadge}>
            <Feather name="check" size={11} color="#fff" />
          </View>
        )}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#EDE8FF",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSelected: {
    borderColor: "#6C47FF",
    shadowOpacity: 0.2,
  },
  image: {
    width: "100%",
    height: 100,
  },
  imageFallback: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: 10,
  },
  name: {
    color: "#1A1025",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  desc: {
    color: "#7C7299",
    fontSize: 11,
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#6C47FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FCD34D",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  premiumText: {
    color: "#7C2D00",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
