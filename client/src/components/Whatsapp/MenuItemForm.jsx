import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MenuItemService } from '../../services/MenuItemService';

const schema = yup.object().shape({
    command: yup
        .number()
        .required('El comando es requerido'),
    commandType: yup
        .string()
        .required('El tipo de comando es requerido'),
    messageText: yup
        .string()
        .required('El mensaje es requerido'),
});

function MenuItemForm() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parentMenus, setParentMenus] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchParentMenus = async () => {
            try {
                const response = await MenuItemService.getAllMenuItems();
                const parentMenus = response.filter(item => item.commandType === 'Menu');
                setParentMenus(parentMenus);
            } catch (error) {
                console.error('Error al obtener los menús:', error);
            }
        };

        fetchParentMenus();
    }, []);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await MenuItemService.addMenuItem(data);
            console.log('Respuesta agregada:', response);
            reset();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error agregando respuesta:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button className="btn btn-primary btn-ghost" onClick={handleModalOpen}>Agregar respuesta</button>
            {isModalOpen && (
                <dialog id="my_modal_4" className="modal" open>
                    <div className="modal-box w-1/2 max-w-5xl">
                        <h3 className="font-bold text-lg text-center">Agregar respuesta</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-5 rounded-md mx-auto">
                            <div className="mb-4">
                                <label htmlFor="command" className="block text-sm font-medium text-gray-700">
                                    Comando:
                                </label>
                                <input
                                    type="number"
                                    id="command"
                                    {...register('command')}
                                    className={`border border-gray-300 rounded-md p-2 w-full ${errors.command ? 'border-red-500' : ''}`}
                                />
                                {errors.command && (
                                    <span className="text-red-500 text-sm">{errors.command.message}</span>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="commandType" className="block text-sm font-medium text-gray-700">
                                    Tipo de Comando:
                                </label>
                                <select
                                    id="commandType"
                                    {...register('commandType')}
                                    className={`border border-gray-300 rounded-md p-2 w-full ${errors.commandType ? 'border-red-500' : ''}`}
                                >
                                    <option value="Text message">Texto</option>
                                    {/* Agregar más tipos de comando si es necesario */}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="messageText" className="block text-sm font-medium text-gray-700">
                                    Mensaje:
                                </label>
                                <textarea
                                    id="messageText"
                                    {...register('messageText')}
                                    className={`border border-gray-300 rounded-md p-2 w-full ${errors.messageText ? 'border-red-500' : ''}`}
                                />
                                {errors.messageText && (
                                    <span className="text-red-500 text-sm">{errors.messageText.message}</span>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="parentMenu" className="block text-sm font-medium text-gray-700">
                                    Menú Padre:
                                </label>
                                <select
                                    id="parentMenu"
                                    {...register('parentMenu')}
                                    className={`border border-gray-300 rounded-md p-2 w-full`}
                                >
                                    <option value="">Seleccionar menú padre</option>
                                    {parentMenus.map(menu => (
                                        <option key={menu._id} value={menu._id}>
                                            {menu.messageText}
                                        </option>
                                    ))}
                                </select>
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

export default MenuItemForm;