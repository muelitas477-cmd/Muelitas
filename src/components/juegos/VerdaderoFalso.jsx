import React, { useState } from 'react';
import { Button, Alert, Card, ProgressBar } from 'react-bootstrap';
import { supabase } from '../../database/supabaseconfig';
import { enviarNotificacionPuntos } from '../../services/notificationService';

const preguntas = [
  {
    pregunta: "¿El tabaco solo afecta los pulmones?",
    respuesta: false,
    explicacion: "Falso. El tabaco también causa cáncer oral, enfermedades de las encías y pérdida de dientes."
  },
  {
    pregunta: "¿El vapeo es una alternativa 100% segura para los dientes?",
    respuesta: false,
    explicacion: "Falso. El vapeo reduce el flujo de saliva y puede causar inflamación en las encías."
  },
  {
    pregunta: "¿Se debe cepillar los dientes al menos 2 veces al día?",
    respuesta: true,
    explicacion: "¡Correcto! Lo ideal es después de cada comida, especialmente antes de dormir."
  },
  {
    pregunta: "¿El hilo dental es opcional si usas un buen cepillo?",
    respuesta: false,
    explicacion: "Falso. El cepillo no llega al 40% de las superficies dentales, el hilo es esencial."
  }
];

const VerdaderoFalso = ({ alTerminar }) => {
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [terminado, setTerminado] = useState(false);

  const manejarRespuesta = (respuestaUsuario) => {
    const correcta = preguntas[indice].respuesta === respuestaUsuario;
    if (correcta) setPuntos(puntos + 25);
    
    setFeedback({
      correcta,
      explicacion: preguntas[indice].explicacion
    });
  };

  const siguientePregunta = () => {
    setFeedback(null);
    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      setTerminado(true);
      guardarProgreso();
    }
  };

  const guardarProgreso = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('games_progress').insert({
        user_id: user.id,
        juego: 'verdadero_falso',
        puntos_ganados: puntos,
        score: puntos
      });
      
      // Actualizar puntos del perfil
      const { data: perfil } = await supabase.from('profiles').select('puntos').eq('id', user.id).single();
      await supabase.from('profiles').update({ puntos: (perfil?.puntos || 0) + puntos }).eq('id', user.id);
      
      // Enviar notificación al sistema
      if (puntos > 0) {
        await enviarNotificacionPuntos(puntos, "Completar Mito o Realidad");
      }
    }
  };

  if (terminado) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-trophy-fill text-warning display-1 mb-3"></i>
        <h3 className="fw-bold">¡Juego Terminado!</h3>
        <p className="fs-5">Has ganado <span className="text-primary fw-bold">{puntos} puntos</span></p>
        <Button variant="primary" className="rounded-pill px-5 fw-bold" onClick={alTerminar}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="mb-4">
        <small className="text-muted fw-bold">Pregunta {indice + 1} de {preguntas.length}</small>
        <ProgressBar now={((indice + 1) / preguntas.length) * 100} variant="primary" className="mt-2" style={{ height: '8px' }} />
      </div>

      <Card className="border-0 bg-light p-4 rounded-4 mb-4">
        <h4 className="fw-bold text-center mb-0">{preguntas[indice].pregunta}</h4>
      </Card>

      {feedback ? (
        <div className="text-center animate__animated animate__fadeIn">
          <Alert variant={feedback.correcta ? 'success' : 'danger'} className="rounded-4">
            <h5 className="fw-bold">{feedback.correcta ? '¡Muy bien!' : '¡Oops!'}</h5>
            <p className="mb-0">{feedback.explicacion}</p>
          </Alert>
          <Button variant="primary" className="rounded-pill px-5 fw-bold mt-3" onClick={siguientePregunta}>
            {indice < preguntas.length - 1 ? 'Siguiente' : 'Ver Resultados'}
          </Button>
        </div>
      ) : (
        <div className="d-flex gap-3 justify-content-center">
          <Button variant="success" className="rounded-pill px-5 py-3 fw-bold fs-5" onClick={() => manejarRespuesta(true)}>
            Verdadero
          </Button>
          <Button variant="danger" className="rounded-pill px-5 py-3 fw-bold fs-5" onClick={() => manejarRespuesta(false)}>
            Falso
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerdaderoFalso;
