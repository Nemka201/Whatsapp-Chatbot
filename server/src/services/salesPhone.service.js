const NodeCache = require('node-cache');
const salesPhone = require('../models/salesPhone.model');
const cache = new NodeCache({ stdTTL: 86400 }); // 24 horas de TTL

class SalesPhoneService {
    static async getAllSalesPhones() {
        // Verificar si hay datos en el caché
        const cachedPhones = cache.get('allPhones');
        if (cachedPhones) {
            return cachedPhones;
        }

        try {
            const phones = await salesPhone.find();
            cache.set('allPhones', phones, 86400); // Almacenar en el caché por 24 horas
            return phones;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async addSalesPhone(phone, name, whatsappUrl) {
        try {
            const newSalesPhone = new salesPhone({ phone, name, whatsappUrl });
            await newSalesPhone.save();
            return newSalesPhone;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async getSalesPhoneById(id) {
        try {
            const item = await salesPhone.findById(id);
            return item;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async deleteSalesPhone(id) {
        try {
            await salesPhone.findByIdAndDelete(id);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async updateSalesPhone(id, number, name) {
        try {
            const salesPhoneObj = await salesPhone.findById(id);
            if (!salesPhoneObj) {
                throw new Error('Sales phone not found');
            }

            salesPhoneObj.number = number;
            salesPhoneObj.name = name;

            await salesPhoneObj.save();
            return salesPhoneObj;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = SalesPhoneService;