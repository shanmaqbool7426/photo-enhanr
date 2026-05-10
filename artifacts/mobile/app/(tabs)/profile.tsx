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
import { useColors } from "@/hooks/useColors";

function SettingRow({
  icon, label, value, onPress, danger,
}: { icon: string; label: string; value?: string; onPress?: () => void; danger?: boolean }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconWrap, { backgroundColor: danger ? "#FEE2E2" : colors.secondary }]}>
          <Feather name={icon as any} size={16} color={danger ? "#EF4444" : colors.primary} />
        </View>
        <Text style={[styles.settingLabel, { color: danger ? "#EF4444" : colors.text }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{value}</Text>}
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { user, updateUser, upgradeToPremium } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const saveName = () => {
    if (nameInput.trim()) updateUser({ name: nameInput.trim() });
    setEditingName(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ── */}
      <LinearGradient colors={["#6C47FF", "#9B6BFF"]} style={[styles.header, { paddingTop: topPad + 20 }]}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          {user.isPremium && (
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeTxt}>✦ PRO</Text>
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
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <Pressable onPress={saveName} style={styles.saveBtn}>
              <Feather name="check" size={18} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.nameRow} onPress={() => { setEditingName(true); setNameInput(user.name); }}>
            <Text style={styles.name}>{user.name}</Text>
            <Feather name="edit-2" size={13} color="rgba(255,255,255,0.6)" />
          </Pressable>
        )}
        <Text style={styles.email}>{user.email}</Text>
      </LinearGradient>

      {/* ── STATS ── */}
      <View style={styles.statsRow}>
        {[
          { label: "Enhanced", value: String(user.totalEnhanced) },
          { label: "Credits",  value: user.isPremium ? "∞" : String(user.credits) },
          { label: "Plan",     value: user.isPremium ? "PRO" : "Free" },
        ].map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: i === 1 ? colors.primary : colors.border },
            ]}
          >
            <Text style={[styles.statNum, { color: i === 1 ? colors.primary : colors.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── UPGRADE BANNER ── */}
      {!user.isPremium && (
        <Pressable onPress={() => router.push("/subscription")} style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1, marginHorizontal: 16, marginBottom: 16 }]}>
          <LinearGradient colors={["#6C47FF","#9B6BFF"]} style={styles.upgradeBanner} start={{x:0,y:0}} end={{x:1,y:0}}>
            <View style={styles.upgradeIconWrap}>
              <Feather name="zap" size={18} color="#6C47FF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
              <Text style={styles.upgradeSub}>Unlimited enhancements, no watermark</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      )}

      {/* ── ACCOUNT ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Account</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="mail" label="Email" value={user.email} />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <SettingRow icon="bell" label="Notifications" />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <SettingRow icon="shield" label="Privacy" />
        </View>
      </View>

      {/* ── SUPPORT ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Support</Text>
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow icon="help-circle" label="Help Center" />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <SettingRow icon="star" label="Rate the App" />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <SettingRow icon="share-2" label="Share App" />
        </View>
      </View>

      {/* ── SIGN OUT ── */}
      <View style={styles.section}>
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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

      <Text style={[styles.version, { color: colors.border }]}>Enhance AI v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  header:          { alignItems: "center", paddingHorizontal: 20, paddingBottom: 28, gap: 8 },
  avatarWrap:      { position: "relative", marginBottom: 4 },
  avatar:          { width: 88, height: 88, borderRadius: 44, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#fff" },
  avatarLetter:    { color: "#fff", fontSize: 34, fontWeight: "800" },
  proBadge:        { position: "absolute", bottom: -4, right: -4, backgroundColor: "#FCD34D", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  proBadgeTxt:     { color: "#7C2D00", fontSize: 10, fontWeight: "800" },
  nameRow:         { flexDirection: "row", alignItems: "center", gap: 8 },
  name:            { color: "#fff", fontSize: 22, fontWeight: "800" },
  nameInputRow:    { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.4)" },
  nameInput:       { flex: 1, color: "#fff", fontSize: 18, paddingVertical: 10 },
  saveBtn:         { padding: 8 },
  email:           { color: "rgba(255,255,255,0.75)", fontSize: 14 },
  statsRow:        { flexDirection: "row", marginHorizontal: 16, marginTop: -1, marginBottom: 16, gap: 10 },
  statCard:        { flex: 1, borderRadius: 16, padding: 14, alignItems: "center", borderWidth: 1.5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  statNum:         { fontSize: 22, fontWeight: "800" },
  statLabel:       { fontSize: 12, marginTop: 2 },
  upgradeBanner:   { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, padding: 14 },
  upgradeIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  upgradeTitle:    { color: "#fff", fontSize: 14, fontWeight: "800" },
  upgradeSub:      { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  section:         { paddingHorizontal: 16, marginBottom: 14 },
  sectionTitle:    { fontSize: 12, fontWeight: "700", marginBottom: 8, marginLeft: 4, letterSpacing: 0.5, textTransform: "uppercase" },
  sectionCard:     { borderRadius: 16, borderWidth: 1, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  settingRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingVertical: 13 },
  settingLeft:     { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingLabel:    { fontSize: 15 },
  settingRight:    { flexDirection: "row", alignItems: "center", gap: 6 },
  settingValue:    { fontSize: 13 },
  rowDivider:      { height: 1, marginHorizontal: 14 },
  version:         { fontSize: 12, textAlign: "center", marginBottom: 20 },
});
