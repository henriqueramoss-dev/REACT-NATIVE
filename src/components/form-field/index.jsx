
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import OptionPicker from "../option-picker"
import { useAppTheme } from "../../contexts/theme-context"
import { RESOURCES } from "../../services/resources"
import { brToIso, isoToBr, maskDate } from "../../utils/dates"
import { useOptions } from "../../utils/use-options"

import {
    Field,
    Label,
    Required,
    Input,
    DateArea,
    DateInput,
    DateIcon,
    Select,
    SelectText,
    Chips,
    Chip,
    ChipText,
    Check,
    CheckText,
    Hint,
    HintLink,
    ErrorText
} from "./style"

// Campo de formulário montado a partir da descrição do recurso (src/services/resources.ts).
// Props: field, value, error e onChange.
const FormField = ({ field, value, error, onChange }) => {

    const { colors } = useAppTheme()

    const text = typeof value === "string" ? value : ""

    let input

    switch (field.type) {

        case "enum":
            input = (
                <Chips>

                    {field.options.map((option) => {

                        const active = text === option.value

                        return (
                            <Chip
                                key={option.value}
                                $active={active}
                                onPress={() => onChange(option.value)}
                                accessibilityRole="radio"
                                accessibilityState={{ checked: active }}
                            >
                                <ChipText $active={active}>
                                    {option.label}
                                </ChipText>
                            </Chip>
                        )
                    })}

                </Chips>
            )
            break

        case "relations":
            // IGUAL AO SITE: UMA CAIXA DE SELEÇÃO PARA CADA OPÇÃO
            input = (
                <CheckList
                    field={field}
                    selected={Array.isArray(value) ? value : []}
                    onChange={onChange}
                />
            )
            break

        case "relation":
            input = (
                <RelationInput
                    field={field}
                    selected={Array.isArray(value) ? value : text ? [text] : []}
                    hasError={!!error}
                    onChange={(values) => onChange(values[0] ?? "")}
                />
            )
            break

        case "date":
            input = (
                <DateArea>

                    <DateInput
                        $error={!!error}
                        value={isoToBr(text)}
                        onChangeText={(typed) => {
                            const masked = maskDate(typed)
                            onChange(brToIso(masked) ?? masked)
                        }}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={colors.placeholder}
                        keyboardType="number-pad"
                        maxLength={10}
                    />

                    <DateIcon>
                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color={colors.placeholder}
                        />
                    </DateIcon>

                </DateArea>
            )
            break

        case "digits":
            input = (
                <Input
                    $error={!!error}
                    value={text}
                    // ACEITA COLAR COM PONTOS E TRAÇO: LIMPA PRIMEIRO, DEPOIS CORTA NO TAMANHO
                    onChangeText={(typed) => onChange(typed.replace(/\D/g, "").slice(0, field.length))}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.placeholder}
                    keyboardType="number-pad"
                />
            )
            break

        case "uf":
            input = (
                <Input
                    $error={!!error}
                    value={text}
                    onChangeText={(typed) => onChange(typed.replace(/[^A-Za-z]/g, "").toUpperCase())}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.placeholder}
                    maxLength={2}
                    autoCapitalize="characters"
                    autoCorrect={false}
                />
            )
            break

        default:
            input = (
                <Input
                    $error={!!error}
                    value={text}
                    onChangeText={onChange}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.placeholder}
                    maxLength={field.maxLength}
                    keyboardType={field.type === "email" ? "email-address" : field.type === "number" ? "number-pad" : "default"}
                    autoCapitalize={field.type === "email" ? "none" : "sentences"}
                    autoCorrect={field.type === "text"}
                />
            )
    }

    return (
        <Field>

            <Label>
                {field.label}
                {field.required && <Required> *</Required>}
            </Label>

            {input}

            {error && (
                <ErrorText>
                    {error}
                </ErrorText>
            )}

        </Field>
    )
}


// CAMPO DE UM SÓ VALOR: ABRE O SELETOR EM UM MODAL
const RelationInput = ({ field, selected, hasError, onChange }) => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()

    const { options, loaded, error, reload } = useOptions(field.resource)

    const [open, setOpen] = useState(false)

    const target = RESOURCES[field.resource]

    const labels = selected.map((v) => options.find((o) => o.value === v)?.label ?? `#${v}`)

    const summary = !loaded && selected.length ? "Carregando…" : labels.join(", ")

    const handleOpen = () => {
        reload()
        setOpen(true)
    }

    // ABRIR O CADASTRO DO RECURSO QUE ESTÁ FALTANDO
    const handleCreate = () => {
        setOpen(false)
        navigation.navigate("Formulario", { recurso: target.key })
    }

    return (
        <>
            <Select
                $error={hasError}
                onPress={handleOpen}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar ${field.label}`}
            >

                <SelectText
                    numberOfLines={1}
                    $vazio={!summary}
                >
                    {summary || "Selecione…"}
                </SelectText>

                <Ionicons
                    name="chevron-down"
                    size={18}
                    color={colors.textMuted}
                />

            </Select>

            <OptionPicker
                visible={open}
                title={field.label}
                options={options}
                selected={selected}
                error={error}
                emptyText={`Nenhum registro em ${target.label.toLowerCase()}.`}
                onCreate={handleCreate}
                onChange={onChange}
                onClose={() => setOpen(false)}
            />
        </>
    )
}


// CAMPO DE VÁRIOS VALORES: UMA CAIXA DE SELEÇÃO PARA CADA OPÇÃO
const CheckList = ({ field, selected, onChange }) => {

    const navigation = useNavigation()
    const { colors } = useAppTheme()

    const { options, loaded, error } = useOptions(field.resource)

    const target = RESOURCES[field.resource]

    if (error) {
        return (
            <ErrorText>
                {error}
            </ErrorText>
        )
    }

    if (!loaded) {
        return (
            <Hint>
                Carregando…
            </Hint>
        )
    }

    if (options.length === 0) {
        return (
            <Hint
                onPress={() => navigation.navigate("Formulario", { recurso: target.key })}
            >
                Nenhum registro em {target.label.toLowerCase()}.{" "}
                <HintLink>
                    Cadastrar agora
                </HintLink>
            </Hint>
        )
    }

    return (
        <Chips>

            {options.map((option) => {

                const on = selected.includes(option.value)

                return (
                    <Check
                        key={option.value}
                        $on={on}
                        onPress={() => onChange(on
                            ? selected.filter((v) => v !== option.value)
                            : [...selected, option.value]
                        )}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: on }}
                    >

                        <Ionicons
                            name={on ? "checkbox" : "square-outline"}
                            size={18}
                            color={on ? colors.primary : colors.textMuted}
                        />

                        <CheckText>
                            {option.label}
                        </CheckText>

                    </Check>
                )
            })}

        </Chips>
    )
}

export default FormField
