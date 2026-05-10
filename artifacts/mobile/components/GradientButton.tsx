import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  gradient?: [string, string];
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function GradientButton({
  label,
  onPress,
  gradient = ["#7B61FF", "#B061FF"],
  style,
  loading = false,
  disabled = false,
  size = "md",
}: Props) {
  const height = size === "lg" ? 56 : size === "sm" ? 40 : 48;
  const fontSize = size === "lg" ? 17 : size === "sm" ? 14 : 15;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }, style]}
    >
      <LinearGradient
        colors={disabled ? ["#3a3a5a", "#3a3a5a"] : gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.btn, { height, borderRadius: height / 2 }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.label, { fontSize }]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  label: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
