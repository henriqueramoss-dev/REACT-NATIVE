import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { initialBarberServices, type BarberService } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function BarberServicesScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [services, setServices] = useState(initialBarberServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  function clearForm() {
    setEditingId(null);
    setName('');
    setDuration('');
    setPrice('');
  }

  function saveService() {
    const durationNumber = Number(duration);
    const priceNumber = Number(price.replace(',', '.'));

    if (!name.trim() || durationNumber <= 0 || priceNumber <= 0) {
      Alert.alert('Dados inválidos', 'Informe nome, duração e preço válidos.');
      return;
    }

    if (editingId) {
      setServices((current) =>
        current.map((service) =>
          service.id === editingId
            ? { ...service, name: name.trim(), duration: durationNumber, price: priceNumber }
            : service,
        ),
      );
    } else {
      const newService: BarberService = {
        id: `service-${Date.now()}`,
        name: name.trim(),
        duration: durationNumber,
        price: priceNumber,
        active: true,
      };

      setServices((current) => [...current, newService]);
    }

    clearForm();
  }

  function editService(service: BarberService) {
    setEditingId(service.id);
    setName(service.name);
    setDuration(String(service.duration));
    setPrice(String(service.price));
  }

  function toggleService(id: string) {
    setServices((current) =>
      current.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service,
      ),
    );
  }

  function removeService(id: string) {
    setServices((current) => current.filter((service) => service.id !== id));
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>GESTÃO DE SERVIÇOS</Text>
        <Text style={[styles.title, { color: colors.text }]}>Serviços da barbearia</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Cadastre, edite e ative os serviços oferecidos.</Text>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{editingId ? 'Editar serviço' : 'Novo serviço'}</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Nome do serviço" placeholderTextColor={colors.placeholder} style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <View style={styles.row}>
            <TextInput value={duration} onChangeText={setDuration} placeholder="Duração (min)" placeholderTextColor={colors.placeholder} keyboardType="number-pad" style={[styles.input, styles.flex, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
            <TextInput value={price} onChangeText={setPrice} placeholder="Preço" placeholderTextColor={colors.placeholder} keyboardType="decimal-pad" style={[styles.input, styles.flex, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          </View>
          <Pressable onPress={saveService} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{editingId ? 'Salvar alterações' : 'Adicionar serviço'}</Text>
          </Pressable>
          {editingId && (
            <Pressable onPress={clearForm} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
              <Text style={[styles.smallButtonText, { color: colors.textMuted }]}>Cancelar edição</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.list}>
          {services.map((service) => (
            <View key={service.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{service.name}</Text>
                <View style={[styles.badge, !service.active && styles.badgeMuted]}>
                  <Text style={styles.badgeText}>{service.active ? 'Ativo' : 'Inativo'}</Text>
                </View>
              </View>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{service.duration} minutos</Text>
              <Text style={[styles.cardValue, { color: colors.text }]}>R$ {service.price.toFixed(2).replace('.', ',')}</Text>
              <View style={styles.actions}>
                <Pressable onPress={() => editService(service)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, { color: colors.text }]}>Editar</Text>
                </Pressable>
                <Pressable onPress={() => toggleService(service.id)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, { color: colors.text }]}>{service.active ? 'Desativar' : 'Ativar'}</Text>
                </Pressable>
                <Pressable onPress={() => removeService(service.id)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, styles.dangerText]}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.notice, { color: colors.placeholder }]}>Alterações locais de demonstração. Depois podem ser conectadas ao Supabase.</Text>
      </ScrollView>
    </View>
  );
}
