import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientButton } from "@/components/GradientButton";
import { useApp } from "@/contexts/AppContext";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: "zap",
    iconGradient: ["#7B61FF", "#B061FF"] as [string, string],
    title: "AI-Powered\nEnhancement",
    subtitle: "Transform blurry, dark, or low-quality photos into stunning HD images with cutting-edge AI",
    bgGradient: ["#0D0520", "#080810"] as [string, string],
  },
  {
    id: "2",
    icon: "sliders",
    iconGradient: ["#00D2FF", "#3A7BD5"] as [string, string],
    title: "10+ Enhancement\nModes",
    subtitle: "HD Enhance, Face Restore, Old Photo Repair, Remove Blur, Low Light Fix, and much more",
    bgGradient: ["#001524", "#080810"] as [string, string],
  },
  {
    id: "3",
    icon: "eye",
    iconGradient: ["#43E97B", "#38F9D7"] as [string, string],
    title: "Before & After\nComparison",
    subtitle: "Drag the slider to compare original and enhanced photos side by side in real time",
    bgGradient: ["#001E10", "#080810"] as [string, string],
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { setOnboarded } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const goNext = () => {
    Haptics.selectionAsync();
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrentIndex(next);
    } else {
      finish();
    }
  };

  const finish = async () => {
    await setOnboarded();
    router.replace("/(tabs)");
  };

  const slide = SLIDES[currentIndex];

  return (
    <LinearGradient colors={slide.bgGradient} style={styles.container}>
      <Pressable
        onPress={finish}
        style={[styles.skipBtn, { top: topPad + 12 }]}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <LinearGradient
              colors={item.iconGradient}
              style={styles.iconWrap}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name={item.icon as any} size={56} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <GradientButton
          label={currentIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
          onPress={goNext}
          size="lg"
          style={{ width: width - 64 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: { color: "#8888BB", fontSize: 15 },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    paddingTop: 80,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 20,
  },
  subtitle: {
    color: "#8888BB",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 24,
  },
  dots: { flexDirection: "row", gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2a2a4a",
  },
  dotActive: {
    width: 24,
    backgroundColor: "#7B61FF",
  },
});
