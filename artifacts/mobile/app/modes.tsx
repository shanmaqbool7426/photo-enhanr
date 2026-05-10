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
import { useColors } from "@/hooks/useColors";

export default function ModesScreen() {
  const insets = useSafeAreaInsets();
  const { imageUri, modeId } = useLocalSearchParams<{ imageUri: string; modeId?: string }>();
  const { user } = useApp();
  const colors = useColors();
  const [selectedId, setSelectedId] = useState<string>(modeId ?? MODES[0].id);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const selectedMode = MODES.find((m) => m.id === selectedId) ?? MODES[0];
  const isLocked = !!selectedMode.isPremium && !user.isPremium;

  const handleStart = () => {
    if (isLocked) { router.push("/subscription"); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push({ pathname: "/processing", params: { imageUri, modeId: selectedId, modeName: selectedMode.name } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Enhancement Mode</Text>
        <View style={{ width: 38 }} />
      </View>

      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Select how you'd like to enhance your photo
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
            onPress={() => { Haptics.selectionAsync(); setSelectedId(item.id); }}
          />
        )}
      />

      <View style={[styles.footer, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]}>
        {isLocked && (
          <View style={styles.lockRow}>
            <Feather name="lock" size={13} color="#F59E0B" />
            <Text style={styles.lockTxt}>{selectedMode.name} requires Premium</Text>
          </View>
        )}
        <GradientButton
          label={isLocked ? "Unlock with Premium ✦" : `Enhance with ${selectedMode.name}`}
          onPress={handleStart}
          gradient={isLocked ? ["#F59E0B", "#F97316"] : ["#6C47FF", "#9B6BFF"]}
          size="lg"
          style={{ width: "100%" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar:    { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 4 },
  backBtn:   { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  navTitle:  { fontSize: 17, fontWeight: "700" },
  subtitle:  { paddingHorizontal: 20, marginBottom: 4, fontSize: 14 },
  grid:      { padding: 10, paddingBottom: 8 },
  footer:    { padding: 16, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 8 },
  lockRow:   { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  lockTxt:   { color: "#F59E0B", fontSize: 13, fontWeight: "600" },
});
