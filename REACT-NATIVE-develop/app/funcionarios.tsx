import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { initialStaff, type StaffMember } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function StaffScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [staff, setStaff] = useState(initialStaff);
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');

  function addStaff() {
    if (!name.trim() || !specialty.trim() || !phone.trim()) {
      Alert.alert('Campos incompletos', 'Preencha nome, especialidade e telefone.');
      return;
    }

    const member: StaffMember = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      specialty: specialty.trim(),
      phone: phone.trim(),
      active: true,
    };

    setStaff((current) => [...current, member]);
    setName('');
    setSpecialty('');
    setPhone('');
  }

  function toggleStaff(id: string) {
    setStaff((current) =>
      current.map((member) =>
        member.id === id ? { ...member, active: !member.active } : member,
      ),
    );
  }

  function removeStaff(id: string) {
    setStaff((current) => current.filter((member) => member.id !== id));
  }

  const activeCount = staff.filter((member) => member.active).length;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>EQUIPE</Text>
        <Text style={[styles.title, { color: colors.text }]}>Funcionários</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Cadastre profissionais e controle quem está ativo na barbearia.</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{staff.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Cadastrados</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{activeCount}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Ativos</Text>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Novo funcionário</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Nome" placeholderTextColor={colors.placeholder} style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <TextInput value={specialty} onChangeText={setSpecialty} placeholder="Especialidade" placeholderTextColor={colors.placeholder} style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <TextInput value={phone} onChangeText={setPhone} placeholder="Telefone" placeholderTextColor={colors.placeholder} keyboardType="phone-pad" style={[styles.input, { color: colors.text, borderColor: colors.borderStrong, backgroundColor: colors.background }]} />
          <Pressable onPress={addStaff} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Adicionar funcionário</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {staff.map((member) => (
            <View key={member.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{member.name}</Text>
                <View style={[styles.badge, !member.active && styles.badgeMuted]}>
                  <Text style={styles.badgeText}>{member.active ? 'Ativo' : 'Inativo'}</Text>
                </View>
              </View>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{member.specialty}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{member.phone}</Text>
              <View style={styles.actions}>
                <Pressable onPress={() => toggleStaff(member.id)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
                  <Text style={[styles.smallButtonText, { color: colors.text }]}>{member.active ? 'Desativar' : 'Ativar'}</Text>
                </Pressable>
                <Pressable onPress={() => removeStaff(member.id)} style={[styles.smallButton, { borderColor: colors.borderStrong }]}>
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
