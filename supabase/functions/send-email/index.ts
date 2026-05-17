import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Manejo de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      } 
    })
  }

  try {
    const { email, nombre, tipo, puntos, motivo } = await req.json()

    let subject = ''
    let html = ''

    if (tipo === 'bienvenida') {
      subject = '¡Bienvenido a NewMe! 🦷'
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0d6efd;">¡Hola, ${nombre}! 👋</h2>
          <p>Estamos muy felices de que te unas a <strong>NewMe</strong>.</p>
          <p>Tu viaje hacia una sonrisa saludable y una vida libre de tabaquismo comienza hoy.</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #198754;">🎁 ¡Tienes 100 puntos de regalo!</p>
          </div>
          <p>Entra a la app para completar tu primer reto.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; color: #64748b; text-align: center;">NewMe App - Salud Bucal para Jóvenes</p>
        </div>
      `
    } else if (tipo === 'puntos') {
      subject = `¡Has ganado ${puntos} puntos en NewMe! 🎉`
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #198754;">¡Buen trabajo, ${nombre}! 🌟</h2>
          <p>Acabas de ganar nuevos puntos por tu compromiso con tu salud bucal.</p>
          <div style="background-color: #f0fff4; border: 2px solid #c6f6d5; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <div style="font-size: 40px; margin-bottom: 10px;">✨</div>
            <div style="font-size: 24px; font-weight: bold; color: #2f855a;">+${puntos} Puntos</div>
            <div style="color: #48bb78;">${motivo}</div>
          </div>
          <p>¡Sigue así para subir de nivel y convertirte en un <strong>Embajador Anti-Tabaquismo</strong>!</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <p style="font-size: 12px; color: #64748b; text-align: center;">NewMe App - Salud Bucal para Jóvenes</p>
        </div>
      `
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'NewMe <onboarding@resend.dev>', // Cambia esto por tu dominio verificado
        to: [email],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    })
  }
})
