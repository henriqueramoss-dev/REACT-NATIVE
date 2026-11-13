#!/usr/bin/env node
/**
 * Roda o app em um emulador Android que já existe no seu computador (criado no Android Studio).
 *
 *   npm run android:emulador              abre o emulador (se preciso) e inicia o app nele
 *   npm run android:emulador -- --lista   só mostra os emuladores encontrados
 *   AVD=Pixel_7_API_34 npm run android:emulador   escolhe um emulador pelo nome
 *
 * Não instala nada e não altera o app: só acha o SDK, sobe o emulador e chama `expo start --android`.
 */
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const windows = process.platform === 'win32';
const exe = (nome) => (windows ? `${nome}.exe` : nome);
const log = (...a) => console.log('[android]', ...a);
const falhar = (msg) => { console.error(`\n[android] ${msg}\n`); process.exit(1); };

// 1. Onde está o Android SDK?
function acharSdk() {
  const candidatos = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    windows && process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk'),
    process.platform === 'darwin' && path.join(os.homedir(), 'Library', 'Android', 'sdk'),
    path.join(os.homedir(), 'Android', 'Sdk'),
  ].filter(Boolean);
  return candidatos.find((c) => fs.existsSync(path.join(c, 'platform-tools')));
}

const sdk = acharSdk();
if (!sdk) {
  falhar('Android SDK não encontrado.\n'
    + '  Instale o Android Studio (ele baixa o SDK) ou defina ANDROID_HOME com a pasta do SDK.\n'
    + '  Windows: normalmente C:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk');
}
const adb = path.join(sdk, 'platform-tools', exe('adb'));
const emulador = path.join(sdk, 'emulator', exe('emulator'));
log('SDK:', sdk);

function rodar(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return r.error ? '' : `${r.stdout ?? ''}`;
}

// 2. Quais emuladores existem e quais já estão ligados?
const avds = fs.existsSync(emulador) ? rodar(emulador, ['-list-avds']).split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
const ligados = () => rodar(adb, ['devices']).split(/\r?\n/).slice(1).filter((l) => /^emulator-\d+\s+device/.test(l));

if (process.argv.includes('--lista')) {
  log('Emuladores (AVDs):', avds.length ? avds.join(', ') : 'nenhum');
  log('Ligados agora:', ligados().length ? ligados().join(', ') : 'nenhum');
  process.exit(0);
}

function esperarBoot() {
  log('Esperando o Android terminar de iniciar (pode levar 1 a 2 minutos)...');
  spawnSync(adb, ['wait-for-device']);
  const limite = Date.now() + 180_000;
  while (Date.now() < limite) {
    if (rodar(adb, ['shell', 'getprop', 'sys.boot_completed']).trim() === '1') return;
    spawnSync(windows ? 'ping' : 'sleep', windows ? ['-n', '3', '127.0.0.1'] : ['2'], { stdio: 'ignore' });
  }
  falhar('O emulador não terminou de iniciar em 3 minutos. Abra-o pelo Android Studio e tente de novo.');
}

// 3. Liga o emulador, se nenhum estiver ligado.
if (ligados().length) {
  log('Emulador já ligado:', ligados()[0].split(/\s+/)[0]);
} else {
  if (!avds.length) {
    falhar('Nenhum emulador encontrado.\n  No Android Studio: More Actions > Virtual Device Manager > Create Device.');
  }
  const escolhido = process.env.AVD || avds[0];
  if (!avds.includes(escolhido)) falhar(`Emulador "${escolhido}" não existe. Disponíveis: ${avds.join(', ')}`);
  log('Abrindo o emulador:', escolhido);
  spawn(emulador, ['-avd', escolhido], { detached: true, stdio: 'ignore' }).unref();
  esperarBoot();
}

// 4. Inicia o app (o Expo instala o Expo Go no emulador, se faltar, e abre o app).
log('Iniciando o app no emulador...');
const expo = spawn('npx', ['expo', 'start', '--android'], { stdio: 'inherit', shell: true, env: { ...process.env, ANDROID_HOME: sdk } });
expo.on('exit', (codigo) => process.exit(codigo ?? 0));
