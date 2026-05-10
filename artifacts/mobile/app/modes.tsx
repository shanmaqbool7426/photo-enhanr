import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientButton } from "@/components/GradientButton";
import { ModeCard } from "@/components/ModeCard";
import { MODES } from "@/app/(tabs)/index";
import { useApp } from "@/contexts/AppContext";

export default function ModesScreen() {
  const insets = useSafeAreaInsets();
  const { imageUri, modeId } = useLocalSearchParams<{ imageUri: string; modeId?: string }>();
  const { user } = useApp();
  const [selectedId, setSelectedId] = useState<string>(modeId ?? MODES[0].id);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const selectedMode = MODES.find((m) => m.id === selectedId) ?? MODES[0];

  const handleStart = () => {
    if (selectedMode.isPremium && !user.isPremium) {
      router.push("/subscription");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push({
      pathname: "/processing",
      params: { imageUri, modeId: selectedId, modeName: selectedMode.name },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.navTitle}>Enhancement Mode</Text>
        <View style={{ width: 38 }} />
      </View>

      <Text style={styles.subtitle}>
        Select how you want to enhance your photo
      </Text>

      <FlatList
        data={MODES}
        keyExtractor={(m) => m.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ModeCard
            mode={item}
            selected={item.id === selectedId}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedId(item.id);
            }}
          />
        )}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {selectedMode.isPremium && !user.isPremium && (
          <View style={styles.premiumNotice}>
            <Feather name="lock" size={14} color="#F6D365" />
            <Text style={styles.premiumNoticeText}>
              {selectedMode.name} requires Premium
            </Text>
          </View>
        )}
        <GradientButton
          label={selectedMode.isPremium && !user.isPremium ? "Unlock with Premium" : `Start ${selectedMode.name}`}
          onPress={handleStart}
          gradient={
            selectedMode.isPremium && !user.isPremium
              ? ["#F6D365", "#FDA085"]
              : selectedMode.gradient
          }
          size="lg"
          style={{ width: "100%" }}
        />
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
    paddingBottom: 4,
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
  subtitle: {
    color: "#8888BB",
    fontSize: 14,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  grid: {
    padding: 10,
    paddingBottom: 8,
  },
  footer: {
    padding: 16,
    gap: 10,
  },
  premiumNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  premiumNoticeText: { color: "#F6D365", fontSize: 13, fontWeight: "600" },
});
