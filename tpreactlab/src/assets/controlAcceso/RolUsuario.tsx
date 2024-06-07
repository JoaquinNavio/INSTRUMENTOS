import { Navigate, Outlet } from 'react-router-dom';

import { useState } from 'react';
import Usuario from '../../types/Usuario';
import { Roles } from '../../types/Roles';

interface Props {
  rol: string;
}

function RolUsuario({ rol }: Props) {
  
    const [jsonUsuario, setJSONUsuario] = useState<any>(localStorage.getItem('usuario'));
    const usuarioLogueado:Usuario = JSON.parse(jsonUsuario) as Usuario;
    //si esta logueado y es administrador lo dejo ingresar si no
    if((usuarioLogueado && usuarioLogueado.rol === rol)){
        return <Outlet />;
    }else if(usuarioLogueado){
        return <Navigate replace to='/' />;
    }else{
        return <Navigate replace to='/login' />;
    }
    
}
export default RolUsuario;