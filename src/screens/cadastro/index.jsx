
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import BrandMark from "../../components/brand-mark"
import { useAppTheme } from "../../contexts/theme-context"
import { useAuth } from "../../contexts/auth-context"
import { create } from "../../services/biblioteca-api"
import { RESOURCES, TIPO_USUARIO_OPTIONS, validate } from "../../services/resources"
import { brToIso, maskDate } from "../../utils/dates"
import { avisar } from "../../utils/dialogs"

import {
    Container,
    Content,
    Brand,
    BrandName,
    Title,
    Description,
    Form,
    Input,
    Options,
    Option,
    OptionText,
    Row,
    UfInput,
    CepInput,
    Btn,
    BtnTitle,
    AccountText,
    LoginLink,
    Notice
} from "./style"

const Cadastro = () => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()
    const { guardar } = useAuth()

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [cpf, setCpf] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmacao, setConfirmacao] = useState("")
    const [tipo, setTipo] = useState("ALUNO")
    const [telefone, setTelefone] = useState("")
    const [endereco, setEndereco] = useState("")
    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [cep, setCep] = useState("")
    const [dataNascimento, setDataNascimento] = useState("")
    const [carregando, setCarregando] = useState(false)

    // ABRIR O PAINEL DEPOIS DE CADASTRAR
    const abrirPainel = () => {
        navigation.replace("Painel")
    }

    // ABRIR TELA DE LOGIN
    const handleLogin = () => {
        navigation.navigate("Login")
    }

    // USA A MENSAGEM DO PRIMEIRO CAMPO RECUSADO PELA API, QUANDO HOUVER
    const mensagemDoErro = (erro, padrao) => {

        if (!erro || !erro.message) return padrao

        const primeiro = erro.campos && Object.values(erro.campos)[0]

        return primeiro || erro.message
    }

    // CRIA O USUÁRIO E, EM SEGUIDA, O PERFIL DELE NA API
    const handleSignUp = async () => {

        // AS MESMAS REGRAS DOS FORMULÁRIOS DE USUÁRIOS E PERFIS (src/services/resources.ts)
        const nascimentoIso = brToIso(dataNascimento) ?? dataNascimento

        const erros = {
            ...validate(RESOURCES.usuarios, { nome, email, cpf, tipo }),
            // O USUÁRIO AINDA NÃO EXISTE: UM ID QUALQUER SÓ FAZ O CAMPO "USUÁRIO" PASSAR NA VALIDAÇÃO
            ...validate(RESOURCES.perfis, {
                usuarioId: "0",
                telefone,
                endereco,
                cidade,
                estado,
                cep,
                dataNascimento: nascimentoIso
            })
        }

        // A SENHA NÃO FAZ PARTE DO RESOURCE: CONFERE AQUI
        if (senha.length < 8 || senha.length > 72) erros.senha = "A senha deve ter de 8 a 72 caracteres."
        else if (senha !== confirmacao) erros.confirmacao = "A confirmação não é igual à senha."

        const primeiroErro = Object.values(erros)[0]

        if (primeiroErro) {
            avisar("Confira os dados", primeiroErro)
            return
        }

        setCarregando(true)

        // 1º PASSO: CRIA O USUÁRIO
        let usuario

        try {

            usuario = await create("usuarios", {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                cpf: cpf,
                tipo: tipo,
                senha: senha
            })

        } catch (erro) {

            setCarregando(false)
            avisar("Erro no cadastro", mensagemDoErro(erro, "Não foi possível realizar o cadastro."))
            return
        }

        // O USUÁRIO JÁ EXISTE: A CONTA FICA LOGADA MESMO SE O PERFIL FALHAR
        guardar(usuario)

        // 2º PASSO: CRIA O PERFIL LIGADO A ESSE USUÁRIO
        try {

            await create("perfis", {
                usuarioId: usuario.id,
                telefone: telefone.trim(),
                endereco: endereco.trim(),
                cidade: cidade.trim(),
                estado: estado,
                cep: cep,
                dataNascimento: nascimentoIso
            })

            avisar("Cadastro realizado", "Usuário e perfil foram cadastrados na API.", abrirPainel)

        } catch (erro) {

            avisar(
                "Perfil não cadastrado",
                `O usuário foi criado, mas o perfil não pôde ser salvo (${mensagemDoErro(erro, "Erro desconhecido.")}). Complete-o pela tela Perfis.`,
                abrirPainel
            )

        } finally {
            setCarregando(false)
        }
    }

    return (
        <Container>

            <Content keyboardShouldPersistTaps="handled">

                <Brand>

                    <BrandMark />

                    <BrandName>
                        Biblioteca
                    </BrandName>

                </Brand>

                <Title>
                    Criar conta
                </Title>

                <Description>
                    Cadastre-se como leitor da biblioteca.
                </Description>

                <Form>

                    <Input
                        placeholder="Nome completo"
                        placeholderTextColor={colors.placeholder}
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Input
                        placeholder="E-mail"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Input
                        placeholder="CPF (somente números)"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="number-pad"
                        value={cpf}
                        onChangeText={(texto) => setCpf(texto.replace(/\D/g, "").slice(0, 11))}
                    />

                    <Input
                        placeholder="Senha (de 8 a 72 caracteres)"
                        placeholderTextColor={colors.placeholder}
                        secureTextEntry
                        autoCapitalize="none"
                        value={senha}
                        onChangeText={setSenha}
                    />

                    <Input
                        placeholder="Confirmar senha"
                        placeholderTextColor={colors.placeholder}
                        secureTextEntry
                        autoCapitalize="none"
                        value={confirmacao}
                        onChangeText={setConfirmacao}
                    />

                    <Options>

                        {TIPO_USUARIO_OPTIONS.map((opcao) => {

                            const escolhida = tipo === opcao.value

                            return (
                                <Option
                                    key={opcao.value}
                                    $active={escolhida}
                                    onPress={() => setTipo(opcao.value)}
                                    accessibilityRole="radio"
                                    accessibilityState={{ checked: escolhida }}
                                >
                                    <OptionText $active={escolhida}>
                                        {opcao.label}
                                    </OptionText>
                                </Option>
                            )
                        })}

                    </Options>

                    <Input
                        placeholder="Telefone"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="phone-pad"
                        value={telefone}
                        onChangeText={setTelefone}
                    />

                    <Input
                        placeholder="Endereço"
                        placeholderTextColor={colors.placeholder}
                        value={endereco}
                        onChangeText={setEndereco}
                    />

                    <Input
                        placeholder="Cidade"
                        placeholderTextColor={colors.placeholder}
                        value={cidade}
                        onChangeText={setCidade}
                    />

                    <Row>

                        <UfInput
                            placeholder="UF"
                            placeholderTextColor={colors.placeholder}
                            autoCapitalize="characters"
                            maxLength={2}
                            value={estado}
                            onChangeText={(texto) => setEstado(texto.replace(/[^A-Za-z]/g, "").toUpperCase())}
                        />

                        <CepInput
                            placeholder="CEP (somente números)"
                            placeholderTextColor={colors.placeholder}
                            keyboardType="number-pad"
                            value={cep}
                            onChangeText={(texto) => setCep(texto.replace(/\D/g, "").slice(0, 8))}
                        />

                    </Row>

                    <Input
                        placeholder="Data de nascimento (DD/MM/AAAA)"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="number-pad"
                        maxLength={10}
                        value={dataNascimento}
                        onChangeText={(texto) => setDataNascimento(maskDate(texto))}
                    />

                    <Btn
                        onPress={handleSignUp}
                        disabled={carregando}
                    >

                        <BtnTitle>
                            {carregando ? "Cadastrando..." : "Cadastrar"}
                        </BtnTitle>

                    </Btn>

                </Form>

                <AccountText>
                    Já tem uma conta?{" "}
                    <LoginLink onPress={handleLogin}>
                        Entrar
                    </LoginLink>
                </AccountText>

                <Notice>
                    Sua senha é guardada na API só como hash. Não há recuperação por e-mail: guarde-a bem.
                </Notice>

            </Content>

        </Container>
    )
}

export default Cadastro
