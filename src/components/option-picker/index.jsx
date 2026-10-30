
import { useState } from "react"
import { Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppTheme } from "../../contexts/theme-context"

import {
    Fundo,
    Sheet,
    Header,
    Title,
    CloseButton,
    SearchArea,
    SearchInput,
    Message,
    List,
    Option,
    OptionText,
    Empty,
    CreateButton,
    CreateButtonText,
    DoneButton,
    DoneButtonText
} from "./style"

// Lista de opções em um modal, com busca. Usada nos campos de relacionamento.
// Props: visible, title, options, selected, multiple, emptyText, error,
// onCreate (opcional), onChange e onClose.
const OptionPicker = ({
    visible,
    title,
    options,
    selected,
    multiple,
    emptyText,
    error,
    onCreate,
    onChange,
    onClose
}) => {

    const { colors } = useAppTheme()
    const insets = useSafeAreaInsets()

    const [search, setSearch] = useState("")

    const term = search.trim().toLowerCase()

    const filtered = term
        ? options.filter((o) => o.label.toLowerCase().includes(term))
        : options

    // FECHAR O MODAL E LIMPAR A BUSCA
    const handleClose = () => {
        setSearch("")
        onClose()
    }

    // MARCAR / DESMARCAR UMA OPÇÃO
    const handleToggle = (value) => {

        if (!multiple) {
            onChange([value])
            handleClose()
            return
        }

        onChange(
            selected.includes(value)
                ? selected.filter((v) => v !== value)
                : [...selected, value]
        )
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >

            <Fundo
                activeOpacity={1}
                onPress={handleClose}
            />

            <Sheet style={{ paddingBottom: insets.bottom + 16 }}>

                <Header>

                    <Title>
                        {title}
                    </Title>

                    <CloseButton
                        onPress={handleClose}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityLabel="Fechar"
                    >

                        <Ionicons
                            name="close"
                            size={24}
                            color={colors.textMuted}
                        />

                    </CloseButton>

                </Header>

                {options.length > 6 && (
                    <SearchArea>

                        <Ionicons
                            name="search"
                            size={18}
                            color={colors.placeholder}
                        />

                        <SearchInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Pesquisar"
                            placeholderTextColor={colors.placeholder}
                        />

                    </SearchArea>
                )}

                {error && (
                    <Message $erro>
                        {error}
                    </Message>
                )}

                <List
                    data={filtered}
                    keyExtractor={(item) => item.value}
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <Empty>

                            <Message>
                                {term ? "Nenhum resultado para a pesquisa." : emptyText}
                            </Message>

                            {!term && onCreate && (
                                <CreateButton onPress={onCreate}>
                                    <CreateButtonText>
                                        Cadastrar agora
                                    </CreateButtonText>
                                </CreateButton>
                            )}

                        </Empty>
                    }
                    renderItem={({ item }) => {

                        const isSelected = selected.includes(item.value)

                        return (
                            <Option
                                onPress={() => handleToggle(item.value)}
                                accessibilityRole={multiple ? "checkbox" : "radio"}
                                accessibilityState={{ checked: isSelected }}
                            >

                                <OptionText>
                                    {item.label}
                                </OptionText>

                                <Ionicons
                                    name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                                    size={22}
                                    color={isSelected ? colors.primary : colors.borderStrong}
                                />

                            </Option>
                        )
                    }}
                />

                {multiple && (
                    <DoneButton onPress={handleClose}>
                        <DoneButtonText>
                            Concluir{selected.length ? ` (${selected.length})` : ""}
                        </DoneButtonText>
                    </DoneButton>
                )}

            </Sheet>

        </Modal>
    )
}

export default OptionPicker
