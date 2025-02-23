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

        // Obtener el QR inmediatamente
        fetchQRCode();

        // Configurar la actualización cada 15 segundos
        const intervalId = setInterval(fetchQRCode, 15000);

        // Limpiar el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-base-200 py-4 pt-14 shadow-sm md:px-10 lg:px-20 pb-16s">
            {qrCode ? (
                <>
                    <h2 className='text-center ubuntu-medium text-2xl'>Inicie sesión</h2>
                    <p className='text-center ubuntu-light mb-3'>Utilice el código QR para ingresar.</p>
                    <img src={qrCode} alt="QR code" className='justify-self-center' />
                </>
            ) : (
                <>
                    <h2 className='text-center ubuntu-medium text-2xl'>Estado activo</h2>
                </>
            )}
        </div>
    );
}

export default Status;
