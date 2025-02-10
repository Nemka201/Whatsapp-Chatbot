import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserContext } from '../../context/UserContext';

const schema = yup.object().shape({
  nombreCompleto: yup.string().required('Full name is required'),
  numeroTelefono: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d+$/, 'Phone number must be numeric'),
  usuario: yup.string().required('Username is required'),
  contrasena: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const RegistrationForm = () => {
  const { userService } = useContext(UserContext);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await userService.createUser(data);
      if (response.status === 201) {
        console.log('User registration successful:', response.data);
      } else {
        console.error('User registration failed:', response.data);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <h2 className="text-center text-white text-4xl mb-5">Crea tu cuenta</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 bg-blue-300 p-5 rounded-md shadow-md mx-auto"> 
      <div className="mb-4">
        <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">
          Full Name:
        </label>
        <input
          type="text"
          id="nombreCompleto"
          {...register('nombreCompleto')}
          className={`border border-gray-300 rounded-md p-2 w-full ${errors.nombreCompleto ? 'border-red-500' : ''}`} 
        />
        {errors.nombreCompleto && (
          <span className="text-red-500 text-sm">{errors.nombreCompleto.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="numeroTelefono" className="block text-sm font-medium text-gray-700">
          Phone Number:
        </label>
        <input
          type="tel"
          id="numeroTelefono"
          {...register('numeroTelefono')}
          className={`border border-gray-300 rounded-md p-2 w-full ${errors.numeroTelefono ? 'border-red-500' : ''}`} 
        />
        {errors.numeroTelefono && (
          <span className="text-red-500 text-sm">{errors.numeroTelefono.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
          Username:
        </label>
        <input
          type="text"
          id="usuario"
          {...register('usuario')}
          className={`border border-gray-300 rounded-md p-2 w-full ${errors.usuario ? 'border-red-500' : ''}`} 
        />
        {errors.usuario && (
          <span className="text-red-500 text-sm">{errors.usuario.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
          Password:
        </label>
        <input
          type="password"
          id="contrasena"
          {...register('contrasena')}
          className={`border border-gray-300 rounded-md p-2 w-full ${errors.contrasena ? 'border-red-500' : ''}`} 
        />
        {errors.contrasena && (
          <span className="text-red-500 text-sm">{errors.contrasena.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      >
        Register
      </button>
    </form>
    </>
    
  );
};

export default RegistrationForm;