import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useApp } from "@/contexts/AppContext";
import { MODES } from "@/app/(tabs)/index";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  "Analyzing image quality...",
  "Running AI model...",
  "Enhancing details...",
  "Upscaling resolution...",
  "Finalizing result...",
];

export default function ProcessingScreen() {
  const { imageUri, modeId, modeName } = useLocalSearchParams<{
    imageUri: string; modeId: string; modeName: string;
  }>();
  const { addEnhancement, useCredit } = useApp();
  const colors = useColors();
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const startTime  = useRef(Date.now());

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const totalDuration = 3200 + Math.random() * 1400;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += 80;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(pct);
      setStepIdx(Math.min(STEPS.length - 1, Math.floor((pct / 100) * STEPS.length)));
      if (pct >= 100) {
        clearInterval(timer);
        const processingTime = (Date.now() - startTime.current) / 1000;
        const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];
        useCredit();
        addEnhancement({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          originalUri: imageUri,
          enhancedUri: imageUri,
          mode: modeId,
          modeName,
          modeGradient: mode.gradient,
          createdAt: new Date().toISOString(),
          processingTime,
        });
        setTimeout(() => {
          router.replace({ pathname: "/compare", params: { beforeUri: imageUri, afterUri: imageUri, modeName } });
        }, 400);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        {/* Spinner */}
        <Animated.View style={[styles.ringWrap, { transform: [{ scale: pulseAnim }] }]}>
          <Animated.View style={[styles.outerRing, { transform: [{ rotate: spin }] }]}>
            <LinearGradient colors={[...mode.gradient, "transparent"]} style={styles.ringFill} />
          </Animated.View>
          <LinearGradient
            colors={[mode.gradient[0] + "22", mode.gradient[1] + "11"]}
            style={styles.centerCircle}
          >
            <Text style={[styles.pctNum, { color: colors.text }]}>{progress}</Text>
            <Text style={[styles.pctSym, { color: colors.mutedForeground }]}>%</Text>
          </LinearGradient>
        </Animated.View>

        <View style={[styles.modeChip, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.modeChipTxt, { color: colors.primary }]}>{modeName}</Text>
        </View>

        <Text style={[styles.stepTxt, { color: colors.text }]}>{STEPS[stepIdx]}</Text>
        <Text style={[styles.aiTxt, { color: colors.mutedForeground }]}>AI is enhancing your photo</Text>

        {/* Progress bar */}
        <View style={[styles.bar, { backgroundColor: colors.border }]}>
          <View style={[styles.barFill, { width: `${progress}%` as any, overflow: "hidden" }]}>
            <LinearGradient colors={mode.gradient} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
          </View>
        </View>
      </View>

      <Text style={[styles.tip, { color: colors.mutedForeground }]}>
        Premium members get 3× faster processing
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, alignItems: "center", justifyContent: "center" },
  center:      { alignItems: "center", gap: 18 },
  ringWrap:    { width: 190, height: 190, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  outerRing:   { position: "absolute", width: 190, height: 190, borderRadius: 95, overflow: "hidden" },
  ringFill:    { width: "100%", height: "100%", borderRadius: 95 },
  centerCircle:{ width: 130, height: 130, borderRadius: 65, alignItems: "center", justifyContent: "center", flexDirection: "row", alignItems: "baseline" as any, borderWidth: 12, borderColor: "#fff" },
  pctNum:      { fontSize: 38, fontWeight: "800" },
  pctSym:      { fontSize: 16, fontWeight: "600" },
  modeChip:    { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  modeChipTxt: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
  stepTxt:     { fontSize: 16, fontWeight: "600", textAlign: "center" },
  aiTxt:       { fontSize: 13 },
  bar:         { width: 240, height: 6, borderRadius: 3, overflow: "hidden" },
  barFill:     { height: "100%", borderRadius: 3 },
  tip:         { position: "absolute", bottom: 60, fontSize: 13, paddingHorizontal: 40, textAlign: "center" },
});
