const NodeCache = require('node-cache');
const salesPhone = require('../models/salesPhone.model');

const cache = new NodeCache({ stdTTL: 86400 }); // 24 horas de TTL

class SalesPhoneService {
    
    static async getAllSalesPhones() {
        const cachedPhones = cache.get('allPhones');
        if (cachedPhones) return cachedPhones;

        try {
            const phones = await salesPhone.find();
            cache.set('allPhones', phones, 86400);
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

            // **Actualizar caché**
            let cachedPhones = cache.get('allPhones') || [];
            cachedPhones.push(newSalesPhone);
            cache.set('allPhones', cachedPhones, 86400);

            return newSalesPhone;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async getSalesPhoneById(id) {
        try {
            return await salesPhone.findById(id);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async deleteSalesPhone(id) {
        try {
            await salesPhone.findByIdAndDelete(id);

            // **Actualizar caché eliminando el elemento**
            let cachedPhones = cache.get('allPhones') || [];
            cachedPhones = cachedPhones.filter(phone => phone._id.toString() !== id);
            cache.set('allPhones', cachedPhones, 86400);

        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async updateSalesPhone(id, updateData) {
        try {
            const updatedSalesPhone = await salesPhone.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedSalesPhone) throw new Error('Sales phone not found');

            // **Actualizar caché**
            let cachedPhones = cache.get('allPhones') || [];
            cachedPhones = cachedPhones.map(phone => 
                phone._id.toString() === id ? updatedSalesPhone : phone
            );
            cache.set('allPhones', cachedPhones, 86400);

            return updatedSalesPhone;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

module.exports = SalesPhoneService;
