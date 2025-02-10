import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom'; 

const schema = yup.object().shape({
  username: yup
    .string()
    .required('El usuario es obligatorio')
    .min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const LoginForm = () => {
  const { userService } = useContext(UserContext);
  const navigate = useNavigate(); 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await userService.loginUser(data.username, data.password);
      console.log('Login exitoso:');
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (error) {
      console.error('Error en el login:', error);
      setErrorMessage('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-5 rounded-md shadow-md xl:w-1/3 md:w-1/2 sm:w-5/6 mx-auto"
    >
      <h2 className="text-center text-lg font-bold mb-4">Iniciar Sesión</h2>



      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Usuario:
        </label>
        <input
          type="text"
          id="username"
          {...register('username')}
          className={`border border-gray-300 rounded-md p-2 w-full ${errors.username ? 'border-red-500' : ''
            }`}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">{errors.username.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña:
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`border border-gray-300 rounded-md p-2 w-full ${errors.password ? 'border-red-500' : ''
            }`}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password.message}</span>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full"
      >
        {loading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
};

export default LoginForm;