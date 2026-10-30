// Caixas de diálogo (confirmar e avisar). JavaScript puro, sem tipos.

import { Alert, Platform } from 'react-native';

// No navegador (react-native-web) o Alert.alert com botões não aparece,
// por isso usamos window.confirm / window.alert quando o app roda na web.

export function confirmar(titulo, mensagem, textoConfirmar = 'Excluir') {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }

  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: textoConfirmar, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

export function avisar(titulo, mensagem, aoFechar) {
  let fechado = false;
  const fechar = () => {
    if (fechado) return;
    fechado = true;
    aoFechar?.();
  };

  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    fechar();
    return;
  }

  Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: fechar }], { onDismiss: fechar });
}
