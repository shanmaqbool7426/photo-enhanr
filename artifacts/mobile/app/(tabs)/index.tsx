import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, useRootNavigationState } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";
import { ModeCard, Mode } from "@/components/ModeCard";
import { HistoryCard } from "@/components/HistoryCard";

export const MODES: Mode[] = [
  { id: "hd", name: "HD Enhance", desc: "Ultra sharp quality", icon: "zap", gradient: ["#7B61FF", "#B061FF"] },
  { id: "face", name: "Face Enhance", desc: "Perfect portraits", icon: "smile", gradient: ["#FF6B6B", "#FF8E8E"] },
  { id: "restore", name: "Old Photo", desc: "Restore memories", icon: "clock", gradient: ["#F6D365", "#FDA085"] },
  { id: "blur", name: "Remove Blur", desc: "Crystal clear", icon: "eye", gradient: ["#00D2FF", "#3A7BD5"] },
  { id: "lowlight", name: "Low Light", desc: "Brighten dark shots", icon: "sun", gradient: ["#FDDB92", "#D1FDFF"] },
  { id: "color", name: "Color Fix", desc: "Perfect colors", icon: "sliders", gradient: ["#43E97B", "#38F9D7"] },
  { id: "2x", name: "Upscale 2x", desc: "Double resolution", icon: "maximize", gradient: ["#4FACFE", "#00F2FE"] },
  { id: "4x", name: "Upscale 4x", desc: "4× resolution", icon: "maximize-2", gradient: ["#667EEA", "#764BA2"], isPremium: true },
  { id: "skin", name: "Skin Smooth", desc: "Flawless skin", icon: "user", gradient: ["#F093FB", "#F5576C"] },
  { id: "anime", name: "Anime Style", desc: "Anime art filter", icon: "star", gradient: ["#FF9A9E", "#FECFEF"], isPremium: true },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user, history, onboarded, removeEnhancement } = useApp();
  const nav = useRootNavigationState();

  useEffect(() => {
    if (!nav?.key) return;
    if (!onboarded) {
      router.replace("/onboarding");
    }
  }, [nav?.key, onboarded]);

  const recentHistory = history.slice(0, 3);

  const handleEnhance = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/upload");
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#1a0a2e", "#080810"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good day</Text>
            <Text style={styles.appName}>Enhance AI</Text>
          </View>
          <View style={styles.headerRight}>
            {user.isPremium ? (
              <LinearGradient
                colors={["#F6D365", "#FDA085"]}
                style={styles.premiumBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.premiumText}>PRO</Text>
              </LinearGradient>
            ) : (
              <Pressable
                onPress={() => router.push("/subscription")}
                style={styles.upgradeBtn}
              >
                <Feather name="zap" size={13} color="#F6D365" />
                <Text style={styles.upgradeText}>Upgrade</Text>
              </Pressable>
            )}
            <Pressable style={styles.settingsBtn}>
              <Feather name="settings" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.creditsRow}>
          <Feather name="zap" size={13} color="#F6D365" />
          <Text style={styles.creditsText}>
            {user.isPremium ? "Unlimited" : `${user.credits} free credits`}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <Pressable onPress={handleEnhance} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
          <LinearGradient
            colors={["#1A1040", "#0D0D25"]}
            style={styles.uploadCard}
          >
            <View style={styles.uploadCardInner}>
              <LinearGradient
                colors={["#7B61FF", "#00D2FF"]}
                style={styles.uploadIconWrap}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name="camera" size={28} color="#fff" />
              </LinearGradient>
              <Text style={styles.uploadTitle}>Enhance Your Photo</Text>
              <Text style={styles.uploadSubtitle}>
                Upload from gallery or take a photo
              </Text>
              <LinearGradient
                colors={["#7B61FF", "#B061FF"]}
                style={styles.startBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Feather name="upload" size={15} color="#fff" />
                <Text style={styles.startBtnText}>Choose Photo</Text>
              </LinearGradient>
            </View>
            <View style={styles.glowDot1} />
            <View style={styles.glowDot2} />
          </LinearGradient>
        </Pressable>

        <Text style={styles.sectionTitle}>Enhancement Modes</Text>
        <FlatList
          data={MODES}
          keyExtractor={(m) => m.id}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <ModeCard
              mode={item}
              selected={false}
              onPress={() => {
                Haptics.selectionAsync();
                router.push({ pathname: "/upload", params: { modeId: item.id } });
              }}
            />
          )}
          style={styles.modeList}
        />

        {recentHistory.length > 0 && (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <Pressable onPress={() => router.push("/(tabs)/history")}>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </View>
            {recentHistory.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/compare",
                    params: {
                      beforeUri: item.originalUri,
                      afterUri: item.enhancedUri,
                      modeName: item.modeName,
                    },
                  })
                }
                onDelete={() => removeEnhancement(item.id)}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080810" },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  greeting: { color: "#8888BB", fontSize: 13 },
  appName: { color: "#fff", fontSize: 26, fontWeight: "800" },
  premiumBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  premiumText: { color: "#000", fontSize: 12, fontWeight: "800" },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1a1a30",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#F6D365",
  },
  upgradeText: { color: "#F6D365", fontSize: 12, fontWeight: "700" },
  settingsBtn: { padding: 4 },
  creditsRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  creditsText: { color: "#8888BB", fontSize: 13 },
  body: { padding: 16 },
  uploadCard: {
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2a1a50",
    overflow: "hidden",
  },
  uploadCardInner: { alignItems: "center", zIndex: 2 },
  uploadIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  uploadTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  uploadSubtitle: {
    color: "#8888BB",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  startBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  glowDot1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#7B61FF",
    opacity: 0.12,
    top: -30,
    right: -20,
  },
  glowDot2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00D2FF",
    opacity: 0.1,
    bottom: -20,
    left: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8,
  },
  seeAllText: { color: "#7B61FF", fontSize: 14, fontWeight: "600" },
  modeList: { marginHorizontal: -6, marginBottom: 8 },
});
