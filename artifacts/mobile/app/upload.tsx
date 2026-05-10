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

export default function UploadScreen() {
  const insets = useSafeAreaInsets();
  const { modeId } = useLocalSearchParams<{ modeId?: string }>();
  const { user } = useApp();
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
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
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
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.navTitle}>Choose Photo</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.body}>
        {imageUri ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            <LinearGradient
              colors={["transparent", "rgba(8,8,16,0.9)"]}
              style={styles.previewOverlay}
            />
            <Pressable
              onPress={() => setImageUri(null)}
              style={styles.clearBtn}
            >
              <Feather name="x" size={16} color="#fff" />
            </Pressable>
            <View style={styles.previewInfo}>
              <Feather name="check-circle" size={16} color="#43E97B" />
              <Text style={styles.previewInfoText}>Photo selected</Text>
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.placeholderGlow} />
            <Feather name="image" size={64} color="#2a2a4a" />
            <Text style={styles.placeholderTitle}>No photo selected</Text>
            <Text style={styles.placeholderText}>
              Choose from gallery or take a new photo
            </Text>
          </View>
        )}

        <View style={styles.btnRow}>
          <Pressable
            onPress={pickFromGallery}
            style={({ pressed }) => [styles.sourceBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <LinearGradient
              colors={["#14142A", "#1a1a35"]}
              style={styles.sourceBtnGrad}
            >
              <LinearGradient
                colors={["#7B61FF", "#B061FF"]}
                style={styles.sourceBtnIcon}
              >
                <Feather name="image" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.sourceBtnLabel}>Gallery</Text>
              <Text style={styles.sourceBtnSub}>Pick from library</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={takePhoto}
            style={({ pressed }) => [styles.sourceBtn, { opacity: pressed ? 0.8 : 1 }]}
          >
            <LinearGradient
              colors={["#14142A", "#1a1a35"]}
              style={styles.sourceBtnGrad}
            >
              <LinearGradient
                colors={["#00D2FF", "#3A7BD5"]}
                style={styles.sourceBtnIcon}
              >
                <Feather name="camera" size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.sourceBtnLabel}>Camera</Text>
              <Text style={styles.sourceBtnSub}>Take a new photo</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <GradientButton
          label="Choose Enhancement Mode"
          onPress={proceed}
          disabled={!imageUri}
          size="lg"
          style={{ marginTop: 8 }}
        />

        {!user.isPremium && (
          <Text style={styles.creditsNote}>
            {user.credits} free credit{user.credits !== 1 ? "s" : ""} remaining
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080810" },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#14142A",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  body: { flex: 1, padding: 16, gap: 16 },
  previewWrap: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    minHeight: 280,
  },
  preview: { width: "100%", height: "100%" },
  previewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  clearBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewInfo: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  previewInfoText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  placeholder: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: "#10101E",
    borderWidth: 2,
    borderColor: "#1E1E3A",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 280,
  },
  placeholderGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#7B61FF",
    opacity: 0.05,
  },
  placeholderTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  placeholderText: { color: "#8888BB", fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
  btnRow: { flexDirection: "row", gap: 12 },
  sourceBtn: { flex: 1 },
  sourceBtnGrad: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#1E1E3A",
  },
  sourceBtnIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceBtnLabel: { color: "#fff", fontSize: 15, fontWeight: "700" },
  sourceBtnSub: { color: "#8888BB", fontSize: 12 },
  creditsNote: {
    color: "#8888BB",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});
