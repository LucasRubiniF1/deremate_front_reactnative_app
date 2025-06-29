/**
 * Envía una notificación push usando Expo.
 * @param {string} expoPushToken - Token del dispositivo.
 * @param {string} [title='🚚 Paquete nuevo'] - Título de la notificación.
 * @param {string} [body='Tocá para ver el detalle del envío'] - Cuerpo de la notificación.
 * @param {string} [screen='Home'] - Pantalla destino que se abrirá al tocar la notificación.
 * @returns {Promise<object|null>} - Respuesta de Expo o null si falla.
 */
export async function sendPushNotification(
    expoPushToken,
    title = '🚚 Paquete nuevo',
    body = 'Tocá para ver el detalle del envío',
    screen = 'Home'
) {
    if (typeof expoPushToken !== 'string' || !expoPushToken.startsWith('ExponentPushToken')) {
        console.warn('⚠️ Token inválido para notificación push:', expoPushToken);
        return null;
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
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const data = await response.json();
        console.log('✅ Notificación enviada:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al enviar notificación:', error.message);
        return null;
    }
}
