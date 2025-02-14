import React, { useState, useEffect } from 'react';
import { WhatsappWebService } from '../../services/WhatsappWebService';

function Status() {
    const [qrCode, setQRCode] = useState('');

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const qr = await WhatsappWebService.getQR();
                setQRCode(qr);
            } catch (error) {
                console.error('Error al obtener el QR:', error);
            }
        };

        fetchQRCode();
    }, []);

    return (
        <div className="bg-base-200 py-4 shadow-sm">
            {qrCode ? (<><h2 className='text-center text-white text-2xl text'>Inicie sesion</h2>
                <p className='text-center mb-3'>Utilice el codigo QR para ingresar.</p>
                <img src={qrCode} alt="QR code" className=' justify-self-center' /></>) : (<><h2 className='text-center text-white text-2xl text'>Estado activo</h2></>)}

        </div>
    );
}

export default Status;