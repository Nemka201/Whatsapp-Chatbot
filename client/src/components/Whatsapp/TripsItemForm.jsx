import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TripItemService } from '../../services/TripItemService';

const schema = yup.object().shape({
    messageText: yup.string().required('El mensaje es requerido'),
    departureDate: yup.date().required('La fecha de salida es requerida'),
    returnDate: yup.date().required('La fecha de vuelta es requerida'),
    days: yup.number().required('La cantidad de días es requerida').typeError("Debe ser un número"),
    nights: yup.number().required('La cantidad de noches es requerida').typeError("Debe ser un número"),
    price: yup.number().required('El precio es requerido').typeError("Debe ser un número"),
    images: yup.array().of(yup.mixed()).optional(), // Validación para las imágenes
});

function TripItemForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages(files);

        // Previsualización de imágenes (opcional)
        const urls = files.map(file => URL.createObjectURL(file));
        setImageUrls(urls);
    };

    const parseDates = (data) => {
        return {
            ...data,
            departureDate: data.departureDate.toISOString(),
            returnDate: data.returnDate.toISOString(),
        };
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Parsear las fechas antes de enviar
            const parsedData = parseDates(data);

            // Crear un objeto FormData para enviar archivos
            const formData = new FormData();

            // Agregar los datos del formulario (usando parsedData)
            for (const key in parsedData) {
                if (key !== 'images') { // Excluir el campo de imágenes
                    formData.append(key, parsedData[key]);
                }
            }

            // Verificar antes de mapear
            if (Array.isArray(selectedImages) && selectedImages.length > 0) {
                selectedImages.forEach(image => {
                    formData.append('images', image);
                });
            }
            console.log("selectedImages:", selectedImages);
            console.log("FormData contenido:", [...formData.entries()]);
            const response = await TripItemService.addMenuItem(formData); // Enviar el FormData
            console.log('Respuesta agregada:', response);
            reset();
            setSelectedImages([]); // Limpiar imágenes seleccionadas
            setImageUrls([]); // Limpiar URLs de previsualización
            handleModalClose();
        } catch (error) {
            console.error('Error agregando respuesta:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button className="btn btn-primary btn-ghost" onClick={handleModalOpen}>Agregar viajes</button>
            {isModalOpen && (
                <dialog id="my_modal_4" className="modal" open>
                    <div className="modal-box w-1/2 max-w-5xl">
                        <form onSubmit={handleSubmit(onSubmit)} className="p-5 rounded-md mx-auto">
                                <div className="mb-4">
                                <label htmlFor="messageText" className="block text-sm font-medium text-gray-700">Mensaje:</label>
                                <textarea id="messageText" {...register('messageText')} className={`border border-gray-300 rounded-md p-2 w-full ${errors.messageText ? 'border-red-500' : ''}`} />
                                {errors.messageText && <span className="text-red-500 text-sm">{errors.messageText.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Fecha de Salida:</label>
                                <input type="date" id="departureDate" {...register('departureDate')} className={`border border-gray-300 rounded-md p-2 w-full ${errors.departureDate ? 'border-red-500' : ''}`} />
                                {errors.departureDate && <span className="text-red-500 text-sm">{errors.departureDate.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Fecha de Vuelta:</label>
                                <input type="date" id="returnDate" {...register('returnDate')} className={`border border-gray-300 rounded-md p-2 w-full ${errors.returnDate ? 'border-red-500' : ''}`} />
                                {errors.returnDate && <span className="text-red-500 text-sm">{errors.returnDate.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="days" className="block text-sm font-medium text-gray-700">Días:</label>
                                <input type="number" id="days" {...register('days')} className={`border border-gray-300 rounded-md p-2 w-full ${errors.days ? 'border-red-500' : ''}`} />
                                {errors.days && <span className="text-red-500 text-sm">{errors.days.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="nights" className="block text-sm font-medium text-gray-700">Noches:</label>
                                <input type="number" id="nights" {...register('nights')} className={`border border-gray-300 rounded-md p-2 w-full ${errors.nights ? 'border-red-500' : ''}`} />
                                {errors.nights && <span className="text-red-500 text-sm">{errors.nights.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio:</label>
                                <input type="number" id="price" {...register('price')} className={`border border-gray-300 rounded-md p-2 w-full ${errors.price ? 'border-red-500' : ''}`} />
                                {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="images" className="block text-sm font-medium text-gray-700">Imágenes:</label>
                                <input type="file" id="images" name="images" multiple onChange={handleImageChange} className="border border-gray-300 rounded-md p-2 w-full" />
                                {/* Previsualización de imágenes */}
                                <div className="flex mt-2">
                                    {imageUrls.map((url, index) => (
                                        <img key={index} src={url} alt={`Imagen ${index + 1}`} className="w-20 h-20 mr-2 rounded" />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-row-reverse">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 hover:bg-blue-700 text-white btn ms-2 px-8"
                                >
                                    Guardar
                                </button>
                                <button className="btn" onClick={handleModalClose}>Cerrar</button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </>
    );
}

export default TripItemForm;