import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useChartLogic } from "../hooks/useChartLogic";

const { width } = Dimensions.get("window");
const CHART_HEIGHT = 250;

// Definimos la interfaz para los Props incluyendo externalPrice
interface Props {
  data: any[];
  externalPrice?: Animated.SharedValue<number>;
}

export const InteractiveChart = ({ data, externalPrice }: Props) => {
  const { path, points } = useChartLogic(data, width, CHART_HEIGHT);

  const touchX = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Encontrar el punto más cercano al dedo
  const activePoint = useDerivedValue(() => {
    if (points.length === 0) return { x: 0, y: 0, value: 0 };

    // Cálculo del índice basado en la posición X del toque
    const index = Math.max(
      0,
      Math.min(
        Math.floor((touchX.value / width) * (points.length - 1)),
        points.length - 1,
      ),
    );
    return points[index];
  });

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      opacity.value = withTiming(1);
      touchX.value = e.x;
    })
    .onUpdate((e) => {
      touchX.value = e.x;

      // Actualizamos el SharedValue externo si existe
      if (externalPrice) {
        externalPrice.value = activePoint.value.value;
      }
    })
    .onEnd(() => {
      opacity.value = withTiming(0);
    });

  // Estilo animado para la línea vertical de guía
  const indicatorLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activePoint.value.x }],
    opacity: opacity.value,
  }));

  const skiaPath = Skia.Path.MakeFromSVGString(path);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View>
          <Canvas style={{ width, height: CHART_HEIGHT }}>
            {/* Dibujado de la línea del gráfico */}
            <Path
              path={skiaPath!}
              style="stroke"
              strokeWidth={3}
              color="#4ADE80"
              strokeCap="round"
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(width, 0)}
                colors={["#4ADE80", "#2DD4BF"]}
              />
            </Path>

            {/* Punto interactivo (Cursor) */}
            <Group opacity={opacity}>
              <Circle
                cx={useDerivedValue(() => activePoint.value.x)}
                cy={useDerivedValue(() => activePoint.value.y)}
                r={6}
                color="#FFF"
              />
              <Circle
                cx={useDerivedValue(() => activePoint.value.x)}
                cy={useDerivedValue(() => activePoint.value.y)}
                r={12}
                color="rgba(74, 222, 128, 0.3)"
              />
            </Group>
          </Canvas>

          {/* Línea vertical de guía */}
          <Animated.View style={[styles.cursorLine, indicatorLineStyle]} />
        </View>
      </GestureDetector>

      <Animated.View style={[styles.labelContainer, { opacity }]}>
        <Text style={styles.labelText}>Desliza para explorar el histórico</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    paddingVertical: 20,
  },
  cursorLine: {
    position: "absolute",
    width: 1,
    height: CHART_HEIGHT,
    backgroundColor: "rgba(255,255,255,0.2)",
    top: 0,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  labelText: {
    color: "#444",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
