import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Nav = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsuario(user);
    }
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (window.confirm('Se cerrará la sesión, ¿desea continuar?')) {
      localStorage.removeItem('usuario');
      navigate('/login');
    }
  };

  return (
    <nav>
      <ul style={{ listStyleType: 'none', backgroundColor: 'lightgray', display: 'flex' }}>
        <li style={{ padding: '20px', paddingLeft: '50px', paddingRight: '80px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
        </li>
        <li style={{ padding: '20px', paddingLeft: '50px', paddingRight: '80px' }}>
          <Link to="/DondeEstamos" style={{ textDecoration: 'none', color: 'black' }}>Donde estamos</Link>
        </li>
        <li style={{ padding: '20px', paddingLeft: '50px', paddingRight: '80px' }}>
          <Link to="/instrumentos" style={{ textDecoration: 'none', color: 'black' }}>Instrumentos</Link>
        </li>
        {usuario && usuario.rol === 'admin' && (
          <li style={{ padding: '20px', paddingLeft: '50px', paddingRight: '80px' }}>
            <Link to="/charts" style={{ textDecoration: 'none', color: 'black' }}>Charts</Link>
          </li>
        )}
        <li style={{ padding: '20px', paddingLeft: '50px', paddingRight: '80px' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: 'black' }} onClick={handleLogoutClick}>
            {usuario ? `Usuario: ${usuario.nombre}` : 'Login'}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
