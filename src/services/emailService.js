import { supabase } from "../database/supabaseconfig";

/**
 * Llama a la Edge Function de Supabase para enviar correos
 * @param {string} email - Correo del destinatario
 * @param {string} nombre - Nombre del usuario
 * @param {string} tipo - Tipo de correo ('bienvenida', 'reto', etc.)
 */
export const enviarEmail = async (email, nombre, tipo = 'bienvenida') => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { email, nombre, tipo },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error al enviar email mediante Edge Function:", error);
    return null;
  }
};
