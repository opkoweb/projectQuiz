import Head from 'next/head'
import QuestaoModel from '../model/questao';
import styles from '../styles/Home.module.scss'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Questionario from '../components/Questionario';


const BASE_URL = "http://localhost:3000/api"


export default function Home() {
  const router = useRouter()

  const [IdsDasQuestoes, setIdsDasQuestoes] = useState<number[]>([])
  const [questao, setQuestao] = useState<QuestaoModel>()
  const [respostarCertas, setRespostasCertas] = useState<number>(0)


  async function carregarIdsDasQuestoes() {
    const resp = await fetch(`${BASE_URL}/questionario`)
    const idsDasQuestoes = await resp.json()
    setIdsDasQuestoes(idsDasQuestoes)
  }
  async function carregarQuestao(idQuestao: number) {
    const resp = await fetch(`${BASE_URL}/questoes/${idQuestao}`)
    const json = await resp.json()
    const novaQuestao = (QuestaoModel.criarUsandoObjeto(json))
    setQuestao(novaQuestao)

  }

  useEffect(() => {
    carregarIdsDasQuestoes()
  }, [])

  useEffect(() => {
    IdsDasQuestoes.length > 0 && carregarQuestao(IdsDasQuestoes[0])
  }, [IdsDasQuestoes])

  function questaoRespondida(questaoRespondida: QuestaoModel) {
    setQuestao(questaoRespondida)
    const acertou = questaoRespondida.acertou
    setRespostasCertas(respostarCertas + (acertou ? 1 : 0))
  }

  function idProximaPergunta() {
    if (questao) {
      const proximoIndice = IdsDasQuestoes.indexOf(questao.id) + 1
      return IdsDasQuestoes[proximoIndice]
    }

  }

  function irProximoPasso() {
    const proximoId = idProximaPergunta()
    proximoId ? irPraProximaQuestao(proximoId) : finalizar()
  }

  function irPraProximaQuestao(proximoId: number) {
    carregarQuestao(proximoId)
  }

  function finalizar() {
    router.push({
      pathname: "/resultado",
      query: {
        total: IdsDasQuestoes.length,
        certas: respostarCertas
      }
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>NextApp: "QUIZ"</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Proj.: "QUIZ"</h1>
      <span></span>
      <div className={styles.containerQuestoes}>
        <Questionario
          questao={questao}
          ultimaPergunta={idProximaPergunta() === undefined}
          questaoRespondida={questaoRespondida}
          irProximoPasso={irProximoPasso} />
      </div>



    </div>
  )
}
