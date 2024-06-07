import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./intrumentos.css";
import { faTrashAlt, faEdit, faCheck, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Instrumento = ({ carrito, setCarrito }) => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/instrumentos/")
      .then((response) => response.json())
      .then((instrumento) => setInstrumentos(instrumento));

    fetch("http://localhost:8080/categorias/")
      .then((response) => response.json())
      .then((categorias) => setCategorias(categorias));

    const jsonUsuario = localStorage.getItem("usuario");
    if (jsonUsuario) {
      const usuario = JSON.parse(jsonUsuario);
      setUsuario(usuario);
    }
  }, []);

  const handleClick = (instrumento) => {
    const detalleUrl = `/detalle/${instrumento.id}`;
    navigate(detalleUrl);
  };

  const handleClickEditar = (id) => {
    const detalleUrl = `/editar/${id}`;
    navigate(detalleUrl);
  };

  const handleClickAñadir = () => {
    const detalleUrl = `/añadir`;
    navigate(detalleUrl);
  };

  const handleClickEliminar = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este instrumento?");
    if (confirmacion) {
      fetch(`http://localhost:8080/instrumentos/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setInstrumentos(prevInstrumentos => prevInstrumentos.filter(item => item.id !== id));
        }
      })
      .catch(error => {
        console.error('Error al eliminar el instrumento:', error);
      });
    }
  };

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

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

  const filteredInstrumentos = categoriaSeleccionada
    ? instrumentos.filter(instrumento => instrumento.categoria && instrumento.categoria.denominacion === categoriaSeleccionada)
    : instrumentos;

  return (
    <div className="instrumentos-container" style={{ maxHeight: '4000px', overflowY: 'auto' }}>
      <h2>Seleccione una categoría:
        <select style={{ width: '200px' }} value={categoriaSeleccionada} onChange={handleCategoriaChange}>
          <option value="">Todos</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.denominacion}>{categoria.denominacion}</option>
          ))}
        </select>
      </h2>
      {usuario && usuario.rol === "admin" && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Click aquí para añadir otro instrumento</h2>
          <button onClick={handleClickAñadir} style={{ marginLeft: '10px', width: '100px' }}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      )}

      <h2>Listado de instrumentos:</h2>
      {filteredInstrumentos.map(instrumento => (
        <div key={instrumento.id} className="item-venta">
          <img src={instrumento.imagen} alt={instrumento.instrumento} style={{ width: '400px' }} />
          <div className="detalles-instrumento">
            <h2 style={{ fontSize: '30px' }}>{instrumento.instrumento}</h2>
            <p style={{ fontSize: '28px' }}>{instrumento.precio}$</p>
            {instrumento.costo_envio === "G" || instrumento.costo_envio === "0" ? (
              <p style={{ color: 'green', fontSize: '26px' }}>Envío Gratis</p>
            ) : (
              <p style={{ color: 'orange', fontSize: '26px' }}>
                El costo de envío es de: {instrumento.costo_envio}
              </p>
            )}
            <p style={{ fontSize: '25px' }}>{instrumento.cantidad_vendida} vendidos</p>
            <div className="botones">
              <button onClick={() => handleClick(instrumento)}>Ir a Detalle</button>
              {usuario && usuario.rol === "admin" && (
                <>
                  <button onClick={() => handleClickEditar(instrumento.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleClickEliminar(instrumento.id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </>
              )}
              <button onClick={() => handleAñadirCarrito(instrumento)}>
                <FontAwesomeIcon icon={faCartPlus} /> Añadir al Carrito
              </button>
              <button onClick={() => handleEliminarCarrito(instrumento)}>
                Eliminar del Carrito
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Instrumento;
