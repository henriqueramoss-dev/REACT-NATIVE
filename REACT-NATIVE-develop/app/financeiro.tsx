import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { initialTransactions, type Transaction } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function FinanceScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  function addTransaction() {
    const amountNumber = Number(amount.replace(',', '.'));

    if (!description.trim() || amountNumber <= 0) {
      Alert.alert('Dados inválidos', 'Informe a descrição e um valor válido.');
      return;
    }

    const transaction: Transaction = {
      id: `transaction-${Date.now()}`,
      description: description.trim(),
      amount: amountNumber,
      type,
      date: 'Agora',
    };

    setTransactions((current) => [transaction, ...current]);
    setDescription('');
    setAmount('');
  }

  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  function money(value: number) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>CONTROLE FINANCEIRO</Text>
        <Text style={[styles.title, { color: colors.text }]}>Financeiro</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Acompanhe entradas, gastos e o resultado da operação.</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, styles.transactionIncome]}>{money(income)}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Receitas</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, styles.transactionExpense]}>{money(expenses)}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Gastos</Text>
          </View>
        </View>

        <View style={[styles.summaryCard, { marginTop: 10, backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{money(balance)}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Resultado</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Novo lançamento</Text>
          <View style={styles.row}>
            <Pressable onPress={() => setType('income')} style={[styles.smallButton, { borderColor: type === 'income' ? colors.gold : colors.borderStrong, backgroundColor: type === 'income' ? colors.surfaceMuted : colors.surface }]}>
              <Text style={[styles.smallButtonText, { color: colors.text }]}>Receita</Text>
            </Pressable>
            <Pressable onPress={() => setType('expense')} style={[styles.smallButton, { borderColor: type === 'expense' ? colors.gold : colors.borderStrong, backgroundColor: type === 'expense' ? colors.surfaceMuted : colors.surface }]}>
              <Text style={[styles.smallButtonText, { color: colors.text }]}>Gasto</Text>
            </Pressable>
          </View>
          <TextInput value={description} onChangeText={setDescription} placeholder="Descrição" placeholderTextColor={colors.placeholder} style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <TextInput value={amount} onChangeText={setAmount} placeholder="Valor" placeholderTextColor={colors.placeholder} keyboardType="decimal-pad" style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <Pressable onPress={addTransaction} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Adicionar lançamento</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{transaction.description}</Text>
                <Text style={[styles.cardValue, transaction.type === 'income' ? styles.transactionIncome : styles.transactionExpense]}>
                  {transaction.type === 'income' ? '+' : '-'} {money(transaction.amount)}
                </Text>
              </View>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{transaction.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
