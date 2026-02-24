import React, { useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MOCK_DATA } from "../../market/utils/mockData"; // Importamos los datos para buscar el nombre
import { generateChartData } from "../types/chart";
import { InteractiveChart } from "./InteractiveChart";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const DetailScreen = ({
  onBack,
  coinId,
}: {
  onBack: () => void;
  coinId: string;
}) => {
  const insets = useSafeAreaInsets();

  // Buscamos la moneda en nuestro MOCK_DATA usando el ID
  const coin = React.useMemo(
    () => MOCK_DATA.find((item) => item.id === coinId),
    [coinId],
  );

  const chartData = React.useMemo(() => generateChartData(60), []);
  const activePrice = useSharedValue(coin?.price || 0);

  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [onBack]);

  const animatedPriceProps = useAnimatedProps(
    () =>
      ({
        text: `$${activePrice.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      }) as any,
  );

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>

        <Animated.View style={styles.largeIcon}>
          {/* Mostramos la primera letra del Símbolo real (ej: B de BTC) */}
          <Text style={styles.largeIconText}>
            {coin?.symbol?.charAt(0) || "?"}
          </Text>
        </Animated.View>

        <View>
          <Text style={styles.title}>Detalle del Activo</Text>
          {/* CAMBIO AQUÍ: Ahora muestra el nombre real (Bitcoin) en lugar del ID */}
          <Text style={styles.subtitle}>{coin?.name || "Cargando..."}</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <AnimatedTextInput
          editable={false}
          underlineColorAndroid="transparent"
          style={styles.mainPrice}
          animatedProps={animatedPriceProps}
          defaultValue={`$${(coin?.price || 0).toLocaleString()}`}
        />
        <Text
          style={[
            styles.changeText,
            { color: (coin?.changePercent || 0) >= 0 ? "#4ADE80" : "#F87171" },
          ]}
        >
          {(coin?.changePercent || 0) >= 0 ? "+" : ""}
          {coin?.changePercent.toFixed(2)}% hoy
        </Text>
      </View>

      <InteractiveChart data={chartData} externalPrice={activePrice} />

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Símbolo</Text>
          <Text style={styles.statValue}>{coin?.symbol}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Market Cap</Text>
          <Text style={styles.statValue}>$1.2T</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  backButton: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  largeIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  largeIconText: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  title: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  subtitle: { color: "#4ADE80", fontSize: 14, fontWeight: "600" }, // Estilo mejorado para el nombre
  priceContainer: { paddingHorizontal: 20, marginVertical: 30 },
  mainPrice: { color: "#FFF", fontSize: 42, fontWeight: "800", padding: 0 },
  changeText: { fontSize: 18, fontWeight: "600" },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 16,
    width: "48%",
    borderWidth: 1,
    borderColor: "#222",
  },
  statLabel: { color: "#666", fontSize: 12, marginBottom: 5 },
  statValue: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
