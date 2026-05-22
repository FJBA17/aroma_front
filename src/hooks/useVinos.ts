import { useEffect, useState } from 'react'

export interface Vino {
  id: string
  nombre: string
  precio: number
  precioMercado: number | null
  precioCaja: number | null
  fotos: string[] | null
  descripcion: string
  stock: number
}

const QUERY = `
  query {
    vinos {
      id
      nombre
      precio
      precioMercado
      precioCaja
      fotos
      descripcion
      stock
    }
  }
`

interface State {
  vinos: Vino[]
  loading: boolean
  error: string | null
}

export function useVinos() {
  const [state, setState] = useState<State>({ vinos: [], loading: true, error: null })

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL as string

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors) {
          setState({ vinos: [], loading: false, error: json.errors[0].message })
        } else {
          setState({ vinos: json.data.vinos, loading: false, error: null })
        }
      })
      .catch((err: Error) => {
        setState({ vinos: [], loading: false, error: err.message })
      })
  }, [])

  return state
}
