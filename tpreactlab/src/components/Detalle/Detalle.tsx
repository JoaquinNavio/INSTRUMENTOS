import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Detalle.css'; // Importa el archivo de estilos CSS
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Detalle = ({ carrito, setCarrito }) => {
    const { id } = useParams();
    const [instrumento, setInstrumento] = useState({});

    useEffect(() => {
        fetch(`http://localhost:8080/instrumentos/${id}`)
            .then((response) => response.json()) 
            .then((instrumento) => setInstrumento(instrumento));
    }, [id]);

    const handleAñadirCarrito = (instrumento) => {
        const existente = carrito.find(item => item.id === instrumento.id);
        if (existente) {
          setCarrito(carrito.map(item =>
            item.id === instrumento.id ? { ...item, cantidad: item.cantidad + 1 } : item
          ));
        } else {
          setCarrito([...carrito, { ...instrumento, cantidad: 1 }]);
        }
      };
    
      const handleEliminarCarrito = (instrumento) => {
        const existente = carrito.find(item => item.id === instrumento.id);
        if (existente) {
          if (existente.cantidad > 1) {
            setCarrito(carrito.map(item =>
              item.id === instrumento.id ? { ...item, cantidad: item.cantidad - 1 } : item
            ));
          } else {
            setCarrito(carrito.filter(item => item.id !== instrumento.id));
          }
        }
      };
      const handlePDF = (instrumento) => {
        window.open(`http://localhost:8080/instrumentos/generatePDF/${instrumento.id}`, "_blank");
      };
    
    return (
        <div className="detalle-container">
            <div className="imagen-container">
                <img src={instrumento.imagen} alt={instrumento.instrumento} />
                <p>Descripción:</p>
                <p>{instrumento.descripcion}</p>
            </div>
            
            <div className="informacion-container">
                <div className="detalle-derecha">
                    <p className="small-text">Cantidad vendidos: {instrumento.cantidad_vendida}</p>
                    <h2 className="big-bold-text">{instrumento.instrumento}</h2>
                    <h1 className="big-text">Precio: {instrumento.precio}$</h1>
                    <p className="medium-text">Marca: {instrumento.marca}</p>
                    <p className="medium-text">Modelo: {instrumento.modelo}</p>
                    <p>Costo Envio:</p>
                    {instrumento.costo_envio === "G" ? (
                        <p style={{ color: 'green', fontSize: '26px' }}>🚚 Envío Gratis</p>
                    ) : (
                        <p style={{ color: 'orange', fontSize: '26px' }}>
                            🚚 El costo de envio es de: {instrumento.costo_envio}
                        </p>
                    )}
                </div>

                <div className="botones-container">
                    <button className="boton" onClick={() => handleAñadirCarrito(instrumento)}>
                        <FontAwesomeIcon icon={faCartPlus} /> Añadir al Carrito
                    </button>
                    <button className="boton" onClick={() => handleEliminarCarrito(instrumento)}>
                        Eliminar del Carrito
                    </button>
                    <button className="boton" onClick={() => handlePDF(instrumento)}>
                        Generar Pdf
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detalle;
