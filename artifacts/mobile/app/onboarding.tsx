import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
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
    image: require("@/assets/images/onboard_1.png"),
    tag: "AI-Powered",
    title: "Transform Any\nPhoto Instantly",
    subtitle: "Restore blurry, dark, or damaged photos into stunning HD images using cutting-edge AI",
  },
  {
    id: "2",
    image: require("@/assets/images/onboard_2.png"),
    tag: "10+ Modes",
    title: "Choose Your\nEnhancement Style",
    subtitle: "HD Enhance, Face Restore, Old Photo Repair, Remove Blur, Low Light Fix, and much more",
  },
  {
    id: "3",
    image: require("@/assets/images/onboard_3.png"),
    tag: "Before & After",
    title: "See the\nDifference",
    subtitle: "Drag the slider to compare original and enhanced photos side by side in real time",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { setOnboarded } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const topPad = Platform.OS === "web" ? 0 : insets.top;

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

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <Pressable onPress={finish} style={styles.skipBtn}>
        <Text style={styles.skipTxt}>Skip</Text>
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
            <View style={styles.imageCard}>
              <Image source={item.image} style={styles.illustration} resizeMode="cover" />
              <View style={styles.tagPill}>
                <LinearGradient
                  colors={["#6C47FF", "#9B6BFF"]}
                  style={styles.tagGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.tagTxt}>{item.tag}</Text>
                </LinearGradient>
              </View>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex ? styles.dotActive : styles.dotInactive,
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
        {currentIndex < SLIDES.length - 1 && (
          <Pressable onPress={finish}>
            <Text style={styles.skipFooter}>Skip for now</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#F5F4FF" },
  skipBtn:     { position: "absolute", top: 56, right: 20, zIndex: 10, padding: 8 },
  skipTxt:     { color: "#7C7299", fontSize: 15, fontWeight: "500" },
  slide:       { alignItems: "center", paddingHorizontal: 24, paddingTop: 60 },
  imageCard:   { width: "100%", borderRadius: 28, overflow: "hidden", marginBottom: 32, position: "relative", shadowColor: "#6C47FF", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  illustration:{ width: "100%", height: 280, backgroundColor: "#EDE8FF" },
  tagPill:     { position: "absolute", top: 16, left: 16, borderRadius: 20, overflow: "hidden" },
  tagGrad:     { paddingHorizontal: 14, paddingVertical: 6 },
  tagTxt:      { color: "#fff", fontSize: 12, fontWeight: "700", letterSpacing: 0.5 },
  title:       { color: "#1A1025", fontSize: 30, fontWeight: "800", textAlign: "center", lineHeight: 36, marginBottom: 14 },
  subtitle:    { color: "#7C7299", fontSize: 15, textAlign: "center", lineHeight: 23, paddingHorizontal: 12 },
  footer:      { alignItems: "center", paddingHorizontal: 32, gap: 20 },
  dots:        { flexDirection: "row", gap: 8 },
  dot:         { height: 8, borderRadius: 4 },
  dotActive:   { width: 28, backgroundColor: "#6C47FF" },
  dotInactive: { width: 8, backgroundColor: "#C4B8F0" },
  skipFooter:  { color: "#7C7299", fontSize: 14 },
});
