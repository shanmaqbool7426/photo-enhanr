import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HistoryCard } from "@/components/HistoryCard";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, removeEnhancement } = useApp();
  const colors = useColors();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <View style={[styles.countPill, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.countTxt, { color: colors.primary }]}>
            {history.length} photo{history.length !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="clock" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No enhancements yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
            Your enhanced photos will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HistoryCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/compare",
                  params: { beforeUri: item.originalUri, afterUri: item.enhancedUri, modeName: item.modeName },
                })
              }
              onDelete={() => removeEnhancement(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  header:       { paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title:        { fontSize: 28, fontWeight: "800" },
  countPill:    { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  countTxt:     { fontSize: 13, fontWeight: "700" },
  list:         { padding: 16 },
  empty:        { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingBottom: 80 },
  emptyIcon:    { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  emptyTitle:   { fontSize: 20, fontWeight: "700" },
  emptySubtitle:{ fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
});
