import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { useColors } from "@/hooks/useColors";

export default function UploadScreen() {
  const insets = useSafeAreaInsets();
  const { modeId } = useLocalSearchParams<{ modeId?: string }>();
  const { user } = useApp();
  const colors = useColors();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Not supported", "Camera is not available on web.");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setImageUri(result.assets[0].uri);
    }
  };

  const proceed = () => {
    if (!imageUri) return;
    if (!user.isPremium && user.credits <= 0) {
      Alert.alert(
        "No Credits",
        "You've used all your free credits. Upgrade to Premium for unlimited enhancements.",
        [
          { text: "Not now" },
          { text: "Upgrade", onPress: () => router.push("/subscription") },
        ]
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/modes", params: { imageUri, modeId: modeId ?? "" } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      {/* ── NAV ── */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="x" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Choose Photo</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.body}>
        {/* ── PREVIEW OR PLACEHOLDER ── */}
        {imageUri ? (
          <View style={[styles.previewWrap, { shadowColor: colors.primary }]}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            <Pressable onPress={() => setImageUri(null)} style={styles.clearBtn}>
              <Feather name="x" size={15} color="#fff" />
            </Pressable>
            <View style={styles.previewTag}>
              <Feather name="check-circle" size={14} color="#22C55E" />
              <Text style={styles.previewTagTxt}>Photo ready</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image
              source={require("@/assets/images/hero_upload.png")}
              style={styles.placeholderImg}
              resizeMode="contain"
            />
            <Text style={[styles.placeholderTitle, { color: colors.text }]}>No photo selected</Text>
            <Text style={[styles.placeholderSub, { color: colors.mutedForeground }]}>
              Pick from gallery or take a new photo
            </Text>
          </View>
        )}

        {/* ── SOURCE BUTTONS ── */}
        <View style={styles.sourceRow}>
          <Pressable
            onPress={pickFromGallery}
            style={({ pressed }) => [styles.sourceCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
          >
            <LinearGradient colors={["#6C47FF", "#9B6BFF"]} style={styles.srcIconWrap}>
              <Feather name="image" size={22} color="#fff" />
            </LinearGradient>
            <Text style={[styles.srcLabel, { color: colors.text }]}>Gallery</Text>
            <Text style={[styles.srcSub, { color: colors.mutedForeground }]}>From library</Text>
          </Pressable>

          <Pressable
            onPress={takePhoto}
            style={({ pressed }) => [styles.sourceCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
          >
            <LinearGradient colors={["#0EA5E9", "#38BDF8"]} style={styles.srcIconWrap}>
              <Feather name="camera" size={22} color="#fff" />
            </LinearGradient>
            <Text style={[styles.srcLabel, { color: colors.text }]}>Camera</Text>
            <Text style={[styles.srcSub, { color: colors.mutedForeground }]}>Take new photo</Text>
          </Pressable>
        </View>

        <GradientButton
          label="Choose Enhancement Mode"
          onPress={proceed}
          disabled={!imageUri}
          size="lg"
        />

        {!user.isPremium && (
          <Text style={[styles.creditsNote, { color: colors.mutedForeground }]}>
            {user.credits} free credit{user.credits !== 1 ? "s" : ""} remaining
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1 },
  navBar:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12 },
  backBtn:       { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  navTitle:      { fontSize: 17, fontWeight: "700" },
  body:          { flex: 1, padding: 16, gap: 14 },
  previewWrap:   { flex: 1, borderRadius: 24, overflow: "hidden", minHeight: 260, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 6 },
  preview:       { width: "100%", height: "100%" },
  clearBtn:      { position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  previewTag:    { position: "absolute", bottom: 12, left: 12, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  previewTagTxt: { color: "#1A1025", fontSize: 12, fontWeight: "600" },
  placeholder:   { flex: 1, borderRadius: 24, borderWidth: 2, borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 260, overflow: "hidden" },
  placeholderImg:{ width: "70%", height: 140, marginBottom: 8 },
  placeholderTitle:{ fontSize: 16, fontWeight: "700" },
  placeholderSub:{ fontSize: 13, textAlign: "center", paddingHorizontal: 32 },
  sourceRow:     { flexDirection: "row", gap: 12 },
  sourceCard:    { flex: 1, borderRadius: 20, padding: 16, alignItems: "center", gap: 8, borderWidth: 1.5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  srcIconWrap:   { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  srcLabel:      { fontSize: 14, fontWeight: "700" },
  srcSub:        { fontSize: 11 },
  creditsNote:   { fontSize: 13, textAlign: "center" },
});
