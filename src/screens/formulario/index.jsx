
import { useEffect, useState } from "react"
import { Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"

import FormField from "../../components/form-field"
import { useAppTheme } from "../../contexts/theme-context"
import { create, get, remove, update } from "../../services/biblioteca-api"
import { isResourceKey, RESOURCES, validate } from "../../services/resources"
import { avisar, confirmar } from "../../utils/dialogs"
import { TELA_DA_LISTA } from "../../utils/rotas"

import {
    Container,
    Content,
    Message,
    Alert,
    AlertText,
    Card,
    Loader,
    FormActions,
    CancelButton,
    CancelButtonText,
    SaveButton,
    SaveButtonText,
    SavingIndicator,
    DeleteButton,
    DeleteButtonText
} from "./style"

// A API devolve erros de relacionamento pelo nome da entidade ("usuario");
// no formulário o campo se chama "usuarioId".
const API_FIELD_ALIASES = {
    usuario: "usuarioId",
    livro: "livroId",
    categoria: "categoriaId"
}

// Formulário de cadastro/edição de qualquer recurso.
// Parâmetros da rota: recurso (obrigatório), id (edição) e, opcionalmente,
// valores iniciais com o nome do campo (ex.: livroId=3).
const Formulario = () => {

    const navigation = useNavigation()
    const route = useRoute()
    const { colors } = useAppTheme()

    const params = route.params ?? {}

    const resource = isResourceKey(params.recurso) ? RESOURCES[params.recurso] : undefined

    const rawId = params.id ? Number(params.id) : undefined
    const invalidId = rawId !== undefined && (!Number.isInteger(rawId) || rawId < 1)
    const id = invalidId ? undefined : rawId
    const editing = id !== undefined

    const [values, setValues] = useState(() => {

        const initial = resource?.toForm() ?? {}

        resource?.fields.forEach((field) => {

            const preset = params[field.name]

            if (typeof preset === "string" && preset !== "") {
                initial[field.name] = field.type === "relations" ? preset.split(",") : preset
            }
        })

        return initial
    })

    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(editing)
    const [saving, setSaving] = useState(false)

    // TÍTULO DO CABEÇALHO: "NOVO ..." OU "EDITAR ..."
    useEffect(() => {

        if (!resource) return

        navigation.setOptions({
            title: editing ? `Editar ${resource.singular.toLowerCase()}` : resource.newLabel
        })

    }, [navigation, resource, editing])

    // NA EDIÇÃO, BUSCA O REGISTRO NA API
    useEffect(() => {

        if (!resource || id === undefined) return

        get(resource.key, id)
            .then((item) => setValues(resource.toForm(item)))
            .catch((e) => setMessage(e.message))
            .finally(() => setLoading(false))

    }, [resource, id])

    if (!resource || invalidId) {
        return (
            <Container>
                <Message>
                    {resource ? "Registro inválido." : "Recurso inválido."}
                </Message>
            </Container>
        )
    }

    const current = resource

    // SE O FORMULÁRIO FOI ABERTO DIRETO PELA URL, NÃO HÁ TELA ANTERIOR: VOLTA PARA A LISTA
    const goBack = () => {

        if (navigation.canGoBack()) navigation.goBack()
        else navigation.replace(TELA_DA_LISTA[current.key])
    }

    const setField = (name, value) => {
        setValues((v) => ({ ...v, [name]: value }))
        setErrors(({ [name]: _removed, ...rest }) => rest)
    }

    // SALVAR: VALIDA AQUI E DEPOIS ENVIA PARA A API
    const handleSave = async () => {

        const local = validate(current, values)

        setErrors(local)

        if (Object.keys(local).length) {
            setMessage("Corrija os campos destacados.")
            return
        }

        setSaving(true)
        setMessage(undefined)

        try {

            const payload = current.toPayload(values)

            if (id !== undefined) await update(current.key, id, payload)
            else await create(current.key, payload)

            goBack()

        } catch (e) {

            setMessage(e.message)

            setErrors(
                Object.fromEntries(
                    Object.entries(e.campos ?? {}).map(([field, text]) => [API_FIELD_ALIASES[field] ?? field, text])
                )
            )

        } finally {
            setSaving(false)
        }
    }

    // EXCLUIR O REGISTRO QUE ESTÁ SENDO EDITADO
    const handleDelete = async () => {

        if (id === undefined) return

        const ok = await confirmar(
            `Excluir ${current.singular.toLowerCase()}`,
            "Esta ação não pode ser desfeita."
        )

        if (!ok) return

        try {

            await remove(current.key, id)
            goBack()

        } catch (e) {
            avisar("Não foi possível excluir", e.message)
        }
    }

    return (
        <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>

            <Content keyboardShouldPersistTaps="handled">

                {message && (
                    <Alert>
                        <AlertText>
                            {message}
                        </AlertText>
                    </Alert>
                )}

                <Card>

                    {loading ? (
                        <Loader color={colors.primary} />
                    ) : (
                        current.fields.map((field) => (
                            <FormField
                                key={field.name}
                                field={field}
                                value={values[field.name]}
                                error={errors[field.name]}
                                onChange={(value) => setField(field.name, value)}
                            />
                        ))
                    )}

                    <FormActions>

                        <CancelButton onPress={goBack}>
                            <CancelButtonText>
                                Cancelar
                            </CancelButtonText>
                        </CancelButton>

                        <SaveButton
                            $desabilitado={saving || loading}
                            disabled={saving || loading}
                            onPress={handleSave}
                        >

                            {saving ? (
                                <SavingIndicator color={colors.onPrimary} />
                            ) : (
                                <SaveButtonText>
                                    Salvar
                                </SaveButtonText>
                            )}

                        </SaveButton>

                    </FormActions>

                </Card>

                {editing && !loading && (
                    <DeleteButton onPress={handleDelete}>

                        <Ionicons
                            name="trash-outline"
                            size={17}
                            color={colors.danger}
                        />

                        <DeleteButtonText>
                            Excluir {current.singular.toLowerCase()}
                        </DeleteButtonText>

                    </DeleteButton>
                )}

            </Content>

        </Container>
    )
}

export default Formulario
