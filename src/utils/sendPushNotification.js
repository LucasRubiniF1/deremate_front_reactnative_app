export async function sendPushNotification(expoPushToken, title = '🚚 Paquete nuevo', body = 'Tocá para ver el detalle del envío', screen = 'Home') {
    if (!expoPushToken) {
        console.warn('⚠️ Token no válido para notificación push');
        return;
    }

    const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: { screen },
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
