import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  beforeUri: string;
  afterUri: string;
}

export function BeforeAfterSlider({ beforeUri, afterUri }: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [sliderX, setSliderX] = useState<number | null>(null);

  const effectiveSliderX = sliderX ?? containerWidth / 2;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        setSliderX((prev) => {
          const base = prev ?? containerWidth / 2;
          const next = Math.max(10, Math.min(containerWidth - 10, base + gs.dx));
          return next;
        });
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        setContainerWidth(w);
        if (sliderX === null) setSliderX(w / 2);
      }}
    >
      {containerWidth > 0 && (
        <>
          <Image source={{ uri: afterUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />

          <View
            style={[
              StyleSheet.absoluteFill,
              { overflow: "hidden", width: effectiveSliderX },
            ]}
          >
            <Image
              source={{ uri: beforeUri }}
              style={{ width: containerWidth, height: "100%" }}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.divider, { left: effectiveSliderX - 1 }]} />

          <View
            style={[styles.handleWrap, { left: effectiveSliderX - 22 }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.handle}>
              <Feather name="chevron-left" size={14} color="#fff" />
              <Feather name="chevron-right" size={14} color="#fff" />
            </View>
          </View>

          <View style={[styles.badge, { left: 12 }]}>
            <Text style={styles.badgeText}>BEFORE</Text>
          </View>
          <View style={[styles.badge, { right: 12 }]}>
            <Text style={styles.badgeText}>AFTER</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 340,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#10101E",
  },
  divider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#fff",
  },
  handleWrap: {
    position: "absolute",
    top: "50%",
    marginTop: -22,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7B61FF",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#7B61FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    top: 12,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
