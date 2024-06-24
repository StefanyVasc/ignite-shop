import { globalStyles } from "@/styles/global";
import type { AppProps } from "next/app";
import { Container, Header } from "../styles/pages/app"
import logoImg from "../assets/logo.svg"
import Image from "next/image";

/* 
* App é carregado em todas as páginas. É algo global, por isso o
* Header está aqui. Se fosse algo específico de uma página, deveria
* ficar na página em si.
*/

// globalStyles deve ficar fora para que não seja recriado a cada render
globalStyles()

export default function App({ Component, pageProps }: AppProps) {

  return (
    <Container>
      <Header>
        <Image src={logoImg} alt="" />
      </Header>

      <Component {...pageProps} />
    </Container>
  )
}
