import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form'; 
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserService } from '../../services/UserService';

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
  const [userService] = useContext(UserService); // Import useContext
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
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="nombreCompleto">
        Full Name:
        <input
          type="text"
          id="nombreCompleto"
          {...register('nombreCompleto')}
          className={errors.nombreCompleto ? 'error-input' : ''}
        />
        {errors.nombreCompleto && <span className="error-message">{errors.nombreCompleto.message}</span>}
      </label>
      <br />
      <label htmlFor="numeroTelefono">
        Phone Number:
        <input
          type="tel"
          id="numeroTelefono"
          {...register('numeroTelefono')}
          className={errors.numeroTelefono ? 'error-input' : ''}
        />
        {errors.numeroTelefono && <span className="error-message">{errors.numeroTelefono.message}</span>}
      </label>
      <br />
      <label htmlFor="usuario">
        Username:
        <input
          type="text"
          id="usuario"
          {...register('usuario')}
          className={errors.usuario ? 'error-input' : ''}
        />
        {errors.usuario && <span className="error-message">{errors.usuario.message}</span>}
      </label>
      <br />
      <label htmlFor="contrasena">
        Password:
        <input
          type="password"
          id="contrasena"
          {...register('contrasena')}
          className={errors.contrasena ? 'error-input' : ''}
        />
        {errors.contrasena && <span className="error-message">{errors.contrasena.message}</span>}
      </label>
      <br />
      <label htmlFor="fechaAlta">
        Fecha de Alta: 
        <input 
          type="date" 
          id="fechaAlta" 
          {...register('fechaAlta')} 
        /> 
      </label>
      <br /> 
      <br /> 
      <button type="submit" disabled={isSubmitting}>
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;