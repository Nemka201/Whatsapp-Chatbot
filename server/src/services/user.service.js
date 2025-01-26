const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('../utils/jwt'); // Suponiendo que tienes un archivo para manejar JWT

class UserService {
  // Crear un nuevo usuario
  static async createUser({ nombreCompleto, numeroTelefono, usuario, contrasena }) {
    try {
      // Verificar si el nombre de usuario o teléfono ya existe
      const existingUser = await User.findOne({ $or: [{ usuario }, { numeroTelefono }] });
      if (existingUser) {
        throw new Error('Username or phone number already exists');
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const newUser = new User({
        nombreCompleto,
        numeroTelefono,
        usuario,
        contrasena: hashedPassword,
        fechaAlta: Date.now(),
        ingresos: [],
      });

      await newUser.save();
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  // Iniciar sesión de un usuario
  static async loginUser({ usuario, contrasena }) {
    try {
      const user = await User.findOne({ usuario });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Comparar las contraseñas hasheadas
      const isMatch = await bcrypt.compare(contrasena, user.contrasena);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generar el token JWT
      const token = jwt.generateToken(user);
      return token;
    } catch (err) {
      throw err;
    }
  }

  // Obtener usuario por ID
  static async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Contar usuarios
  static async userCount() {
    try {
      const count = await User.countDocuments();
      return count;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
