import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useVinoById } from '../hooks/useVinoById'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import img1 from '../assets/Vinos/1.jpg'
import img2 from '../assets/Vinos/2.jpg'
import img3 from '../assets/Vinos/3.jpg'
import '../App.css'
import './VinoDetailPage.css'

const GALLERY = [img1, img2, img3]

const NAV_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Vinos', to: '/vinos' },
  { label: 'Sobre Nosotros', href: '#' },
  { label: 'Contacto', href: '#' },
]

function formatClp(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CL')
}

export default function VinoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { vino, loading, error } = useVinoById(id ?? '')
  const { addItem } = useCart()
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)
  const [addedCaja, setAddedCaja] = useState(false)

  function handleAgregar() {
    if (!vino) return
    addItem({ id: vino.id, nombre: vino.nombre, precio: vino.precio, tipo: 'unidad', img: vino.fotos?.[0] ?? img1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  function handleAgregarCaja() {
    if (!vino?.precioCaja) return
    addItem({ id: vino.id, nombre: vino.nombre, precio: vino.precioCaja, tipo: 'caja', img: vino.fotos?.[0] ?? img1 })
    setAddedCaja(true)
    setTimeout(() => setAddedCaja(false), 1800)
  }

  const images = vino?.fotos?.length ? vino.fotos : GALLERY
  const tieneDescuento = vino?.precioMercado && vino.precioMercado > vino.precio

  return (
    <PageTransition>
      <Navbar links={NAV_LINKS} />

      <main className="vino-detail">

        {loading && (
          <div className="vino-detail__state">
            <div className="vino-detail__spinner" />
          </div>
        )}

        {error && (
          <div className="vino-detail__state vino-detail__state--error">
            No se pudo cargar el vino.
          </div>
        )}

        {vino && (
          <>
            {/* ── BREADCRUMB ── */}
            <nav className="vino-detail__breadcrumb" aria-label="Navegación">
              <button onClick={() => navigate('/vinos')} className="vino-detail__back">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="10 3 5 8 10 13" />
                </svg>
                Volver a la colección
              </button>
            </nav>

            {/* ── CONTENIDO PRINCIPAL ── */}
            <div className="vino-detail__layout">

              {/* ── COLUMNA IMAGEN ── */}
              <div className="vino-detail__gallery">
                {/* Imagen principal */}
                <div className="vino-detail__img-main">
                  <img
                    src={images[activeImg]}
                    alt={vino.nombre}
                    className="vino-detail__img"
                  />
                  {vino.stock === 0 && (
                    <span className="vino-detail__agotado">Agotado</span>
                  )}
                </div>

                {/* Thumbnails — solo si hay varias */}
                {images.length > 1 && (
                  <div className="vino-detail__thumbs">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        className={`vino-detail__thumb${activeImg === i ? ' vino-detail__thumb--active' : ''}`}
                        onClick={() => setActiveImg(i)}
                        aria-label={`Imagen ${i + 1}`}
                      >
                        <img src={src} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── COLUMNA INFO ── */}
              <div className="vino-detail__info">

                {/* Nombre */}
                <h1 className="vino-detail__nombre">{vino.nombre}</h1>

                {/* Divisor */}
                <div className="vino-detail__divider" />

                {/* Precios */}
                <div className="vino-detail__precios">
                  <div className="vino-detail__precio-row">
                    <span className="vino-detail__precio-label">Unidad</span>
                    <div className="vino-detail__precio-vals">
                      <span className="vino-detail__precio">{formatClp(vino.precio)}</span>
                      {tieneDescuento && (
                        <span className="vino-detail__precio-mercado">
                          {formatClp(vino.precioMercado!)}
                        </span>
                      )}
                    </div>
                  </div>
                  {vino.precioCaja && (
                    <div className="vino-detail__precio-row vino-detail__precio-row--caja">
                      <span className="vino-detail__precio-label">Caja 6 unid</span>
                      <span className="vino-detail__precio vino-detail__precio--caja">{formatClp(vino.precioCaja)}</span>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <p className="vino-detail__descripcion">{vino.descripcion}</p>

                {/* Stock */}
                <div className="vino-detail__stock">
                  <span className={`vino-detail__stock-dot${vino.stock === 0 ? ' vino-detail__stock-dot--out' : ''}`} />
                  <span className="vino-detail__stock-label">
                    {vino.stock === 0
                      ? 'Sin stock disponible'
                      : vino.stock <= 5
                        ? `Últimas ${vino.stock} unidades`
                        : 'Disponible'}
                  </span>
                </div>

                {/* CTA */}
                <div className="vino-detail__ctas">
                  <button
                    className={`btn btn--primary vino-detail__cta${added ? ' vino-detail__cta--added' : ''}`}
                    disabled={vino.stock === 0 || added}
                    onClick={handleAgregar}
                  >
                    {added ? (
                      <>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 8 6 12 14 4" />
                        </svg>
                        Agregado
                      </>
                    ) : (
                      'Agregar unidad'
                    )}
                  </button>
                  {vino.precioCaja && (
                    <button
                      className={`btn btn--outline vino-detail__cta${addedCaja ? ' vino-detail__cta--added' : ''}`}
                      disabled={vino.stock < 6 || addedCaja}
                      onClick={handleAgregarCaja}
                    >
                      {addedCaja ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="2 8 6 12 14 4" />
                          </svg>
                          Agregado
                        </>
                      ) : (
                        'Agregar caja ×6'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </PageTransition>
  )
}
