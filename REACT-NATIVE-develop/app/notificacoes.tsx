import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useAppTheme } from '@/contexts/theme-context';
import { initialNotifications } from '@/data/barber-management';
import styles from '@/styles/management.styles';

export default function NotificationsScreen() {
  const { colors, resolvedMode } = useAppTheme();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  function markAsRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: colors.goldText }]}>AVISOS</Text>
        <Text style={[styles.title, { color: colors.text }]}>Notificações</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>Acompanhe os avisos da barbearia e escolha como deseja recebê-los.</Text>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferências</Text>
          <View style={styles.switchRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Notificações no aplicativo</Text>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={styles.switchRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Avisos por e-mail</Text>
            <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
          </View>
        </View>

        <View style={[styles.cardHeader, { marginTop: 22 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{unreadCount} não lida(s)</Text>
          {unreadCount > 0 && (
            <Pressable onPress={markAllAsRead}>
              <Text style={{ color: colors.goldText, fontWeight: '800' }}>Marcar todas como lidas</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.list}>
          {notifications.map((notification) => (
            <Pressable
              key={notification.id}
              onPress={() => markAsRead(notification.id)}
              style={[
                styles.card,
                !notification.read && styles.notificationUnread,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>{notification.title}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{notification.message}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.placeholder }]}>{notification.time}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
