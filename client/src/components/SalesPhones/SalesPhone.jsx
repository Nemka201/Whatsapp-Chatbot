import React, { useState, useEffect } from 'react';
import { SalesPhoneService } from '../../services/SalesPhoneService';
import SalesPhoneForm from './SalesPhoneForm';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

function SalesPhone() {
  const [salesPhones, setSalesPhones] = useState([]);
  const [editingSalesPhone, setEditingSalesPhone] = useState(null);
  const [editedSalesPhone, setEditedSalesPhone] = useState(null);

  useEffect(() => {
    const fetchSalesPhones = async () => {
      try {
        const response = await SalesPhoneService.getAllSalesPhones();
        setSalesPhones(response);
      } catch (error) {
        console.error('Error al obtener los teléfonos:', error);
      }
    };

    fetchSalesPhones();
  }, []);

  const handleEdit = (salesPhone) => {
    setEditingSalesPhone(salesPhone);
    setEditedSalesPhone({ ...salesPhone }); // Crear una copia para edición
  };

  const handleSave = async () => {
    try {
      console.log("Datos a guardar antes de limpieza:", editedSalesPhone);
  
      const cleanedSalesPhone = {
        ...editedSalesPhone,
        phone: Number(editedSalesPhone.phone), // Asegurar que es número
        whatsappUrl: editedSalesPhone.whatsappUrl?.trim(), // Eliminar espacios en blanco y tabulaciones
        name: editedSalesPhone.name?.trim(),
      };
  
      console.log("Datos a guardar después de limpieza:", cleanedSalesPhone);
  
      await SalesPhoneService.updateSalesPhone(
        cleanedSalesPhone._id,
        cleanedSalesPhone.phone,
        cleanedSalesPhone.name,
        cleanedSalesPhone.whatsappUrl,
      );
  
      // Actualizar la lista de teléfonos
      const updatedSalesPhones = salesPhones.map((s) =>
        s._id === cleanedSalesPhone._id ? cleanedSalesPhone : s
      );
      setSalesPhones(updatedSalesPhones);
      setEditingSalesPhone(null);
    } catch (error) {
      console.error('Error al actualizar el teléfono:', error);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await SalesPhoneService.deleteSalesPhone(id);
      setSalesPhones(salesPhones.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Error al eliminar el teléfono:', error);
    }
  };

  return (
    <div className="flex my-10 mb-4">
      <div className="md:w-full lg:w-1/2">
        <SalesPhoneForm />
      </div>

      <div className="md:w-full lg:w-1/2 p-4 overflow-x-auto mt-5 mb-11">
        <table className="table table-zebra ubuntu-light-italic">
          <thead>
            <tr className="ubuntu-medium">
              <th>Nombre</th>
              <th>Número</th>
              <th>Whatsapp URL</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salesPhones.map((salesPhone) => (
              <tr key={salesPhone._id}>
                <td>
                  {editingSalesPhone && editingSalesPhone._id === salesPhone._id ? (
                    <input
                      type="text"
                      value={editedSalesPhone.name}
                      onChange={(e) =>
                        setEditedSalesPhone({
                          ...editedSalesPhone,
                          name: e.target.value
                        })
                      }
                    />
                  ) : (
                    salesPhone.name
                  )}
                </td>
                <td>
                  {editingSalesPhone && editingSalesPhone._id === salesPhone._id ? (
                    <input
                      type="number"
                      value={editedSalesPhone.phone}
                      onChange={(e) =>
                        setEditedSalesPhone({
                          ...editedSalesPhone,
                          phone: Number(e.target.value)
                        })
                      }
                    />
                  ) : (
                    salesPhone.phone
                  )}
                </td>
                <td>
                  {editingSalesPhone && editingSalesPhone._id === salesPhone._id ? (
                    <input
                      type="text"
                      value={editedSalesPhone.whatsappUrl || ''}
                      onChange={(e) =>
                        setEditedSalesPhone({
                          ...editedSalesPhone,
                          whatsappUrl: e.target.value
                        })
                      }
                    />
                  ) : (
                    salesPhone.whatsappUrl
                  )}
                </td>
                <td>
                  {editingSalesPhone && editingSalesPhone._id === salesPhone._id ? (
                    <button onClick={handleSave} className="btn btn-ghost hover:bg-blue-900 hover:text-white">Guardar</button>
                  ) : (
                    <div className="flex lg:ms-5">
                      <FaPencilAlt
                        className="cursor-pointer"
                        onClick={() => handleEdit(salesPhone)}
                      />
                      <FaTrash
                        className="cursor-pointer ml-2 text-red-600"
                        onClick={() => handleDelete(salesPhone._id)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesPhone;