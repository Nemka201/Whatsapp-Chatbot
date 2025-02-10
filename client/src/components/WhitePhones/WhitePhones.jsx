import React, { useState, useEffect } from 'react';
import { WhitePhoneService } from '../../services/WhitePhoneService';
import WhitePhoneForm from './WhitePhonesForm';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

function WhitePhone() {
  const [WhitePhones, setWhitePhones] = useState([]);
  const [editingWhitePhone, setEditingWhitePhone] = useState(null); 
  const [editedWhitePhone, setEditedWhitePhone] = useState(null); 

  useEffect(() => {
    const fetchWhitePhones = async () => {
      try {
        const response = await WhitePhoneService.getAllWhitePhones();
        setWhitePhones(response);
      } catch (error) {
        console.error('Error al obtener los teléfonos:', error);
      }
    };

    fetchWhitePhones();
  }, []);

  const handleEdit = (WhitePhone) => {
    setEditingWhitePhone(WhitePhone);
    setEditedWhitePhone({ ...WhitePhone }); // Crear una copia para edición
  };

  const handleSave = async () => {
    try {
      await WhitePhoneService.updateWhitePhone(
        editedWhitePhone._id,
        editedWhitePhone.phone,
        editedWhitePhone.name
      );
      // Actualizar la lista de teléfonos
      const updatedWhitePhones = WhitePhones.map((s) =>
        s._id === editedWhitePhone._id ? editedWhitePhone : s
      );
      setWhitePhones(updatedWhitePhones);
      setEditingWhitePhone(null); 
    } catch (error) {
      console.error('Error al actualizar el teléfono:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await WhitePhoneService.deleteWhitePhone(id);
      setWhitePhones(WhitePhones.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Error al eliminar el teléfono:', error);
    }
  };

  return (
    <div className="flex my-10 mb-4">
      <div className="md:w-full lg:w-1/2 p-4 bg-white">
        <WhitePhoneForm /> 
      </div>

      <div className="md:w-full lg:w-1/2 p-4 overflow-x-auto mt-5 mb-11">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Número</th>
              <th>Acciones</th> 
            </tr>
          </thead>
          <tbody>
            {WhitePhones.map((whitePhone) => (
              <tr key={whitePhone._id}> 
                <td>
                  {editingWhitePhone && editingWhitePhone._id === whitePhone._id ? (
                    <input 
                      type="text" 
                      value={editedWhitePhone.name} 
                      onChange={(e) => 
                        setEditedWhitePhone({ 
                          ...editedWhitePhone, 
                          name: e.target.value 
                        }) 
                      } 
                    />
                  ) : (
                    WhitePhone.name
                  )}
                </td>
                <td>
                  {editingWhitePhone && editingWhitePhone._id === whitePhone._id ? (
                    <input 
                      type="number" 
                      value={editedWhitePhone.phone} 
                      onChange={(e) => 
                        setEditedWhitePhone({ 
                          ...editedWhitePhone, 
                          phone: Number(e.target.value) 
                        }) 
                      } 
                    />
                  ) : (
                    whitePhone.phone
                  )}
                </td>
                <td>
                  {editingWhitePhone && editingWhitePhone._id === whitePhone._id ? (
                    <button onClick={handleSave} className="btn btn-ghost hover:bg-blue-900 hover:text-white">Guardar</button> 
                  ) : (
                    <div className="flex lg:ms-5">
                      <FaPencilAlt 
                        className="cursor-pointer" 
                        onClick={() => handleEdit(whitePhone)} 
                      />
                      <FaTrash 
                        className="cursor-pointer ml-2 text-red-600" 
                        onClick={() => handleDelete(whitePhone._id)} 
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

export default WhitePhone;