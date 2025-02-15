import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SalesPhoneService } from '../../services/SalesPhoneService';

const schema = yup.object().shape({
  number: yup
    .number()
    .required('El número de teléfono es requerido')
    .positive('El número de teléfono debe ser positivo'),
  name: yup.string().required('El nombre es requerido'),
  whatsappUrl: yup
    .string()
    .required('La URL de WhatsApp es requerida')
    .url('Ingrese una URL válida'),
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
      const response = await SalesPhoneService.addSalesPhone(data);
      reset(); 
    } catch (error) {
      console.error('Error agregando el teléfono:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-5/6 mx-auto shadow-xl p-12">
      <h2 className="text-center text-2xl ubuntu-medium">Agregar Nuevo</h2>
      <div className="my-4">
        <label htmlFor="number" className="block text-md ubuntu-light text-gray-700">
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
          <span className="text-red-500 text-md">{errors.number.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-md ubuntu-light text-gray-700">
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
          <span className="text-red-500 text-md">{errors.name.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="whatsappUrl" className="block text-md ubuntu-light text-gray-700">
          URL de WhatsApp:
        </label>
        <input
          type="text"
          id="whatsappUrl"
          {...register('whatsappUrl')}
          className={`border border-gray-300 rounded-md p-2 w-full ${
            errors.whatsappUrl ? 'border-red-500' : ''
          }`}
        />
        {errors.whatsappUrl && (
          <span className="text-red-500 text-md">{errors.whatsappUrl.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-800 hover:bg-blue-900 ubuntu-bold text-white py-2 px-4 rounded"
      >
        Guardar
      </button>
    </form>
  );
};

export default WhitePhoneForm;