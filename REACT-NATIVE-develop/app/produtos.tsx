import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { initialProducts, type Product } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function ProductsScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [products, setProducts] = useState(initialProducts);
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  function addProduct() {
    const stockNumber = Number(stock);
    const priceNumber = Number(price.replace(',', '.'));

    if (!name.trim() || stockNumber < 0 || !Number.isFinite(stockNumber) || priceNumber <= 0) {
      Alert.alert('Dados inválidos', 'Informe nome, estoque e preço válidos.');
      return;
    }

    const product: Product = {
      id: `product-${Date.now()}`,
      name: name.trim(),
      stock: stockNumber,
      cost: 0,
      price: priceNumber,
    };

    setProducts((current) => [...current, product]);
    setName('');
    setStock('');
    setPrice('');
  }

  function changeStock(id: string, amount: number) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, stock: Math.max(0, product.stock + amount) }
          : product,
      ),
    );
  }

  function removeProduct(id: string) {
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  const totalStock = products.reduce((total, product) => total + product.stock, 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>ESTOQUE</Text>
        <Text style={[styles.title, { color: colors.text }]}>Produtos</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Controle os produtos vendidos e as quantidades disponíveis.</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{products.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Produtos</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{totalStock}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Itens em estoque</Text>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Novo produto</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Nome do produto" placeholderTextColor={colors.placeholder} style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <View style={styles.row}>
            <TextInput value={stock} onChangeText={setStock} placeholder="Estoque" placeholderTextColor={colors.placeholder} keyboardType="number-pad" style={[styles.input, styles.flex, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
            <TextInput value={price} onChangeText={setPrice} placeholder="Preço" placeholderTextColor={colors.placeholder} keyboardType="decimal-pad" style={[styles.input, styles.flex, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          </View>
          <Pressable onPress={addProduct} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Adicionar produto</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {products.map((product) => (
            <View key={product.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{product.name}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>Estoque: {product.stock} unidade(s)</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
              <View style={styles.actions}>
                <Pressable onPress={() => changeStock(product.id, 1)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, { color: colors.text }]}>+ Entrada</Text>
                </Pressable>
                <Pressable onPress={() => changeStock(product.id, -1)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, { color: colors.text }]}>- Saída</Text>
                </Pressable>
                <Pressable onPress={() => removeProduct(product.id)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, styles.dangerText]}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
