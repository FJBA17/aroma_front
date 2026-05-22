import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoMain from '../assets/LogoMain.png'
import isoLogo from '../assets/IsoLogo.png'
import { useCart } from '../context/CartContext'
import './Navbar.css'

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

interface NavLink {
  label: string
  to?: string
  href?: string
}

interface NavbarProps {
  links: NavLink[]
}

export default function Navbar({ links }: NavbarProps) {
  const { totalItems, openCart } = useCart()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  function close() { setOpen(false) }

  return (
    <header className="navbar">
      {/* ===== DESKTOP ===== */}
      <nav className="navbar__nav navbar__nav--desktop">
        {/* Logo izquierda */}
        <Link to="/" className="navbar__logo-link">
          {isLanding
            ? <img src={isoLogo} alt="Aroma" className="navbar__iso" />
            : <img src={logoMain} alt="Aroma" className="navbar__logo-center" />
          }
        </Link>

        {/* Links centrados */}
        <div className="navbar__links">
          {links.map((l) =>
            l.to ? (
              <Link key={l.label} to={l.to}>{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href ?? '#'}>{l.label}</a>
            )
          )}
        </div>

        {/* Carrito derecha */}
        <button className="navbar__cart navbar__cart--desktop" onClick={openCart} aria-label="Abrir carrito">
          <span className="navbar__cart-wrap">
            <CartIcon />
            {totalItems > 0 && (
              <span className="navbar__cart-badge">{totalItems}</span>
            )}
          </span>
        </button>
      </nav>

      {/* ===== MOBILE ===== */}
      <div className="navbar__mobile">
        <img src={isoLogo} alt="Aroma" className="navbar__iso" />

        <div className="navbar__mobile-right">
          {/* Carrito */}
          <button className="navbar__cart-btn" onClick={openCart} aria-label="Abrir carrito">
            <span className="navbar__cart-wrap">
              <CartIcon />
              {totalItems > 0 && (
                <span className="navbar__cart-badge">{totalItems}</span>
              )}
            </span>
          </button>

          {/* Hamburguesa */}
          <button
            className={`navbar__burger${open ? ' navbar__burger--open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* ===== MENÚ DESPLEGABLE MÓVIL ===== */}
      <nav className={`navbar__dropdown${open ? ' navbar__dropdown--open' : ''}`} aria-hidden={!open}>
        {links.map((l) =>
          l.to ? (
            <Link key={l.label} to={l.to} onClick={close}>{l.label}</Link>
          ) : (
            <a key={l.label} href={l.href ?? '#'} onClick={close}>{l.label}</a>
          )
        )}
      </nav>

      {/* Overlay para cerrar al tocar fuera */}
      {open && (
        <div className="navbar__overlay" onClick={close} aria-hidden="true" />
      )}
    </header>
  )
}
