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

const FREE_FEATURES = [
  "5 free credits",
  "Basic HD enhance",
  "Standard processing speed",
  "Watermarked exports",
];

const PRO_FEATURES = [
  "Unlimited enhancements",
  "All 10 AI modes",
  "3x faster processing",
  "No watermark",
  "Priority support",
  "Batch enhancement",
  "4K export quality",
];

const PLANS = [
  { id: "weekly", label: "Weekly", price: "$2.99", period: "/week", savings: null },
  { id: "monthly", label: "Monthly", price: "$9.99", period: "/month", savings: "Save 17%" },
  { id: "yearly", label: "Yearly", price: "$59.99", period: "/year", savings: "Save 50%" },
];

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
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
    Alert.alert(
      "Welcome to Premium!",
      "You now have unlimited enhancements and all AI modes.",
      [{ text: "Let's Go!", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.navTitle}>Premium</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#1A0F30", "#080810"]}
          style={styles.heroSection}
        >
          <LinearGradient
            colors={["#F6D365", "#FDA085"]}
            style={styles.crownIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="zap" size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.heroTitle}>Enhance AI{"\n"}Premium</Text>
          <Text style={styles.heroSubtitle}>
            Unlimited AI enhancements with all professional modes
          </Text>
        </LinearGradient>

        <View style={styles.plansSection}>
          {PLANS.map((plan) => (
            <Pressable
              key={plan.id}
              onPress={() => { Haptics.selectionAsync(); setSelectedPlan(plan.id); }}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              {selectedPlan === plan.id ? (
                <LinearGradient
                  colors={["#7B61FF", "#B061FF"]}
                  style={[styles.planCard, styles.planCardSelected]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <PlanCardContent plan={plan} selected />
                </LinearGradient>
              ) : (
                <View style={styles.planCard}>
                  <PlanCardContent plan={plan} selected={false} />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What's included</Text>
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonCol}>
              <Text style={styles.colTitle}>Free</Text>
              {FREE_FEATURES.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="minus" size={14} color="#8888BB" />
                  <Text style={styles.featureTextMuted}>{f}</Text>
                </View>
              ))}
            </View>
            <View style={styles.dividerV} />
            <View style={styles.comparisonCol}>
              <Text style={styles.colTitlePro}>Premium</Text>
              {PRO_FEATURES.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="check" size={14} color="#43E97B" />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.testimonialSection}>
          <Text style={styles.testimonial}>
            "Enhance AI transformed my old family photos. The results are incredible!"
          </Text>
          <Text style={styles.testimonialAuthor}>— Sarah M.</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {user.isPremium ? (
          <View style={styles.alreadyPro}>
            <Feather name="check-circle" size={20} color="#43E97B" />
            <Text style={styles.alreadyProText}>You are already on Premium!</Text>
          </View>
        ) : (
          <>
            <GradientButton
              label={loading ? "Processing..." : "Start Premium — " + PLANS.find((p) => p.id === selectedPlan)?.price}
              onPress={handlePurchase}
              gradient={["#F6D365", "#FDA085"]}
              loading={loading}
              size="lg"
            />
            <Text style={styles.cancelText}>Cancel anytime · No commitment</Text>
          </>
        )}
      </View>
    </View>
  );
}

function PlanCardContent({ plan, selected }: { plan: typeof PLANS[0]; selected: boolean }) {
  return (
    <View style={styles.planCardInner}>
      <View>
        <Text style={[styles.planLabel, selected && styles.planLabelSelected]}>
          {plan.label}
        </Text>
        <View style={styles.planPriceRow}>
          <Text style={[styles.planPrice, selected && styles.planPriceSelected]}>
            {plan.price}
          </Text>
          <Text style={[styles.planPeriod, selected && styles.planPeriodSelected]}>
            {plan.period}
          </Text>
        </View>
      </View>
      {plan.savings && (
        <View style={[styles.savingsBadge, selected && styles.savingsBadgeSelected]}>
          <Text style={[styles.savingsText, selected && styles.savingsTextSelected]}>
            {plan.savings}
          </Text>
        </View>
      )}
      {selected && (
        <View style={styles.checkCircle}>
          <Feather name="check" size={12} color="#7B61FF" />
        </View>
      )}
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
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 32,
    gap: 12,
  },
  crownIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#F6D365",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 36,
  },
  heroSubtitle: { color: "#8888BB", fontSize: 15, textAlign: "center", lineHeight: 22 },
  plansSection: { padding: 16, gap: 10 },
  planCard: {
    backgroundColor: "#10101E",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#1E1E3A",
    overflow: "hidden",
  },
  planCardSelected: { borderColor: "transparent" },
  planCardInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  planLabel: { color: "#8888BB", fontSize: 13, fontWeight: "600", marginBottom: 4 },
  planLabelSelected: { color: "rgba(255,255,255,0.8)" },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  planPrice: { color: "#fff", fontSize: 22, fontWeight: "800" },
  planPriceSelected: { color: "#fff" },
  planPeriod: { color: "#8888BB", fontSize: 13 },
  planPeriodSelected: { color: "rgba(255,255,255,0.7)" },
  savingsBadge: {
    backgroundColor: "#1E1E3A",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  savingsBadgeSelected: { backgroundColor: "rgba(255,255,255,0.2)" },
  savingsText: { color: "#7B61FF", fontSize: 12, fontWeight: "700" },
  savingsTextSelected: { color: "#fff" },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  featuresSection: { padding: 16 },
  featuresTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 16 },
  comparisonRow: {
    flexDirection: "row",
    backgroundColor: "#10101E",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E1E3A",
    padding: 16,
    gap: 16,
  },
  comparisonCol: { flex: 1, gap: 10 },
  dividerV: { width: 1, backgroundColor: "#1E1E3A" },
  colTitle: { color: "#8888BB", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  colTitlePro: { color: "#7B61FF", fontSize: 14, fontWeight: "700", marginBottom: 4 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  featureText: { color: "#fff", fontSize: 13, flex: 1 },
  featureTextMuted: { color: "#8888BB", fontSize: 13, flex: 1 },
  testimonialSection: {
    margin: 16,
    padding: 20,
    backgroundColor: "#10101E",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E3A",
    gap: 8,
  },
  testimonial: { color: "#ccc", fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  testimonialAuthor: { color: "#8888BB", fontSize: 13, fontWeight: "600" },
  footer: { padding: 16, gap: 10, borderTopWidth: 1, borderTopColor: "#1E1E3A" },
  alreadyPro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  alreadyProText: { color: "#43E97B", fontSize: 16, fontWeight: "700" },
  cancelText: { color: "#8888BB", fontSize: 13, textAlign: "center" },
});
