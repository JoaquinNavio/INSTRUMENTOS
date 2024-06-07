import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Editar.css'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Editar = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [instrumento, setInstrumento] = useState({});
    const [instrumentos, setInstrumentos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const handleClickAñadir = () => {
        const detalleUrl = `/añadir`;
        navigate(detalleUrl);
    };

    const [formulario, setFormulario] = useState({
        id: '', 
        cantidad_vendida: '',
        costo_envio: '',
        descripcion: '',
        imagen: '',
        instrumento: '',
        marca: '',
        modelo: '',
        precio: '',
        categoria: { id: '' },
    });

    useEffect(() => {
        fetch(`http://localhost:8080/instrumentos/${id}`)
            .then((response) => response.json()) 
            .then((instrumento) => {
                setInstrumento(instrumento);
                setFormulario({
                    ...formulario,
                    id: instrumento.id,
                    cantidad_vendida: instrumento.cantidad_vendida ? instrumento.cantidad_vendida.toString() : '',
                    costo_envio: instrumento.costo_envio ? instrumento.costo_envio.toString() : '',
                    descripcion: instrumento.descripcion || '',
                    imagen: instrumento.imagen || '',
                    instrumento: instrumento.instrumento || '',
                    marca: instrumento.marca || '',
                    modelo: instrumento.modelo || '',
                    precio: instrumento.precio ? instrumento.precio.toString() : '',
                    categoria: instrumento.categoria ? { id: instrumento.categoria.id.toString() } : { id: '' },
                });
            })
            .catch((error) => {
                console.error('Error al obtener datos del instrumento:', error);
            });
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:8080/instrumentos/`)
            .then((response) => response.json()) 
            .then((instrumentos) => {
                setInstrumentos(instrumentos);
            })
            .catch((error) => {
                console.error('Error al obtener instrumentos:', error);
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/categorias/')
            .then((response) => response.json())
            .then((categorias) => {
                setCategorias(categorias);
            })
            .catch((error) => {
                console.error('Error al obtener categorías:', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'categoria_id') {
            const categoria = categorias.find((categoria) => categoria.id === parseInt(value));
            setFormulario({ ...formulario, categoria: categoria ? { id: categoria.id } : { id: '' } });
        } else if (name === 'instrumento') {
            const selectedInstrument = instrumentos.find((instrumento) => instrumento.instrumento === value);
            if (selectedInstrument) {
                setFormulario({
                    ...formulario,
                    id: selectedInstrument.id,
                    [name]: value,
                    cantidad_vendida: selectedInstrument.cantidad_vendida ? selectedInstrument.cantidad_vendida.toString() : '',
                    costo_envio: selectedInstrument.costo_envio ? selectedInstrument.costo_envio.toString() : '',
                    descripcion: selectedInstrument.descripcion || '',
                    imagen: selectedInstrument.imagen || '',
                    marca: selectedInstrument.marca || '',
                    modelo: selectedInstrument.modelo || '',
                    precio: selectedInstrument.precio ? selectedInstrument.precio.toString() : '',
                    categoria: selectedInstrument.categoria ? { id: selectedInstrument.categoria.id } : { id: '' },
                });
            }
        } else {
            setFormulario({ ...formulario, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del instrumento nuevo:', formulario);

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formulario)
        };

        fetch(`http://localhost:8080/instrumentos/${formulario.id}`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al actualizar el instrumento');
                }
                alert("Instrumento actualizado exitosamente");

                console.log('Instrumento actualizado exitosamente');
            })
            .catch(error => {
                console.error('Error al actualizar el instrumento:', error);
            });
    };

    return (
        <div className="container">
            <div className="editar-container">
                <h1>Editar Instrumento</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Instrumento:
                            <select
                                name="instrumento"
                                value={formulario.instrumento || ''}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar instrumento</option>
                                {instrumentos.map((instrumento) => (
                                    <option key={instrumento.id} value={instrumento.instrumento}>
                                        {instrumento.instrumento}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Cantidad Vendida:
                            <input required
                                type="number"
                                name="cantidad_vendida"
                                value={formulario.cantidad_vendida}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Costo de Envío:
                            <input required
                                type="text"
                                name="costo_envio"
                                value={formulario.costo_envio}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Descripción:
                            <textarea required
                                name="descripcion"
                                value={formulario.descripcion}
                                onChange={handleChange}
                            ></textarea>
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Imagen (URL):
                            <input
                                type="text"
                                name="imagen"
                                value={formulario.imagen}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Marca:
                            <input required
                                type="text"
                                name="marca"
                                value={formulario.marca}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Modelo:
                            <input required
                                type="text"
                                name="modelo"
                                value={formulario.modelo}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Precio:
                            <input required
                                type="number"
                                name="precio"
                                value={formulario.precio}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Categoría:
                            <select
                                name="categoria_id"
                                value={formulario.categoria.id || ''}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.denominacion}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button type="submit">Guardar Cambios</button>
                </form>
                <h2>
                    Click aquí para añadir otro instrumento 
                    <button onClick={() => handleClickAñadir()}>
                        <FontAwesomeIcon icon={faCheck} />
                    </button>
                </h2>
            </div>
        </div>
    );
};

export default Editar;
