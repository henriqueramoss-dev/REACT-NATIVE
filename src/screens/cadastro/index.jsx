
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import BrandMark from "../../components/brand-mark"
import { LivroAberto } from "../../components/ilustracoes"
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
    Ilustracao,
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

// A API só aceita Aluno e Visitante no cadastro aberto; funcionários e professores são cadastrados pela biblioteca.
const TIPOS_AUTOCADASTRO = ["ALUNO", "VISITANTE"]

const Cadastro = () => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()
    const { entrar } = useAuth()

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

    // DEPOIS DE CADASTRAR, ABRE O CATÁLOGO (CLIENTE)
    const abrirCatalogo = () => {
        navigation.reset({ index: 0, routes: [{ name: "Catalogo" }] })
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

    // CRIA O USUÁRIO NA API: UM ÚNICO ENVIO, COM TODOS OS DADOS (INCLUSIVE OS PESSOAIS)
    const handleSignUp = async () => {

        // AS MESMAS REGRAS DO FORMULÁRIO DE USUÁRIOS (src/services/resources.ts)
        const nascimentoIso = brToIso(dataNascimento) ?? dataNascimento

        const erros = validate(RESOURCES.usuarios, {
            nome,
            email,
            cpf,
            tipo,
            telefone,
            endereco,
            cidade,
            estado,
            cep,
            dataNascimento: nascimentoIso
        })

        // A SENHA NÃO FAZ PARTE DO RESOURCE: CONFERE AQUI
        if (senha.length < 8 || senha.length > 72) erros.senha = "A senha deve ter de 8 a 72 caracteres."
        else if (senha !== confirmacao) erros.confirmacao = "A confirmação não é igual à senha."

        const primeiroErro = Object.values(erros)[0]

        if (primeiroErro) {
            avisar("Confira os dados", primeiroErro)
            return
        }

        setCarregando(true)

        try {

            await create("usuarios", {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                cpf: cpf,
                tipo: tipo,
                telefone: telefone.trim(),
                endereco: endereco.trim(),
                cidade: cidade.trim(),
                estado: estado,
                cep: cep,
                dataNascimento: nascimentoIso,
                senha: senha
            })

            // A CONTA JÁ FICA LOGADA (O LOGIN GERA A CHAVE DE API); SE FALHAR, MANDA PARA A TELA DE ENTRADA
            try {

                await entrar(email, senha)

                avisar("Cadastro realizado", "Sua conta foi criada. Escolha seu próximo livro!", abrirCatalogo)

            } catch {

                avisar("Cadastro realizado", "Sua conta foi criada. Entre com seu e-mail e senha.", () => navigation.replace("Login"))
            }

        } catch (erro) {

            avisar("Erro no cadastro", mensagemDoErro(erro, "Não foi possível realizar o cadastro."))

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

                <Ilustracao>
                    <LivroAberto width={190} />
                </Ilustracao>

                <Title>
                    Criar conta
                </Title>

                <Description>
                    Crie sua conta de cliente para reservar livros e retirá-los na biblioteca.
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

                        {TIPO_USUARIO_OPTIONS.filter((opcao) => TIPOS_AUTOCADASTRO.includes(opcao.value)).map((opcao) => {

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
