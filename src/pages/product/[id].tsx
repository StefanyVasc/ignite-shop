import { useRouter } from "next/router";

interface ProductProps { 
  foo?: string;
}

export default function Product({ foo }: ProductProps) {
  const {query} = useRouter()
  return (
    <div>
      <span>Id - {JSON.stringify(query)}</span>
    </div>
  )
} 
