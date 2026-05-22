import VinosSection from '../components/VinosSection'
import PageTransition from '../components/PageTransition'
import Navbar from '../components/Navbar'
import '../App.css'

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Vinos', href: '#vinos' },
  { label: 'Sobre Nosotros', href: '#' },
  { label: 'Contacto', href: '#' },
]

export default function VinosPage() {
  return (
    <PageTransition>
      <Navbar links={NAV_LINKS} />

      <main style={{ paddingTop: '56px' }}>
        <VinosSection />
      </main>
    </PageTransition>
  )
}
