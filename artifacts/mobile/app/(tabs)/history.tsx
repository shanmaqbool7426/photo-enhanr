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

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, removeEnhancement } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>
          {history.length} enhancement{history.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="clock" size={52} color="#2a2a4a" />
          <Text style={styles.emptyTitle}>No enhancements yet</Text>
          <Text style={styles.emptyText}>
            Your enhanced photos will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HistoryCard
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
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080810" },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E3A",
  },
  title: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#8888BB", fontSize: 14, marginTop: 2 },
  list: { padding: 16, paddingBottom: 120 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  emptyText: { color: "#8888BB", fontSize: 14, textAlign: "center" },
});
