import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Usuario from "../../types/Usuario";
import { SHA256 } from 'crypto-js';
import './Login.css'; // Importa el archivo de estilos CSS

function Login({setCarrito }) {
    const navigate = useNavigate( );
    const [usuario, setUsuario] = useState<Usuario>(new Usuario());
    const [txtValidacion, setTxtValidacion] = useState<string>("");

    useEffect(() => {
        // Elimina el usuario guardado al montar el componente
        localStorage.removeItem("usuario");
        setCarrito([]);
    }, []);

    const login = async () => {
        if (usuario?.usuario == undefined || usuario?.usuario === "") {
            setTxtValidacion("Ingrese el nombre de usuario");
            return;
        }
        if (usuario?.clave == undefined || usuario?.clave === "") {
            setTxtValidacion("Ingrese la clave");
            return;
        }

        const hashedPassword = SHA256(usuario.clave).toString();

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: usuario.usuario,
                    contraseña: hashedPassword,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al autenticar usuario");
            }

            const user = await response.json();

            if (user) {
                localStorage.setItem("usuario", JSON.stringify(user));
                setUsuario(user);
                navigate("/", {
                    replace: true,
                    state: {
                        logged: true,
                        usuario: user,
                    },
                });
            } else {
                setTxtValidacion("Usuario y/o clave incorrectas");
            }
        } catch (error) {
            console.error("Error de autenticación:", error);
            setTxtValidacion("Error al autenticar usuario");
        }
    }

    return (
        <div className="login-container">
            <form className="login-form">
                <h2 className="login-title">Iniciar Sesión</h2>
                <div className="form-group">
                    <label htmlFor="txtUsuario" className="form-label">Usuario</label>
                    <input type="text" id='txtUsuario' className="form-control" placeholder="Ingrese el nombre" defaultValue={usuario?.usuario} onChange={e => usuario.usuario = String(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }} />
                </div>
                <div className="form-group">
                    <label htmlFor="txtClave" className="form-label">Clave</label>
                    <input type="password" id='txtClave' className="form-control" placeholder="Ingrese la clave" defaultValue={usuario?.clave} onChange={e => usuario.clave = String(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }} />
                </div>
                <div className="form-group">
                    <button onClick={login} className="btn btn-success" type="button">
                        Ingresar
                    </button>
                </div>
                {txtValidacion && <p className="error-message">{txtValidacion}</p>}
            </form>
        </div>
    );
}

export default Login;