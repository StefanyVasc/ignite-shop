import Image from "next/image"
import { HomeContainer, Product } from "../styles/pages/home"
import { useKeenSlider } from 'keen-slider/react'

import tshirt1 from '../assets/tshirts/1.png'
import tshirt2 from '../assets/tshirts/2.png'
import tshirt3 from '../assets/tshirts/3.png'

import 'keen-slider/keen-slider.min.css'

export default function Home() {

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
      <Product className="keen-slider__slide">
        <Image src={tshirt1} width={520} height={480} alt="" />
        <footer>
          <strong>T-shirt X</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>

      <Product className="keen-slider__slide">
        <Image src={tshirt2} width={520} height={480} alt="" />
        <footer>
          <strong>T-shirt Y</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>

      <Product className="keen-slider__slide">
        <Image src={tshirt3} width={520} height={480} alt="" />
        <footer>
          <strong>T-shirt W</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>

      <Product className="keen-slider__slide">
        <Image src={tshirt3} width={520} height={480} alt="" />
        <footer>
          <strong>T-shirt W</strong>
          <span>R$ 79,90</span>
        </footer>
      </Product>

      
    </HomeContainer>
  )
}