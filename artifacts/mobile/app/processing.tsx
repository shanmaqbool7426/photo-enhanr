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

const STEPS = [
  "Analyzing image quality...",
  "Running AI model...",
  "Enhancing details...",
  "Upscaling resolution...",
  "Finalizing result...",
];

export default function ProcessingScreen() {
  const { imageUri, modeId, modeName } = useLocalSearchParams<{
    imageUri: string;
    modeId: string;
    modeName: string;
  }>();
  const { addEnhancement, useCredit } = useApp();
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const startTime = useRef(Date.now());

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const totalDuration = 3500 + Math.random() * 1500;
    const interval = 80;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
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
          modeName: modeName,
          modeGradient: mode.gradient,
          createdAt: new Date().toISOString(),
          processingTime,
        });

        setTimeout(() => {
          router.replace({
            pathname: "/compare",
            params: { beforeUri: imageUri, afterUri: imageUri, modeName },
          });
        }, 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const mode = MODES.find((m) => m.id === modeId) ?? MODES[0];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0D0520", "#080810"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.center}>
        <Animated.View style={[styles.ringWrap, { transform: [{ scale: pulseAnim }] }]}>
          <Animated.View style={[styles.outerRing, { transform: [{ rotate: spin }] }]}>
            <LinearGradient
              colors={[mode.gradient[0], mode.gradient[1], "transparent"]}
              style={styles.ringGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.innerRing,
              { transform: [{ rotate: Animated.multiply(rotateAnim, new Animated.Value(-1)).interpolate({ inputRange: [-1, 0], outputRange: ["-360deg", "0deg"] }) }] },
            ]}
          >
            <LinearGradient
              colors={["#00D2FF", "#7B61FF", "transparent"]}
              style={styles.ringGradInner}
            />
          </Animated.View>

          <LinearGradient
            colors={[mode.gradient[0] + "33", mode.gradient[1] + "11"]}
            style={styles.centerCircle}
          >
            <Text style={styles.progressNum}>{progress}</Text>
            <Text style={styles.progressPct}>%</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.modeLabel}>{modeName}</Text>
        <Text style={styles.statusText}>
          {STEPS[stepIdx]}
        </Text>
        <Text style={styles.aiText}>AI is enhancing your photo</Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` as any }]}>
            <LinearGradient
              colors={mode.gradient}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>

        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.08],
                    outputRange: [0.3 + i * 0.2, 0.5 + i * 0.3],
                  }),
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.tipWrap}>
        <Text style={styles.tipText}>
          Tip: Premium members get 3x faster processing
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080810", alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center", gap: 20 },
  ringWrap: { position: "relative", width: 200, height: 200, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  outerRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  ringGrad: { width: "100%", height: "100%", borderRadius: 100 },
  innerRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
  },
  ringGradInner: { width: "100%", height: "100%", borderRadius: 80 },
  centerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "baseline" as any,
  },
  progressNum: { color: "#fff", fontSize: 40, fontWeight: "800" },
  progressPct: { color: "#8888BB", fontSize: 18, fontWeight: "600" },
  modeLabel: { color: "#7B61FF", fontSize: 13, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  statusText: { color: "#fff", fontSize: 17, fontWeight: "600", textAlign: "center" },
  aiText: { color: "#8888BB", fontSize: 14 },
  progressBar: {
    width: 240,
    height: 4,
    backgroundColor: "#1E1E3A",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  dotsRow: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#7B61FF" },
  tipWrap: {
    position: "absolute",
    bottom: 60,
    paddingHorizontal: 32,
  },
  tipText: { color: "#3a3a5a", fontSize: 13, textAlign: "center" },
});
