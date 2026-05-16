import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';
import RegistroForm from '../components/auth/RegistroForm';

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
      // 1. Registrar usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 2. Crear perfil en la tabla 'profiles'
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              nombre: formData.nombre,
              correo: formData.email,
              edad: parseInt(formData.edad),
              barrio_comunidad: formData.barrio,
              es_fumador: formData.esFumador,
              puntos: 100, // Regalo de bienvenida
              nivel: 'Protector Dental'
            }
          ]);

        if (profileError) throw profileError;
        
        alert("¡Registro exitoso! Por favor revisa tu correo para confirmar tu cuenta.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
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
