import { useEffect, useRef, useState } from 'react'
import './PageTransition.css'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // pequeño delay para que el browser pinte antes de la animación
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div ref={ref} className={`page-transition${visible ? ' page-transition--in' : ''}`}>
      {children}
    </div>
  )
}
