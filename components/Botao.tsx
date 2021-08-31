import styles from '../styles/components/Botao.module.scss'
import Link from 'next/link'

interface BotaoProps {
    texto: string
    href?: string
    onClick?: () => void
}

export default function Botao(props: BotaoProps) {

    function renderizarBotao() {
        return (
            <button type="button" className={styles.btnBotao} onClick={props.onClick}>
                {props.texto}
            </button>
        )
    }

    return props.href ? (
        <Link href={props.href}>
            {renderizarBotao()}
        </Link>
    ) : renderizarBotao()

}