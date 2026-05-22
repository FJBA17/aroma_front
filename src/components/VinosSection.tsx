import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVinos, type Vino } from '../hooks/useVinos'
import { useCart } from '../context/CartContext'
import img1 from '../assets/Vinos/1.jpg'
import img2 from '../assets/Vinos/2.jpg'
import img3 from '../assets/Vinos/3.jpg'
import './VinosSection.css'

const GALLERY = [img1, img2, img3]

const PRICE_RANGES = [
  { label: 'Hasta $5.000', min: 0, max: 5000 },
  { label: '$5.000 – $10.000', min: 5000, max: 10000 },
  { label: '$10.000 – $20.000', min: 10000, max: 20000 },
  { label: 'Más de $20.000', min: 20000, max: Infinity },
]

function formatClp(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CL')
}

function VinoCard({ vino, startIdx }: { vino: Vino; startIdx: number }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const tieneDescuento = vino.precioMercado && vino.precioMercado > vino.precio
  const [current, setCurrent] = useState(startIdx % 3)
  const [next, setNext] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startGallery() {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const n = (prev + 1) % 3
        setNext(n)
        setTransitioning(true)
        setTimeout(() => {
          setCurrent(n)
          setNext(null)
          setTransitioning(false)
        }, 500)
        return prev
      })
    }, 900)
  }

  function stopGallery() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setNext(null)
    setTransitioning(false)
  }

  useEffect(() => () => stopGallery(), [])

  return (
    <article
      className="vino-card"
      onMouseEnter={startGallery}
      onMouseLeave={stopGallery}
      onClick={() => navigate(`/vinos/${vino.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="vino-card__img-wrap">
        {/* Imagen actual */}
        <img
          src={vino.fotos?.[0] ?? GALLERY[current]}
          alt={vino.nombre}
          className={`vino-card__img${transitioning ? ' vino-card__img--blur-out' : ''}`}
        />
        {/* Imagen siguiente — crossfade */}
        {next !== null && (
          <img
            src={vino.fotos?.[0] ?? GALLERY[next]}
            alt=""
            aria-hidden="true"
            className="vino-card__img vino-card__img--fade-in"
          />
        )}
        {vino.stock === 0 && (
          <span className="vino-card__badge">Agotado</span>
        )}
      </div>

      <div className="vino-card__body">
        <h3 className="vino-card__nombre">{vino.nombre}</h3>
        <p className="vino-card__desc">{vino.descripcion}</p>
        <div className="vino-card__footer">
          <div className="vino-card__precios">
            <div className="vino-card__precio-row">
              <span className="vino-card__precio-label">Unidad</span>
              <span className="vino-card__precio">{formatClp(vino.precio)}</span>
              {tieneDescuento && (
                <span className="vino-card__precio-mercado">{formatClp(vino.precioMercado!)}</span>
              )}
            </div>
            {vino.precioCaja && (
              <div className="vino-card__precio-row vino-card__precio-row--caja">
                <span className="vino-card__precio-label">Caja 6 unid</span>
                <span className="vino-card__precio vino-card__precio--caja">{formatClp(vino.precioCaja)}</span>
              </div>
            )}
          </div>
          <div className="vino-card__btns">
            <button
              className="btn btn--primary vino-card__btn"
              disabled={vino.stock === 0}
              onClick={(e) => {
                e.stopPropagation()
                addItem({ id: vino.id, nombre: vino.nombre, precio: vino.precio, tipo: 'unidad', img: vino.fotos?.[0] ?? img1 })
              }}
            >
              Unidad
            </button>
            {vino.precioCaja && vino.stock >= 6 && (
              <button
                className="btn btn--outline vino-card__btn"
                onClick={(e) => {
                  e.stopPropagation()
                  addItem({ id: vino.id, nombre: vino.nombre, precio: vino.precioCaja!, tipo: 'caja', img: vino.fotos?.[0] ?? img1 })
                }}
              >
                Caja ×6
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function VinosSection() {
  const { vinos, loading, error } = useVinos()
  const [query, setQuery] = useState('')
  const [activeRanges, setActiveRanges] = useState<number[]>([])

  function toggleRange(i: number) {
    setActiveRanges((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )
  }

  const filtered = useMemo(() => {
    return vinos.filter((v) => {
      const matchName = v.nombre.toLowerCase().includes(query.toLowerCase()) ||
        v.descripcion.toLowerCase().includes(query.toLowerCase())
      const matchPrice = activeRanges.length === 0 ||
        activeRanges.some((i) => v.precio >= PRICE_RANGES[i].min && v.precio < PRICE_RANGES[i].max)
      return matchName && matchPrice
    })
  }, [vinos, query, activeRanges])

  return (
    <section className="vinos-section" id="vinos">
      <div className="vinos-section__header">
        <p className="vinos-section__eyebrow">Selección exclusiva</p>
        <h2 className="vinos-section__title">Nuestra Colección</h2>
        <div className="vinos-section__divider" />
      </div>

      {/* ===== FILTROS ===== */}
      {!loading && !error && (
        <div className="vinos-filters">
          {/* Buscador */}
          <div className="vinos-search">
            <svg className="vinos-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              className="vinos-search__input"
              type="text"
              placeholder="Buscar vino..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="vinos-search__clear" onClick={() => setQuery('')} aria-label="Limpiar">
                ✕
              </button>
            )}
          </div>

          {/* Filtros de precio — checkboxes */}
          <div className="vinos-price-filters">
            <span className="vinos-price-filters__label">Precio</span>
            {PRICE_RANGES.map((range, i) => (
              <label key={range.label} className="vinos-checkbox">
                <input
                  type="checkbox"
                  className="vinos-checkbox__input"
                  checked={activeRanges.includes(i)}
                  onChange={() => toggleRange(i)}
                />
                <span className="vinos-checkbox__box" />
                <span className="vinos-checkbox__text">{range.label}</span>
              </label>
            ))}
            {activeRanges.length > 0 && (
              <button className="vinos-price-clear" onClick={() => setActiveRanges([])}>
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="vinos-section__state">
          <span className="vinos-section__spinner" />
        </div>
      )}

      {error && (
        <div className="vinos-section__state vinos-section__state--error">
          No se pudo cargar la colección.
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="vinos-section__state">
          {vinos.length === 0
            ? 'No hay vinos disponibles por el momento.'
            : 'No se encontraron vinos con ese criterio.'}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="vinos-grid">
          {filtered.map((v, i) => (
            <VinoCard key={v.id} vino={v} startIdx={i} />
          ))}
        </div>
      )}
    </section>
  )
}
