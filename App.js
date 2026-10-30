import { StatusBar } from "expo-status-bar"
import { ThemeProvider } from "styled-components/native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { AppThemeProvider, useAppTheme } from "./src/contexts/theme-context"
import { AuthProvider, useAuth } from "./src/contexts/auth-context"
import { PreferenciasProvider } from "./src/contexts/preferencias-context"

import HeaderActions from "./src/components/header-actions"
import HeaderBrand from "./src/components/header-brand"

import Inicio from "./src/screens/inicio"
import Login from "./src/screens/login"
import Cadastro from "./src/screens/cadastro"
import Painel from "./src/screens/painel"
import Emprestimos from "./src/screens/emprestimos"
import Livros from "./src/screens/livros"
import LivroDetalhes from "./src/screens/livro-detalhes"
import Autores from "./src/screens/autores"
import Categorias from "./src/screens/categorias"
import Usuarios from "./src/screens/usuarios"
import Perfis from "./src/screens/perfis"
import Formulario from "./src/screens/formulario"
import Configuracoes from "./src/screens/configuracoes"



const Stack = createNativeStackNavigator()


// As cores (claro/escuro) chegam às telas pelo ThemeProvider do styled-components.
const Navigation = () => {

    const { colors } = useAppTheme()
    const { usuario, carregado, sair } = useAuth()

    // ESPERA O APP LER O USUÁRIO SALVO: QUEM JÁ ENTROU ABRE DIRETO NO PAINEL
    if (!carregado) return null

    return (
        <ThemeProvider theme={{ colors }}>

            <StatusBar style="light" />

            <NavigationContainer>

                <Stack.Navigator
                    initialRouteName={usuario ? "Painel" : "Inicio"}
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
                                    onExit={() => {
                                        sair()
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
                        name="Perfis"
                        component={Perfis}
                        options={{ title: "Perfis" }}
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
