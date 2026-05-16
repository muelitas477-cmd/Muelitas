/**
 * Ejemplo de Firebase Function para enviar correos con Resend
 * 
 * Para usar esto, debes inicializar Firebase Functions en tu proyecto:
 * 1. firebase init functions
 * 2. npm install resend
 */

const functions = require('firebase-functions');
const { Resend } = require('resend');

const resend = new Resend('TU_API_KEY_DE_RESEND');

// Función que se dispara cuando se crea un nuevo perfil en Supabase (vía Webhook)
// O puede ser llamada directamente desde el frontend
exports.enviarCorreoBienvenida = functions.https.onCall(async (data, context) => {
  const { email, nombre } = data;

  try {
    const response = await resend.emails.send({
      from: 'Muelitas <hola@tu-dominio.com>',
      to: [email],
      subject: '¡Bienvenido a Muelitas! 🦷🚭',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #007bff;">¡Hola, ${nombre}! 👋</h2>
          <p>Bienvenido a la comunidad <strong>Muelitas</strong>. Estamos muy felices de tenerte con nosotros.</p>
          <p>Tu viaje hacia una sonrisa más saludable y una vida libre de tabaco comienza hoy.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28a745;">Tu primer reto:</h3>
            <p>Entra hoy a la app y completa tu primera encuesta para ganar 100 puntos.</p>
          </div>
          
          <p>Recuerda: <strong>Tu sonrisa vale más.</strong></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">
            Muelitas App - Concientización sobre salud bucal y tabaco.
          </p>
        </div>
      `,
    });

    return { success: true, id: response.id };
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new functions.https.HttpsError('internal', 'No se pudo enviar el correo.');
  }
});

// Ejemplo de recordatorio diario (Cron job)
exports.recordatorioDiario = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  // Aquí podrías obtener los correos de Supabase y enviar recordatorios masivos
  console.log("Enviando recordatorios diarios...");
});
