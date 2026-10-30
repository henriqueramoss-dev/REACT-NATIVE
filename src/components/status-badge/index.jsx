
import {
    Badge
} from "./style"

// Selo colorido de status. tone pode ser "ok" (verde), "warn" (cinza) ou "danger" (vermelho).
const StatusBadge = ({ text, tone }) => {

    return (
        <Badge $tone={tone}>
            {text}
        </Badge>
    )
}

export default StatusBadge
