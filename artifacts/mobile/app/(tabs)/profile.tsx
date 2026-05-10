import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, label, value, onPress, danger }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.settingLeft}>
        <Feather name={icon as any} size={18} color={danger ? "#ef4444" : "#8888BB"} />
        <Text style={[styles.settingLabel, danger && { color: "#ef4444" }]}>
          {label}
        </Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <Feather name="chevron-right" size={16} color="#3a3a5a" />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateUser, upgradeToPremium } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const saveName = () => {
    if (nameInput.trim()) {
      updateUser({ name: nameInput.trim() });
    }
    setEditingName(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={["#1a0a2e", "#080810"]}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.avatarWrap}>
          <LinearGradient
            colors={["#7B61FF", "#00D2FF"]}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarLetter}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          {user.isPremium && (
            <View style={styles.proRing}>
              <LinearGradient
                colors={["#F6D365", "#FDA085"]}
                style={styles.proBadge}
              >
                <Text style={styles.proText}>PRO</Text>
              </LinearGradient>
            </View>
          )}
        </View>

        {editingName ? (
          <View style={styles.nameInputRow}>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              style={styles.nameInput}
              autoFocus
              onSubmitEditing={saveName}
              placeholderTextColor="#8888BB"
            />
            <Pressable onPress={saveName} style={styles.saveBtn}>
              <Feather name="check" size={18} color="#7B61FF" />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.nameRow}
            onPress={() => { setEditingName(true); setNameInput(user.name); }}
          >
            <Text style={styles.name}>{user.name}</Text>
            <Feather name="edit-2" size={14} color="#8888BB" />
          </Pressable>
        )}
        <Text style={styles.email}>{user.email}</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{user.totalEnhanced}</Text>
          <Text style={styles.statLabel}>Enhanced</Text>
        </View>
        <View style={[styles.statCard, styles.statCardMid]}>
          <Text style={styles.statNum}>
            {user.isPremium ? "∞" : user.credits}
          </Text>
          <Text style={styles.statLabel}>Credits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>
            {user.isPremium ? "PRO" : "Free"}
          </Text>
          <Text style={styles.statLabel}>Plan</Text>
        </View>
      </View>

      {!user.isPremium && (
        <Pressable
          onPress={() => router.push("/subscription")}
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, marginHorizontal: 16, marginBottom: 16 })}
        >
          <LinearGradient
            colors={["#F6D365", "#FDA085"]}
            style={styles.upgradeBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="zap" size={20} color="#000" />
            <View>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeSubtitle}>Unlimited enhancements, no watermark</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#000" />
          </LinearGradient>
        </Pressable>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="mail" label="Email" value={user.email} />
          <View style={styles.divider} />
          <SettingRow icon="bell" label="Notifications" />
          <View style={styles.divider} />
          <SettingRow icon="shield" label="Privacy" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="help-circle" label="Help Center" />
          <View style={styles.divider} />
          <SettingRow icon="star" label="Rate App" />
          <View style={styles.divider} />
          <SettingRow icon="share-2" label="Share App" />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="log-out"
            label="Sign Out"
            danger
            onPress={() =>
              Alert.alert("Sign Out", "Are you sure?", [
                { text: "Cancel" },
                { text: "Sign Out", style: "destructive" },
              ])
            }
          />
        </View>
      </View>

      <Text style={styles.version}>Enhance AI v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#080810" },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { color: "#fff", fontSize: 36, fontWeight: "800" },
  proRing: {
    position: "absolute",
    bottom: -4,
    right: -4,
  },
  proBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  proText: { color: "#000", fontSize: 10, fontWeight: "800" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  name: { color: "#fff", fontSize: 22, fontWeight: "800" },
  nameInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#14142A",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#7B61FF",
  },
  nameInput: { flex: 1, color: "#fff", fontSize: 18, paddingVertical: 10 },
  saveBtn: { padding: 8 },
  email: { color: "#8888BB", fontSize: 14 },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#10101E",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E1E3A",
  },
  statCardMid: { borderColor: "#7B61FF" },
  statNum: { color: "#fff", fontSize: 24, fontWeight: "800" },
  statLabel: { color: "#8888BB", fontSize: 12, marginTop: 2 },
  upgradeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 16,
  },
  upgradeTitle: { color: "#000", fontSize: 15, fontWeight: "800" },
  upgradeSubtitle: { color: "#333", fontSize: 12 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { color: "#8888BB", fontSize: 13, fontWeight: "600", marginBottom: 8, marginLeft: 4 },
  sectionCard: {
    backgroundColor: "#10101E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E3A",
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingLabel: { color: "#fff", fontSize: 15 },
  settingRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingValue: { color: "#8888BB", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#1E1E3A", marginHorizontal: 16 },
  version: { color: "#3a3a5a", fontSize: 12, textAlign: "center", marginBottom: 20 },
});
