export async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: '🚚 Paquete nuevo',
        body: 'Tocá para ver el detalle del envío',
        data: { screen: 'Home' }, // o cualquier pantalla de tu stack
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const data = await response.json();
        console.log('✅ Notificación enviada:', data);
    } catch (error) {
        console.error('❌ Error al enviar notificación:', error);
    }
}
