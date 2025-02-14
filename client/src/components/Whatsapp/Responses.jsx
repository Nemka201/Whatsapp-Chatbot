import React, { useState, useEffect } from 'react';
import { MenuItemService } from '../../services/MenuItemService';
import MenuItemForm from './MenuItemForm';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useMemo } from 'react';

function MenuItemList() {
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editedMenuItem, setEditedMenuItem] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await MenuItemService.getAllMenuItems();
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
      await MenuItemService.updateMenuItem(
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
      await MenuItemService.deleteMenuItem(id);
      setMenuItems(menuItems.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Error al eliminar el menú:', error);
    }
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <tr key={item._id}>
        <td>
          {editingMenuItem && editingMenuItem._id === item._id ? (
            <input
              type="number"
              value={editedMenuItem.command}
              onChange={(e) =>
                setEditedMenuItem({
                  ...editedMenuItem,
                  command: Number(e.target.value)
                })
              }
            />
          ) : (
            item.command
          )}
        </td>
        <td>
          {editingMenuItem && editingMenuItem._id === item._id ? (
            <select
              value={editedMenuItem.commandType}
              onChange={(e) =>
                setEditedMenuItem({
                  ...editedMenuItem,
                  commandType: e.target.value
                })
              }
            >
              <option value="Text message">Texto</option>
              {/* Agregar más tipos de comando si es necesario */}
            </select>
          ) : (
            item.commandType
          )}
        </td>
        <td>
          {editingMenuItem && editingMenuItem._id === item._id ? (
            <input
              type="text"
              value={editedMenuItem.messageText}
              onChange={(e) =>
                setEditedMenuItem({
                  ...editedMenuItem,
                  messageText: e.target.value
                })
              }
            />
          ) : (
            item.messageText
          )}
        </td>
        <td>
          {editingMenuItem && editingMenuItem._id === item._id ? (
            <button onClick={handleSave} className="btn btn-ghost hover:bg-blue-900 hover:text-white">Guardar</button>
          ) : (
            <div className="flex lg:ms-5">
              <FaPencilAlt
                className="cursor-pointer"
                onClick={() => handleEdit(item)}
              />
              <FaTrash
                className="cursor-pointer ml-2 text-red-600"
                onClick={() => handleDelete(item._id)}
              />
            </div>
          )}
        </td>
        {item.subMenuItems && (
          <tr>
            <td colSpan={4} className="pl-10">
              <ul>
                {renderMenuItems(item.subMenuItems)}
              </ul>
            </td>
          </tr>
        )}
      </tr>
    ));
  };

  return (
    <div className="md:w-full p-4 overflow-x-aut shadow-sm">
      <h2 className="text-center text-3xl my-8">RESPUESTAS CHATBOT</h2>
      <table className="table table-zebra sm:text-sm">
        <thead>
          <tr>
            <th>Comando</th>
            <th>Tipo de Comando</th>
            <th>Mensaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {renderMenuItems(menuItems)}
        </tbody>
      </table>
      <div className="flex flex-row-reverse mt-24">
        <MenuItemForm />
      </div>
    </div>
  );
}

export default MenuItemList;