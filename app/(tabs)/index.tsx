import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DetailScreen } from "../../src/features/details/components/DetailScreen";
import { useMarketData } from "../../src/features/market/api/useMarketData";
import MarketItem from "../../src/features/market/components/MarketItem";
import { MarketSkeleton } from "../../src/features/market/components/MarketSkeleton";
import { CryptoItem } from "../../src/features/market/utils/mockData";

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data = [], isLoading } = useMarketData();

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    return data.filter(
      (item) =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: CryptoItem }) => (
      <MarketItem item={item} onPress={(id) => setSelectedCoinId(id)} />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {/* CAPA 1: La Lista (Siempre montada para permitir Shared Element) */}
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Market</Text>
            <Text style={styles.subtitle}>1,000 Activos Live</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar moneda o símbolo..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        <View style={{ flex: 1 }}>
          {isLoading && (!data || data.length === 0) ? (
            <MarketSkeleton />
          ) : (
            <FlashList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingBottom: insets.bottom + 20,
                paddingHorizontal: 4,
              }}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No se encontraron resultados
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>

      {/* CAPA 2: Detalle (Se monta encima con absoluteFill) */}
      {selectedCoinId && (
        <View style={StyleSheet.absoluteFill}>
          <DetailScreen
            coinId={selectedCoinId}
            onBack={() => setSelectedCoinId(null)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#FFF", fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  subtitle: {
    color: "#4ADE80",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchInput: {
    backgroundColor: "#121212",
    color: "#FFF",
    height: 50,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: "center",
  },
  emptyText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "500",
  },
});
