import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { GradientButton } from "@/components/GradientButton";
import { useColors } from "@/hooks/useColors";

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { beforeUri, afterUri, modeName } = useLocalSearchParams<{
    beforeUri: string; afterUri: string; modeName: string;
  }>();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "web") { Alert.alert("Share", "Sharing is available on mobile."); return; }
    try { await Share.share({ url: afterUri, message: "Enhanced with Enhance AI!" }); } catch {}
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Saved!", "Your enhanced photo has been saved.");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      {/* ── NAV ── */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.replace("/(tabs)")} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
          <Feather name="x" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.navCenter}>
          <Text style={[styles.navTitle, { color: colors.text }]}>Result</Text>
          <View style={[styles.modePill, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.modeText, { color: colors.primary }]}>{modeName}</Text>
          </View>
        </View>
        <Pressable onPress={handleShare} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
          <Feather name="share-2" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* ── SLIDER ── */}
        <BeforeAfterSlider beforeUri={beforeUri ?? ""} afterUri={afterUri ?? ""} />

        <View style={styles.hintRow}>
          <Feather name="move-horizontal" size={13} color={colors.mutedForeground} />
          <Text style={[styles.hintTxt, { color: colors.mutedForeground }]}>Drag to compare</Text>
        </View>

        {/* ── SUCCESS CARD ── */}
        <LinearGradient colors={["#6C47FF", "#9B6BFF"]} style={styles.successCard} start={{x:0,y:0}} end={{x:1,y:0}}>
          <View style={styles.successIcon}>
            <Feather name="check" size={20} color="#6C47FF" />
          </View>
          <View>
            <Text style={styles.successTitle}>Enhancement Complete!</Text>
            <Text style={styles.successSub}>AI processed your photo successfully</Text>
          </View>
        </LinearGradient>

        {/* ── ACTIONS ── */}
        <View style={styles.actions}>
          <GradientButton label="Save HD Photo" onPress={handleSave} size="lg" style={{ flex: 1 }} />
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.iconCircle, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="share-2" size={20} color={colors.primary} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={({ pressed }) => [styles.newBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="plus" size={15} color={colors.primary} />
          <Text style={[styles.newBtnTxt, { color: colors.primary }]}>Enhance Another Photo</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  navBar:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12 },
  iconBtn:      { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  navCenter:    { alignItems: "center", gap: 4 },
  navTitle:     { fontSize: 17, fontWeight: "700" },
  modePill:     { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  modeText:     { fontSize: 11, fontWeight: "700" },
  body:         { padding: 16, gap: 14, paddingBottom: 60 },
  hintRow:      { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  hintTxt:      { fontSize: 13 },
  successCard:  { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 20 },
  successIcon:  { width: 44, height: 44, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  successTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  successSub:   { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  actions:      { flexDirection: "row", gap: 12 },
  iconCircle:   { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  newBtn:       { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14 },
  newBtnTxt:    { fontSize: 15, fontWeight: "600" },
});
