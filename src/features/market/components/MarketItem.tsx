import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { CryptoItem } from "../utils/mockData";

interface Props {
  item: CryptoItem;
  onPress: (id: string) => void;
}

const MarketItem = React.memo(({ item, onPress }: Props) => {
  const isPositive = item.changePercent >= 0;
  const flashValue = useSharedValue(0);

  // El parpadeo ocurre porque TanStack Query refresca los datos (polling)
  useEffect(() => {
    flashValue.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 400 }),
    );
  }, [item.price]); // Se dispara cada vez que el precio cambia

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      flashValue.value,
      [0, 1],
      [
        "#000",
        isPositive ? "rgba(74, 222, 128, 0.15)" : "rgba(248, 113, 113, 0.15)",
      ],
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.container, animatedContainerStyle]}
    >
      <Pressable style={styles.content} onPress={() => onPress(item.id)}>
        <View style={styles.row}>
          {/* @ts-ignore */}
          <Animated.View
            sharedTransitionTag={`image-${item.id}`}
            style={styles.iconPlaceholder}
          >
            <Text style={styles.iconText}>{item.symbol[0]}</Text>
          </Animated.View>

          <View style={styles.leftColumn}>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.price}>
            $
            {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <Text
            style={[
              styles.change,
              { color: isPositive ? "#4ADE80" : "#F87171" },
            ]}
          >
            {isPositive ? "+" : ""}
            {item.changePercent.toFixed(2)}%
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 85, // Un poco más alto para dar aire
    borderBottomWidth: 0.5,
    borderBottomColor: "#111",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  row: { flexDirection: "row", alignItems: "center" },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 14, // Efecto Squircle/iOS
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  iconText: { color: "#FFF", fontWeight: "bold", fontSize: 18 },
  leftColumn: { justifyContent: "center" },
  rightColumn: { alignItems: "flex-end" },
  symbol: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  name: { color: "#888", fontSize: 12, marginTop: 2 },
  price: { color: "#FFF", fontSize: 17, fontWeight: "700" },
  change: { fontSize: 14, fontWeight: "600", marginTop: 2 },
});

export default MarketItem;
