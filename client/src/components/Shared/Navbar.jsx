import React from 'react';
import { Link } from 'react-router-dom';

const handLogout = () =>{
  localStorage.removeItem('token');
}

function Navbar() {
  return (
    <div className="navbar bg-blue-950 text-white ubuntu-light">
      <div className="flex-none">
      </div>
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl ubuntu-medium">
          Whatsapp Chatbot
        </Link>
      </div>
      <div className="flex-2"> 
        <Link to="/Sales-phones" className="btn btn-ghost text-sm mx-0">
          Vendedores
        </Link>
        <Link to="/White-phones" className="btn btn-ghost text-sm mx-0">
          Restringidos
        </Link>
        <Link to="/Whatsapp" className="btn btn-ghost text-sm mx-0">
          Chatbot
        </Link>
        <button className="btn btn-ghost text-sm mx-0" onClick={handLogout}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default Navbar;