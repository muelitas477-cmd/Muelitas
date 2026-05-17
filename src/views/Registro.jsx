import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';
import RegistroForm from '../components/auth/RegistroForm';
import { enviarEmail } from '../services/emailService';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    edad: '',
    barrio: '',
    esFumador: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const emailLimpio = (formData.email || '').trim().toLowerCase();
      
      if (!emailLimpio) {
        throw new Error("El correo electrónico es obligatorio");
      }

      if (formData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      // 1. Registrar usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: emailLimpio,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nombre,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Crear perfil en la tabla 'profiles'
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: data.user.id,
              nombre: formData.nombre,
              correo: emailLimpio,
              edad: parseInt(formData.edad) || 0,
              barrio_comunidad: formData.barrio,
              es_fumador: formData.esFumador,
              puntos: 100, // Regalo de bienvenida
              nivel: 'Protector Dental'
            }
          ]);

        if (profileError) {
          console.error("Error al crear perfil:", profileError);
        } else {
          // 3. Enviar correo de bienvenida mediante Edge Function
          await enviarEmail(emailLimpio, formData.nombre, 'bienvenida');
        }
        
        if (data.session) {
          alert("¡Registro exitoso! Ya puedes usar la aplicación.");
          navigate("/");
        } else {
          alert("¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.");
          navigate("/login");
        }
      }
    } catch (err) {
      console.error("Error de registro:", err);
      if (err.message.includes("rate limit")) {
        setError("Has superado el límite de registros permitidos por hora. Por favor, intenta de nuevo más tarde o usa otra red.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <RegistroForm
        formData={formData}
        setFormData={setFormData}
        error={error}
        loading={loading}
        onRegister={handleRegister}
      />
    </Container>
  );
};

export default Registro;
