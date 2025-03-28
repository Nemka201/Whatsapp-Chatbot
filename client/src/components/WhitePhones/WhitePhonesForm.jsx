import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { WhitePhoneService } from '../../services/WhitePhoneService';

const schema = yup.object().shape({
  number: yup
    .number()
    .required('El número de teléfono es requerido')
    .positive('El número de teléfono debe ser positivo'),
  name: yup.string().required('El nombre es requerido'),
});

const WhitePhoneForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await WhitePhoneService.addWhitePhone(data); 
      console.log('Teléfono agregado:', response); 
      reset(); 
    } catch (error) {
      console.error('Error agregando el teléfono:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-5/6 mx-auto  shadow-xl p-12">
      <h2 className="text-center ubuntu-medium text-2xl">Agregar Nuevo</h2>
      <div className="my-4">
        <label htmlFor="number" className="block text-md text-gray-700 ubuntu-light">
          Teléfono:
        </label>
        <input
          type="number"
          id="number"
          {...register('number')}
          className={`border border-gray-300 rounded-md p-2 w-full ${
            errors.number ? 'border-red-500' : ''
          }`}
        />
        {errors.number && (
          <span className="text-red-500 text-sm">{errors.v.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-md text-gray-700 ubuntu-light">
          Nombre:
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={`border border-gray-300 rounded-md p-2 w-full ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-800 hover:bg-blue-900 ubuntu-bold text-white font-bold py-2 px-4 rounded"
      >
        Guardar
      </button>
    </form>
  );
};

export default WhitePhoneForm;