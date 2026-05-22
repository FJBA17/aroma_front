import { Link } from 'react-router-dom'
import logoMain from './assets/LogoMain.png'
import mainBotella from './assets/MainBotella.png'
import copa from './assets/Copa.png'
import PageTransition from './components/PageTransition'
import Navbar from './components/Navbar'
import './App.css'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Vinos', to: '/vinos' },
  { label: 'Sobre Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

export default function App() {
  return (
    <PageTransition>
      <Navbar links={NAV_LINKS} />

      {/* ===== HERO ===== */}
      <section className="hero" id="inicio">
        <div className="hero__side hero__side--left">
          <img src={mainBotella} alt="" aria-hidden="true" className="hero__bottle hero__enter hero__enter--left" />
        </div>

        <div className="hero__content">
          <img src={logoMain} alt="Aroma" className="hero__logo hero__enter hero__enter--up" />
          <h1 className="hero__title hero__enter hero__enter--up hero__enter--delay-1">
            Exquisitos Vinos
            <br />
            para Paladares Exigentes
          </h1>
          <p className="hero__subtitle hero__enter hero__enter--up hero__enter--delay-2">
            Descubre nuestra exclusiva selección de vinos de alta calidad.
          </p>
          <div className="hero__buttons hero__enter hero__enter--up hero__enter--delay-3">
            <Link to="/vinos" className="btn btn--primary">Ver Colección</Link>
            <button className="btn btn--outline">Compra Ahora</button>
          </div>
        </div>

        <div className="hero__side hero__side--right">
          <img src={copa} alt="" aria-hidden="true" className="hero__glass hero__enter hero__enter--right" />
        </div>
      </section>
    </PageTransition>
  )
}
