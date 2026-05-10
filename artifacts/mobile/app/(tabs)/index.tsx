import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, useRootNavigationState } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HistoryCard } from "@/components/HistoryCard";
import { ModeCard, Mode } from "@/components/ModeCard";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

export const MODES: Mode[] = [
  { id: "hd",       name: "HD Enhance",     desc: "Ultra sharp quality",   icon: "zap",       gradient: ["#7B61FF","#B061FF"] },
  { id: "face",     name: "Face Enhance",   desc: "Perfect portraits",     icon: "smile",     gradient: ["#FF6B6B","#FF8E8E"] },
  { id: "restore",  name: "Old Photo",      desc: "Restore memories",      icon: "clock",     gradient: ["#F6D365","#FDA085"] },
  { id: "blur",     name: "Remove Blur",    desc: "Crystal clear",         icon: "eye",       gradient: ["#00D2FF","#3A7BD5"] },
  { id: "lowlight", name: "Low Light",      desc: "Brighten dark shots",   icon: "sun",       gradient: ["#FDDB92","#D1FDFF"] },
  { id: "color",    name: "Color Fix",      desc: "Perfect colors",        icon: "sliders",   gradient: ["#43E97B","#38F9D7"] },
  { id: "2x",       name: "Upscale 2x",     desc: "Double resolution",     icon: "maximize",  gradient: ["#4FACFE","#00F2FE"] },
  { id: "4x",       name: "Upscale 4x",     desc: "4× resolution",         icon: "maximize-2",gradient: ["#667EEA","#764BA2"], isPremium: true },
  { id: "skin",     name: "Skin Smooth",    desc: "Flawless skin",         icon: "user",      gradient: ["#F093FB","#F5576C"] },
  { id: "anime",    name: "Anime Style",    desc: "Anime art filter",      icon: "star",      gradient: ["#FF9A9E","#FECFEF"], isPremium: true },
];

export default function HomeScreen() {
  const insets  = useSafeAreaInsets();
  const colors  = useColors();
  const { user, history, onboarded, removeEnhancement } = useApp();
  const nav     = useRootNavigationState();
  const topPad  = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    if (!nav?.key) return;
    if (!onboarded) router.replace("/onboarding");
  }, [nav?.key, onboarded]);

  const recentHistory = history.slice(0, 3);

  const handleEnhance = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/upload");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── HEADER ─── */}
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good day 👋</Text>
            <Text style={[styles.appName, { color: colors.text }]}>Enhance AI</Text>
          </View>
          <View style={styles.headerRight}>
            {user.isPremium ? (
              <LinearGradient colors={["#F6D365","#FDA085"]} style={styles.proBadge} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={styles.proText}>✦ PRO</Text>
              </LinearGradient>
            ) : (
              <Pressable onPress={() => router.push("/subscription")} style={[styles.upgradeBtn,{borderColor: colors.primary}]}>
                <Feather name="zap" size={12} color={colors.primary} />
                <Text style={[styles.upgradeTxt, {color: colors.primary}]}>Upgrade</Text>
              </Pressable>
            )}
            <Pressable style={[styles.settingsCircle,{backgroundColor: colors.muted}]}>
              <Feather name="settings" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>
        <View style={[styles.creditsPill,{backgroundColor: colors.secondary}]}>
          <Feather name="zap" size={12} color={colors.primary} />
          <Text style={[styles.creditsTxt,{color: colors.primary}]}>
            {user.isPremium ? "Unlimited enhancements" : `${user.credits} free credits remaining`}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* ─── HERO UPLOAD CARD ─── */}
        <Pressable onPress={handleEnhance} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
          <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
            <Image
              source={require("@/assets/images/hero_upload.png")}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.95)"]}
              style={styles.heroOverlay}
            />
            <View style={styles.heroContent}>
              <Text style={[styles.heroTitle, { color: colors.text }]}>Enhance Your Photo</Text>
              <Text style={[styles.heroSubtitle, { color: colors.mutedForeground }]}>
                Upload from gallery or take a photo
              </Text>
              <LinearGradient
                colors={["#6C47FF","#9B6BFF"]}
                style={styles.heroBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Feather name="upload" size={15} color="#fff" />
                <Text style={styles.heroBtnTxt}>Choose Photo</Text>
              </LinearGradient>
            </View>
          </View>
        </Pressable>

        {/* ─── MODES GRID ─── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Enhancement Modes</Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>10 AI modes</Text>
        </View>

        <FlatList
          data={MODES}
          keyExtractor={(m) => m.id}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <ModeCard
              mode={item}
              selected={false}
              onPress={() => {
                Haptics.selectionAsync();
                router.push({ pathname: "/upload", params: { modeId: item.id } });
              }}
            />
          )}
          style={styles.modeList}
        />

        {/* ─── RECENT HISTORY ─── */}
        {recentHistory.length > 0 && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
              <Pressable onPress={() => router.push("/(tabs)/history")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
              </Pressable>
            </View>
            {recentHistory.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: "/compare",
                    params: { beforeUri: item.originalUri, afterUri: item.enhancedUri, modeName: item.modeName },
                  })
                }
                onDelete={() => removeEnhancement(item.id)}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  header:       { paddingHorizontal: 20, paddingBottom: 16, shadowColor:"#6C47FF", shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8, elevation:4 },
  headerRow:    { flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:12 },
  headerRight:  { flexDirection:"row", alignItems:"center", gap:10 },
  greeting:     { fontSize:13, marginBottom:2 },
  appName:      { fontSize:26, fontWeight:"800" },
  proBadge:     { borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
  proText:      { color:"#7C2D00", fontSize:12, fontWeight:"800" },
  upgradeBtn:   { flexDirection:"row", alignItems:"center", gap:4, borderRadius:20, paddingHorizontal:12, paddingVertical:5, borderWidth:1.5 },
  upgradeTxt:   { fontSize:12, fontWeight:"700" },
  settingsCircle:{ width:36, height:36, borderRadius:18, alignItems:"center", justifyContent:"center" },
  creditsPill:  { flexDirection:"row", alignItems:"center", gap:6, alignSelf:"flex-start", borderRadius:20, paddingHorizontal:12, paddingVertical:6 },
  creditsTxt:   { fontSize:13, fontWeight:"600" },
  body:         { padding:16, gap:4 },
  heroCard:     { borderRadius:24, overflow:"hidden", marginBottom:20, shadowColor:"#6C47FF", shadowOffset:{width:0,height:4}, shadowOpacity:0.12, shadowRadius:16, elevation:6 },
  heroImage:    { width:"100%", height:180 },
  heroOverlay:  { position:"absolute", bottom:0, left:0, right:0, height:140 },
  heroContent:  { position:"absolute", bottom:0, left:0, right:0, padding:20, alignItems:"flex-start" },
  heroTitle:    { fontSize:22, fontWeight:"800", marginBottom:4 },
  heroSubtitle: { fontSize:13, marginBottom:14 },
  heroBtn:      { flexDirection:"row", alignItems:"center", gap:8, paddingHorizontal:20, paddingVertical:11, borderRadius:28 },
  heroBtnTxt:   { color:"#fff", fontSize:15, fontWeight:"700" },
  sectionHeader:{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:8, marginTop:4 },
  sectionTitle: { fontSize:18, fontWeight:"700" },
  sectionSub:   { fontSize:13 },
  seeAll:       { fontSize:14, fontWeight:"600" },
  modeList:     { marginHorizontal:-6, marginBottom:8 },
});
