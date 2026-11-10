import { useEffect } from "react"
import { StatusBar } from "expo-status-bar"
import { ThemeProvider } from "styled-components/native"
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { AppThemeProvider, useAppTheme } from "./src/contexts/theme-context"
import { AuthProvider, useAuth } from "./src/contexts/auth-context"
import { PreferenciasProvider } from "./src/contexts/preferencias-context"

import HeaderActions from "./src/components/header-actions"
import HeaderBrand from "./src/components/header-brand"
import HeaderCliente from "./src/components/header-cliente"

import Inicio from "./src/screens/inicio"
import Login from "./src/screens/login"
import Cadastro from "./src/screens/cadastro"
import Catalogo from "./src/screens/catalogo"
import LivroCliente from "./src/screens/livro-cliente"
import MinhasReservas from "./src/screens/minhas-reservas"
import Painel from "./src/screens/painel"
import Emprestimos from "./src/screens/emprestimos"
import Livros from "./src/screens/livros"
import LivroDetalhes from "./src/screens/livro-detalhes"
import Autores from "./src/screens/autores"
import Categorias from "./src/screens/categorias"
import Usuarios from "./src/screens/usuarios"
import Carteirinhas from "./src/screens/carteirinhas"
import Formulario from "./src/screens/formulario"
import Configuracoes from "./src/screens/configuracoes"



const Stack = createNativeStackNavigator()

// Referência para navegar de fora das telas (ex.: quando a sessão termina)
const navigationRef = createNavigationContainerRef()


// As cores (claro/escuro) chegam às telas pelo ThemeProvider do styled-components.
const Navigation = () => {

    const { colors } = useAppTheme()
    const { sessao, ehFuncionario, carregado, aviso, sair } = useAuth()

    // A SESSÃO TERMINOU POR CONTA DA API (CHAVE REVOGADA OU API REINICIADA): VOLTA PARA A TELA DE ENTRADA
    useEffect(() => {

        if (aviso && navigationRef.isReady()) navigationRef.reset({ index: 0, routes: [{ name: "Login" }] })

    }, [aviso])

    // ESPERA O APP LER A SESSÃO SALVA: A EQUIPE ABRE NO PAINEL E OS CLIENTES NO CATÁLOGO
    if (!carregado) return null

    return (
        <ThemeProvider theme={{ colors }}>

            <StatusBar style="light" />

            <NavigationContainer ref={navigationRef}>

                <Stack.Navigator
                    initialRouteName={!sessao ? "Inicio" : ehFuncionario ? "Painel" : "Catalogo"}
                    screenOptions={{
                        // CABEÇALHO AZUL-MARINHO, COMO O MENU LATERAL DO SITE
                        headerShadowVisible: false,
                        headerStyle: { backgroundColor: colors.header },
                        headerTintColor: colors.headerText,
                        headerTitleStyle: { fontWeight: "bold" },
                        contentStyle: { backgroundColor: colors.background }
                    }}
                >

                    <Stack.Screen
                        name="Inicio"
                        component={Inicio}
                        options={{ headerShown: false }}
                    />

                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ title: "Entrar" }}
                    />

                    <Stack.Screen
                        name="Cadastro"
                        component={Cadastro}
                        options={{ title: "Cadastro" }}
                    />

                    <Stack.Screen
                        name="Catalogo"
                        component={Catalogo}
                        options={{
                            title: "Biblioteca",
                            headerTitle: () => <HeaderBrand />,
                            headerBackVisible: false,
                            headerLeft: () => null,
                            headerRight: () => <HeaderCliente />
                        }}
                    />

                    <Stack.Screen
                        name="LivroCliente"
                        component={LivroCliente}
                        options={{ title: "Livro" }}
                    />

                    <Stack.Screen
                        name="MinhasReservas"
                        component={MinhasReservas}
                        options={{ title: "Minhas reservas" }}
                    />

                    <Stack.Screen
                        name="Painel"
                        component={Painel}
                        options={({ navigation }) => ({
                            title: "Biblioteca",
                            headerTitle: () => <HeaderBrand />,
                            headerBackVisible: false,
                            headerLeft: () => null,
                            headerRight: () => (
                                <HeaderActions
                                    onSettings={() => navigation.navigate("Configuracoes")}
                                    onExit={async () => {
                                        await sair()
                                        navigation.reset({ index: 0, routes: [{ name: "Inicio" }] })
                                    }}
                                />
                            )
                        })}
                    />

                    <Stack.Screen
                        name="Emprestimos"
                        component={Emprestimos}
                        options={{ title: "Empréstimos" }}
                    />

                    <Stack.Screen
                        name="Livros"
                        component={Livros}
                        options={{ title: "Livros" }}
                    />

                    <Stack.Screen
                        name="LivroDetalhes"
                        component={LivroDetalhes}
                        options={{ title: "Detalhes do livro" }}
                    />

                    <Stack.Screen
                        name="Autores"
                        component={Autores}
                        options={{ title: "Autores" }}
                    />

                    <Stack.Screen
                        name="Categorias"
                        component={Categorias}
                        options={{ title: "Categorias" }}
                    />

                    <Stack.Screen
                        name="Usuarios"
                        component={Usuarios}
                        options={{ title: "Usuários" }}
                    />

                    <Stack.Screen
                        name="Carteirinhas"
                        component={Carteirinhas}
                        options={{ title: "Carteirinhas" }}
                    />

                    <Stack.Screen
                        name="Configuracoes"
                        component={Configuracoes}
                        options={{ title: "Configurações" }}
                    />

                    <Stack.Screen
                        name="Formulario"
                        component={Formulario}
                        options={{ title: "" }}
                    />

                </Stack.Navigator>

            </NavigationContainer>

        </ThemeProvider>
    )
}


export default function App() {

    return (
        <AppThemeProvider>
            <AuthProvider>
                <PreferenciasProvider>
                    <Navigation />
                </PreferenciasProvider>
            </AuthProvider>
        </AppThemeProvider>
    )
}
