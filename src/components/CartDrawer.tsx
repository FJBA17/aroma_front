import { useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartDrawer.css'

const WA_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string) ?? ''

function formatClp(n: number) {
  return '$' + Math.round(n).toLocaleString('es-CL')
}

export default function CartDrawer() {
  const { items, totalItems, totalPrice, isOpen, openCart, closeCart, removeItem, updateQty, clearCart } =
    useCart()
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  function handleEncargar() {
    if (items.length === 0) return
    const lineas = items
      .map((i) => {
        const tipoLabel = i.tipo === 'caja' ? 'caja (6 unid)' : 'unid'
        return `• ${i.nombre} — ${i.cantidad} ${tipoLabel} — ${formatClp(i.precio * i.cantidad)}`
      })
      .join('\n')
    const msg =
      `¡Hola! Me gustaría hacer el siguiente pedido:\n\n` +
      `${lineas}\n\n` +
      `*Total: ${formatClp(totalPrice)}*\n\n` +
      `¿Podrían confirmar disponibilidad?`
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' cart-overlay--visible' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer${isOpen ? ' cart-drawer--open' : ''}`}
        aria-label="Carrito de pedido"
        role="dialog"
        aria-modal="true"
      >
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Tu Pedido</h2>
          <button
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <svg className="cart-drawer__empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p>Tu carrito está vacío</p>
            <span>Agrega vinos desde la colección</span>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={`${item.id}-${item.tipo}`} className="cart-item">
                  <img src={item.img} alt={item.nombre} className="cart-item__img" />
                  <div className="cart-item__info">
                    <div className="cart-item__top">
                      <span className="cart-item__nombre">{item.nombre}</span>
                      <span className="cart-item__tipo">{item.tipo === 'caja' ? 'Caja 6 unid' : 'Unidad'}</span>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeItem(item.id, item.tipo)}
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="2" y1="2" x2="14" y2="14" />
                          <line x1="14" y1="2" x2="2" y2="14" />
                        </svg>
                      </button>
                    </div>
                    <div className="cart-item__bottom">
                      <span className="cart-item__precio-unit">
                        {formatClp(item.precio)} c/{item.tipo === 'caja' ? 'caja' : 'u'}
                      </span>
                      <div className="cart-item__controls">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQty(item.id, item.tipo, -1)}
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                        <span className="cart-item__qty">{item.cantidad}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => updateQty(item.id, item.tipo, 1)}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item__subtotal">
                        {formatClp(item.precio * item.cantidad)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span className="cart-drawer__total-label">Total</span>
                <strong className="cart-drawer__total-value">
                  {formatClp(totalPrice)}
                </strong>
              </div>

              <button
                className="btn btn--primary cart-drawer__cta"
                onClick={handleEncargar}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.163L2 22l4.978-1.417A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1.27 13.81c-1.02-.527-1.91-1.29-2.59-2.22-.52-.71-.83-1.54-.83-2.37 0-.84.33-1.65.93-2.26.21-.22.49-.34.78-.34.09 0 .18.01.27.02.27.03.52.19.67.44l.93 1.63c.17.3.13.68-.1.94l-.34.38c-.1.11-.11.27-.04.4.34.65.8 1.21 1.37 1.65.13.1.3.09.42-.02l.35-.31c.25-.22.62-.26.91-.1l1.65.9c.26.14.42.41.42.7v.01c0 .3-.14.58-.37.77-.47.38-1.03.62-1.62.67-.09.01-.18.01-.27.01-.65 0-1.32-.17-1.86-.47z"/>
                </svg>
                Encargar por WhatsApp
              </button>

              <button className="cart-drawer__vaciar" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>

      {/* FAB flotante */}
      {!isLanding && (
        <button
          className={`cart-fab${isOpen ? ' cart-fab--hidden' : ''}${totalItems > 0 ? ' cart-fab--active' : ''}`}
          onClick={openCart}
          aria-label="Abrir carrito"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {totalItems > 0 && (
            <span className="cart-fab__badge">{totalItems}</span>
          )}
        </button>
      )}
    </>
  )
}
