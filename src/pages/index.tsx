import Image from "next/image"
import { HomeContainer, Product } from "../styles/pages/home"
import { useKeenSlider } from 'keen-slider/react'
import { GetStaticProps } from "next"
import { stripe } from "@/lib/stripe"

import Stripe from "stripe"

import 'keen-slider/keen-slider.min.css'

type HomeProps = {
  products: {
    id: string,
    title: string;
    imageURL: string;
    price: number;
    description: string;
  }[]
}

export default function Home({ products }: HomeProps) {

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: 'snap',
    slides: {
      perView: 3,
      spacing: 48
    }, 
    breakpoints: {
      '(max-width: 800px)': {
        slides: {
          perView: 2,
          spacing: 32,
        },
      },
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      
      {products.map(product => {
        return (
          <Product key={product.id} className="keen-slider__slide">
            <Image src={product.imageURL} width={520} height={480} alt={product.description} />

            <footer>
              <strong>{product.title}</strong>
              <span>{product.price}</span>
            </footer>
          </Product>
        )
      })} 
    </HomeContainer>
  )
}

// funciona com o JavaScript desabilitado porque não roda no browser
// só roda no servidor, por isso é chamado de server side.

// não devolve nada até que tudo o que estiver no getServerSideProps tenha
// sido executado. Ou seja, nunca terá um estado de loading, pois a página
// só é renderizada quando tudo estiver pronto.

// chamadas a API, conexão com banco de dados, autenticação etc. Na maioria das 
// vezes é melhor fazer chamadas a API da maneira tradicional no cliente
// As chamadas feitas no getServerSideProps só serão feitas em casos
// onde o conteúdo precisa estar disponível assim que a página for 
// carregada em tela (para indexadores, browser, crawlers, etc). 
// Consigo ter informações do contexto da requisição como req, res

// getStaticProps (SSG) - essa página não vai mudar com frequência
// é possível haver um cache dessa página. Para isso é mais aconselhável
// usar o getStaticProps. No ambiente de desenvolvimento o getStaticProps
// é chamado a cada requisição, mas em produção ele é chamado uma vez e
// o conteúdo é cacheado. Executado no momento de build da aplicação.

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price

    // unit_amount é o valor em centavos

    return {
      id: product.id,
      title: product.name,
      imageURL: product.images[0],
      description: product.description,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format( price?.unit_amount ? price.unit_amount / 100 : 0 ),
    }
  })

  return {
    props:{
      products
    },
    // numero em segundos para revalidar a página, para que ela seja recriada
    revalidate: 60 * 60 * 2 // 2 horas
  }
}