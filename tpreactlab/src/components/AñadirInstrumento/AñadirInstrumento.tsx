import { useState, useEffect } from 'react';
import './AñadirInstrumento.css';

const AñadirInstrumento = () => {
    const [instrumentos, setInstrumentos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formulario, setFormulario] = useState({
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
        fetch("http://localhost:8080/instrumentos/")
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
        if (name === 'categoria') {
            const selectedCategoria = categorias.find(categoria => categoria.id.toString() === value);
            setFormulario({ ...formulario, categoria: { id: selectedCategoria.id } });
        } else {
            setFormulario({ ...formulario, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del nuevo instrumento:', formulario);

        const imagen = formulario.imagen || 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1200px-Imagen_no_disponible.svg.png';
        const nuevoInstrumento = { ...formulario, imagen };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoInstrumento)
        };

        fetch('http://localhost:8080/instrumentos/', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al añadir el instrumento');
                }
                alert("Instrumento añadido exitosamente");

                console.log('Instrumento añadido exitosamente');
            })
            .catch(error => {
                console.error('Error al añadir el instrumento:', error);
            });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Añadir Instrumento</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            Instrumento:
                            <input required
                                type="text"
                                name="instrumento"
                                value={formulario.instrumento}
                                onChange={handleChange}
                            />
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
                                name="categoria"
                                value={formulario.categoria.id}
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
                    <button type="submit">Añadir Instrumento</button>
                </form>
            </div>
        </div>
    );
};

export default AñadirInstrumento;
