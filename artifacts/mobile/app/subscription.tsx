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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientButton } from "@/components/GradientButton";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/useColors";

const FREE_FEATURES = ["5 free credits", "Basic HD enhance", "Standard speed", "Watermarked exports"];
const PRO_FEATURES  = ["Unlimited enhancements", "All 10 AI modes", "3× faster processing", "No watermark", "4K export quality", "Priority support", "Batch enhancement"];

const PLANS = [
  { id: "weekly",  label: "Weekly",  price: "$2.99",  period: "/week",  savings: null },
  { id: "monthly", label: "Monthly", price: "$9.99",  period: "/month", savings: "Save 17%" },
  { id: "yearly",  label: "Yearly",  price: "$59.99", period: "/year",  savings: "Best Value 🔥" },
];

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { upgradeToPremium, user } = useApp();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handlePurchase = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    upgradeToPremium();
    Alert.alert("Welcome to Premium! ✦", "Enjoy unlimited AI enhancements with all modes.", [
      { text: "Let's Go!", onPress: () => router.back() },
    ]);
  };

  const plan = PLANS.find((p) => p.id === selectedPlan)!;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      {/* ── NAV ── */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
          <Feather name="x" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Premium</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 + insets.bottom }} showsVerticalScrollIndicator={false}>
        {/* ── HERO ── */}
        <LinearGradient colors={["#6C47FF", "#9B6BFF"]} style={styles.hero} start={{x:0,y:0}} end={{x:1,y:1}}>
          <View style={styles.crownCircle}>
            <Feather name="zap" size={28} color="#6C47FF" />
          </View>
          <Text style={styles.heroTitle}>Enhance AI Premium</Text>
          <Text style={styles.heroSub}>Unlimited AI enhancements, all professional modes</Text>
        </LinearGradient>

        {/* ── PLANS ── */}
        <View style={styles.plansSection}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Choose your plan</Text>
          {PLANS.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => { Haptics.selectionAsync(); setSelectedPlan(p.id); }}
              style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
            >
              <View style={[
                styles.planCard,
                { backgroundColor: colors.card, borderColor: p.id === selectedPlan ? colors.primary : colors.border },
                p.id === selectedPlan && styles.planCardActive,
              ]}>
                <View>
                  <Text style={[styles.planLabel, { color: p.id === selectedPlan ? colors.primary : colors.mutedForeground }]}>
                    {p.label}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.planPrice, { color: colors.text }]}>{p.price}</Text>
                    <Text style={[styles.planPeriod, { color: colors.mutedForeground }]}>{p.period}</Text>
                  </View>
                </View>
                <View style={styles.planRight}>
                  {p.savings && (
                    <View style={[styles.savingsBadge, { backgroundColor: p.id === selectedPlan ? colors.primary : colors.secondary }]}>
                      <Text style={[styles.savingsTxt, { color: p.id === selectedPlan ? "#fff" : colors.primary }]}>
                        {p.savings}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.radio, { borderColor: p.id === selectedPlan ? colors.primary : colors.border }]}>
                    {p.id === selectedPlan && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* ── FEATURE COMPARISON ── */}
        <View style={styles.compareSection}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>What's included</Text>
          <View style={[styles.compareCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.compareCol}>
              <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>Free</Text>
              {FREE_FEATURES.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="minus" size={13} color={colors.mutedForeground} />
                  <Text style={[styles.featureTxt, { color: colors.mutedForeground }]}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.colDivider, { backgroundColor: colors.border }]} />
            <View style={styles.compareCol}>
              <Text style={[styles.colLabel, { color: colors.primary }]}>Premium</Text>
              {PRO_FEATURES.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="check" size={13} color="#22C55E" />
                  <Text style={[styles.featureTxt, { color: colors.text }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={[styles.testimonial, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.quote, { color: colors.text }]}>
            "Enhance AI transformed my old family photos. The results are absolutely incredible!"
          </Text>
          <Text style={[styles.author, { color: colors.mutedForeground }]}>— Sarah M. ⭐⭐⭐⭐⭐</Text>
        </View>
      </ScrollView>

      {/* ── STICKY FOOTER ── */}
      <View style={[styles.footer, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
        {user.isPremium ? (
          <View style={styles.alreadyPro}>
            <Feather name="check-circle" size={20} color="#22C55E" />
            <Text style={[styles.alreadyTxt, { color: "#22C55E" }]}>You already have Premium!</Text>
          </View>
        ) : (
          <>
            <GradientButton
              label={loading ? "Processing..." : `Start Premium — ${plan.price}${plan.period}`}
              onPress={handlePurchase}
              loading={loading}
              size="lg"
            />
            <Text style={[styles.cancelTxt, { color: colors.mutedForeground }]}>Cancel anytime · No commitment</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1 },
  navBar:        { flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingHorizontal:16, paddingBottom:12 },
  iconBtn:       { width:38, height:38, borderRadius:19, alignItems:"center", justifyContent:"center", shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.06, shadowRadius:4, elevation:2 },
  navTitle:      { fontSize:17, fontWeight:"700" },
  hero:          { margin:16, borderRadius:24, padding:28, alignItems:"center", gap:10 },
  crownCircle:   { width:64, height:64, borderRadius:20, backgroundColor:"#fff", alignItems:"center", justifyContent:"center", marginBottom:4 },
  heroTitle:     { color:"#fff", fontSize:22, fontWeight:"800", textAlign:"center" },
  heroSub:       { color:"rgba(255,255,255,0.8)", fontSize:14, textAlign:"center" },
  plansSection:  { paddingHorizontal:16, gap:10, marginBottom:16 },
  sectionLabel:  { fontSize:13, fontWeight:"600", marginBottom:4 },
  planCard:      { borderRadius:16, borderWidth:2, padding:16, flexDirection:"row", alignItems:"center", justifyContent:"space-between", shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.05, shadowRadius:6, elevation:2 },
  planCardActive:{ shadowColor:"#6C47FF", shadowOpacity:0.15 },
  planLabel:     { fontSize:13, fontWeight:"600", marginBottom:4 },
  priceRow:      { flexDirection:"row", alignItems:"baseline", gap:2 },
  planPrice:     { fontSize:22, fontWeight:"800" },
  planPeriod:    { fontSize:13 },
  planRight:     { flexDirection:"row", alignItems:"center", gap:10 },
  savingsBadge:  { borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  savingsTxt:    { fontSize:11, fontWeight:"700" },
  radio:         { width:22, height:22, borderRadius:11, borderWidth:2, alignItems:"center", justifyContent:"center" },
  radioDot:      { width:12, height:12, borderRadius:6 },
  compareSection:{ paddingHorizontal:16, marginBottom:16 },
  compareCard:   { borderRadius:20, borderWidth:1, padding:16, flexDirection:"row", gap:16 },
  compareCol:    { flex:1, gap:8 },
  colDivider:    { width:1 },
  colLabel:      { fontSize:14, fontWeight:"700", marginBottom:4 },
  featureRow:    { flexDirection:"row", alignItems:"center", gap:6 },
  featureTxt:    { fontSize:12, flex:1 },
  testimonial:   { margin:16, borderRadius:16, borderWidth:1, padding:16, gap:8 },
  quote:         { fontSize:14, lineHeight:21, fontStyle:"italic" },
  author:        { fontSize:12, fontWeight:"600" },
  footer:        { padding:16, gap:8, borderTopWidth:1 },
  alreadyPro:    { flexDirection:"row", alignItems:"center", justifyContent:"center", gap:8, paddingVertical:16 },
  alreadyTxt:    { fontSize:16, fontWeight:"700" },
  cancelTxt:     { fontSize:13, textAlign:"center" },
});
