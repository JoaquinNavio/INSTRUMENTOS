import React, { useState } from 'react';
import './Carrito.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import PreferenceMP from '../../types/PreferenceMP';

async function createPreferenceMP(pedido) {
  const urlServer = 'http://localhost:8080/pedido/api/create_preference_mp';
  const method = "POST";
  const response = await fetch(urlServer, {
    method: method,
    body: JSON.stringify(pedido),
    headers: {
      "Content-Type": 'application/json'
    }
  });
  return await response.json() as PreferenceMP;
}

const Carrito = ({ carrito, setCarrito, style }) => {
  const [idPreference, setIdPreference] = useState('');

  // Inicializar MercadoPago
  initMercadoPago('TEST-fad26a50-4373-4067-a401-a47ff50224c3', { locale: "es-AR" });

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  const getPreferenceMP = async () => {
    const detallesPedido = carrito.map(item => ({ id: item.id, cantidad: item.cantidad }));
    const totalPedido = calcularTotal();
  
    const bodyData = {
      totalPedido,
      detalles: detallesPedido
    };
    console.log(bodyData);
    const urlServer = 'http://localhost:8080/pedido/createWithDetails';
    const method = "POST";
    const response = await fetch(urlServer, {
      method: method,
      body: JSON.stringify(bodyData),
      headers: {
        "Content-Type": 'application/json'
      }
    });

    const responses = await createPreferenceMP({ id: 0, titulo: 'Pedido carrito instrumentos', montoTotal: parseInt(calcularTotal()) });
    console.log("Preference id: " + responses.id);
    if (responses)
      setIdPreference(responses.id);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <div className="carrito-container" style={style} >
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div>
          {carrito.map(item => (
            <div key={item.id} className="carrito-item">
              <img src={item.imagen} alt={item.instrumento} style={{ width: '100px' }} />
              <div className="detalles-item">
                <h3>{item.instrumento}</h3>
                <p>{item.precio}$ x {item.cantidad}</p>
                <p>Subtotal: {item.precio * item.cantidad}$</p>
              </div>
            </div>
          ))}
          <h3>Total: {calcularTotal()}$</h3>
          <div>
            <button onClick={vaciarCarrito} className="vaciar-button">
              Vaciar Carrito
            </button>
            <button onClick={getPreferenceMP} className="comprar-button">
              Realizar Compra
            </button>

            <div className={idPreference ? 'divVisible' : 'divInvisible'}>
              <Wallet initialization={{ preferenceId: idPreference, redirectMode: "blank" }} customization={{ texts: { valueProp: 'smart_option' } }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
