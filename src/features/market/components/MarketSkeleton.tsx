import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const SkeletonItem = () => {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration: 1500 }),
      -1, // Infinito
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.itemContainer}>
      {/* Icono Skeleton */}
      <View style={styles.iconSkeleton} />

      {/* Textos Skeleton */}
      <View style={styles.textColumn}>
        <View style={styles.titleSkeleton} />
        <View style={styles.subtitleSkeleton} />
      </View>

      {/* Precio Skeleton */}
      <View style={styles.priceColumn}>
        <View style={styles.titleSkeleton} />
        <View style={styles.subtitleSkeleton} />
      </View>

      {/* El Brillo (Shimmer) */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <ExpoLinearGradient
          colors={["transparent", "rgba(255,255,255,0.08)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const MarketSkeleton = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {[...Array(10)].map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 85,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#111",
    overflow: "hidden",
  },
  iconSkeleton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1A1A1A",
    marginRight: 15,
  },
  textColumn: { flex: 1 },
  priceColumn: { alignItems: "flex-end" },
  titleSkeleton: {
    width: 80,
    height: 14,
    backgroundColor: "#1A1A1A",
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitleSkeleton: {
    width: 50,
    height: 10,
    backgroundColor: "#1A1A1A",
    borderRadius: 4,
  },
});
