import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="navbar bg-blue-950 text-white">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Luzara
        </Link>
      </div>
      <div className="flex-2"> 
        <Link to="/Sales-phones" className="btn btn-ghost text-sm mx-0">
          Vendedores
        </Link>
        <Link to="/White-phones" className="btn btn-ghost text-sm mx-0">
          WhitePhones
        </Link>
        <Link to="/Whatsapp" className="btn btn-ghost text-sm mx-0">
          Chatbot
        </Link>
      </div>
    </div>
  );
}

export default Navbar;