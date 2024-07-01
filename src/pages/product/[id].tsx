import { stripe } from "@/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useState } from "react";
import Stripe from "stripe";

type ProductProps = { 
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data;


      // redireciona o usuário para uma rota externa(checkout)
      window.location.href = checkoutUrl;
      
    } catch (error) {
      // conectar com uma ferramenta de observabilidade (Datadog / Sentry)
      setIsCreatingCheckoutSession(false);

      alert('Falha ao redirecionar para o checkout. Tente novamente.')
    }
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt={product.description} />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button disabled={isCreatingCheckoutSession} onClick={handleBuyButton}>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}


/* 
* sempre que você precisar de um parâmetro dinâmico e estiver usando o StaticProps,
* é preciso o StaticPaths. Já que o StaticProps é executado no momento da build,
* as páginas são geradas de acordo com os parâmetros passados no StaticPaths.
* 
* Nesse caso o getStaticPaths irá retornar o ID para que a página consiga ser
* gerada com base nesse ID estaticamente.
* 
* fallback: false -> nao permite acessar outras paginas que nao tenham o param 
* listado. 
* 
* fallback: true -> o Next mostra o html da pag e tenta carregar os dados do
* produto por baixo dos panos e mostra em tela. Ele cria as telas sem as infos
* e o getStaticPaths é executado assincronamente, dai quando os dados estão 
* carregados ele é exibido. Dai entra o estado de loading que é o isFallback do
* useRouter()
* 
* fallback: 'blocking' -> bloqueia, nao mostra nada em tela até ter algo para 
* mostrar. Para o usuário final é uma experiência pior.
*/
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: { id: 'prod_QMQ4s1QYK352Ae' }
      }
    ],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id;

  const product = await stripe.products.retrieve(productId as string, {
    expand: ['default_price']
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        description: product.description,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price?.unit_amount ? price.unit_amount / 100 : 0),
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1 // 1 hours
  }
}
