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

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const { beforeUri, afterUri, modeName } = useLocalSearchParams<{
    beforeUri: string;
    afterUri: string;
    modeName: string;
  }>();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "web") {
      Alert.alert("Share", "Sharing is available on mobile devices.");
      return;
    }
    try {
      await Share.share({ url: afterUri, message: "Enhanced with Enhance AI!" });
    } catch {}
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Saved!", "Your enhanced photo has been saved to history.");
  };

  const handleNew = () => {
    Haptics.selectionAsync();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.replace("/(tabs)")} style={styles.backBtn}>
          <Feather name="x" size={20} color="#fff" />
        </Pressable>
        <View style={styles.navCenter}>
          <Text style={styles.navTitle}>Result</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>{modeName}</Text>
          </View>
        </View>
        <Pressable onPress={handleShare} style={styles.shareBtn}>
          <Feather name="share-2" size={18} color="#7B61FF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <BeforeAfterSlider
          beforeUri={beforeUri ?? ""}
          afterUri={afterUri ?? ""}
        />

        <View style={styles.hintRow}>
          <Feather name="move-horizontal" size={14} color="#8888BB" />
          <Text style={styles.hintText}>Drag the slider to compare</Text>
        </View>

        <LinearGradient
          colors={["#1A1040", "#0D0D25"]}
          style={styles.successCard}
        >
          <LinearGradient
            colors={["#43E97B", "#38F9D7"]}
            style={styles.successIcon}
          >
            <Feather name="check" size={22} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={styles.successTitle}>Enhancement Complete!</Text>
            <Text style={styles.successSub}>AI processed your photo successfully</Text>
          </View>
        </LinearGradient>

        <View style={styles.actions}>
          <GradientButton
            label="Save HD Photo"
            onPress={handleSave}
            size="lg"
            style={{ flex: 1 }}
          />
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.actionBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="share-2" size={20} color="#fff" />
          </Pressable>
        </View>

        <Pressable
          onPress={handleNew}
          style={({ pressed }) => [styles.newBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="plus" size={16} color="#7B61FF" />
          <Text style={styles.newBtnText}>Enhance Another Photo</Text>
        </Pressable>
      </ScrollView>
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
  navCenter: { alignItems: "center", gap: 4 },
  navTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  modeBadge: {
    backgroundColor: "#1a1a30",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#7B61FF",
  },
  modeText: { color: "#7B61FF", fontSize: 11, fontWeight: "700" },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#14142A",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 16, gap: 16, paddingBottom: 60 },
  hintRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  hintText: { color: "#8888BB", fontSize: 13 },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a1a50",
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  successSub: { color: "#8888BB", fontSize: 13 },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#14142A",
    borderWidth: 1,
    borderColor: "#1E1E3A",
    alignItems: "center",
    justifyContent: "center",
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  newBtnText: { color: "#7B61FF", fontSize: 15, fontWeight: "600" },
});
