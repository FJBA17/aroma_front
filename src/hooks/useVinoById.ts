import { useEffect, useState } from 'react'
import type { Vino } from './useVinos'

const QUERY = `
  query GetVino($id: String!) {
    vino(id: $id) {
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
  vino: Vino | null
  loading: boolean
  error: string | null
}

export function useVinoById(id: string) {
  const [state, setState] = useState<State>({ vino: null, loading: true, error: null })

  useEffect(() => {
    if (!id) return
    const apiUrl = import.meta.env.VITE_API_URL as string

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors) {
          setState({ vino: null, loading: false, error: json.errors[0].message })
        } else {
          setState({ vino: json.data.vino, loading: false, error: null })
        }
      })
      .catch((err: Error) => {
        setState({ vino: null, loading: false, error: err.message })
      })
  }, [id])

  return state
}
