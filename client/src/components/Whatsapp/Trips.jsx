import React, { useState, useEffect } from 'react';
import { TripItemService } from '../../services/TripItemService';
import TripsItemForm from './TripsItemForm';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useMemo } from 'react';

function Trips() {
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editedMenuItem, setEditedMenuItem] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await TripItemService.getAllMenuItems();
        setMenuItems(response);
      } catch (error) {
        console.error('Error al obtener los menús:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleEdit = (menuItem) => {
    setEditingMenuItem(menuItem);
    setEditedMenuItem({ ...menuItem }); // Crear una copia para edición
  };

  const handleSave = async () => {
    try {
      await TripItemService.updateMenuItem(
        editedMenuItem._id,
        editedMenuItem
      );
      // Actualizar la lista de menús
      const updatedMenuItems = menuItems.map((m) =>
        m._id === editedMenuItem._id ? editedMenuItem : m
      );
      setMenuItems(updatedMenuItems);
      setEditingMenuItem(null);
    } catch (error) {
      console.error('Error al actualizar el menú:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await TripItemService.deleteMenuItem(id);
      setMenuItems(menuItems.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Error al eliminar el menú:', error);
    }
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
        <tr key={item._id}>
            {/* Renderizado de los campos */}
            <td>{editingMenuItem && editingMenuItem._id === item._id ? (
                <input type="text" value={editedMenuItem.messageText} onChange={(e) => setEditedMenuItem({ ...editedMenuItem, messageText: e.target.value })} />
            ) : (item.messageText)}</td>
            <td>{editingMenuItem && editingMenuItem._id === item._id ? (
                <input type="date" value={editedMenuItem.departureDate.slice(0, 10)} onChange={(e) => setEditedMenuItem({ ...editedMenuItem, departureDate: e.target.value })} />
            ) : (new Date(item.departureDate).toLocaleDateString())}</td>
            <td>{editingMenuItem && editingMenuItem._id === item._id ? (
                <input type="date" value={editedMenuItem.returnDate.slice(0, 10)} onChange={(e) => setEditedMenuItem({ ...editedMenuItem, returnDate: e.target.value })} />
            ) : (new Date(item.returnDate).toLocaleDateString())}</td>
            <td>{editingMenuItem && editingMenuItem._id === item._id ? (
                <input type="number" value={editedMenuItem.days} onChange={(e) => setEditedMenuItem({ ...editedMenuItem, days: Number(e.target.value) })} />
            ) : (item.days)}</td>
            <td>{editingMenuItem && editingMenuItem._id === item._id ? (
                <input type="number" value={editedMenuItem.nights} onChange={(e) => setEditedMenuItem({ ...editedMenuItem, nights: Number(e.target.value) })} />
            ) : (item.nights)}</td>
            <td>{editingMenuItem && editingMenuItem._id === item._id ? (
                <input type="number" value={editedMenuItem.price} onChange={(e) => setEditedMenuItem({ ...editedMenuItem, price: Number(e.target.value) })} />
            ) : (item.price)}</td>

            <td>
                {editingMenuItem && editingMenuItem._id === item._id ? (
                    <button onClick={handleSave} className="btn btn-ghost hover:bg-blue-900 hover:text-white">Guardar</button>
                ) : (
                    <div className="flex lg:ms-5">
                        <FaPencilAlt className="cursor-pointer" onClick={() => handleEdit(item)} />
                        <FaTrash className="cursor-pointer ml-2 text-red-600" onClick={() => handleDelete(item._id)} />
                    </div>
                )}
            </td>

        </tr>
    ));
};

  return (
    <div className="p-4 overflow-x-aut shadow-sm mt-2 bg-base-200 py-12">
      <h2 className="text-center ubuntu-medium text-3xl my-4">Viajes Luzara</h2>
      <table className="table table-zebra ubuntu-light sm:text-sm">
        <thead>
          <tr className='ubuntu-medium'>
            <th>Mensaje</th>
            <th>Fecha salida</th>
            <th>Fecha regreso</th>
            <th>Dias</th>
            <th>Noches</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {renderMenuItems(menuItems)}
        </tbody>
      </table>
      <div className="flex flex-row-reverse mt-20">
        <TripsItemForm />
      </div>
    </div>
  );
}

export default Trips;