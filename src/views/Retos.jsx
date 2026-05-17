import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';
import { enviarNotificacionPuntos } from '../services/notificationService';
import { enviarEmailPuntos } from '../services/emailService';

const Retos = () => {
  const [retos, setRetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetos = async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*');
      
      if (data) setRetos(data);
      setLoading(false);
    };

    fetchRetos();
  }, []);

  const completarReto = async (id, puntos) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Registrar reto completado
      await supabase.from('user_challenges').insert({
        user_id: user.id,
        challenge_id: id,
        completado: true,
        fecha_completado: new Date().toISOString()
      });

      // Sumar puntos
      const { data: perfil } = await supabase.from('profiles').select('puntos').eq('id', user.id).single();
      await supabase.from('profiles').update({ puntos: (perfil?.puntos || 0) + puntos }).eq('id', user.id);
      
      // Notificación al teléfono
      await enviarNotificacionPuntos(puntos, "Completar reto de salud");
      
      // Enviar correo electrónico
      if (perfil) {
        await enviarEmailPuntos(perfil.correo, perfil.nombre, puntos, "Completar reto de salud");
      }

      alert(`¡Felicidades! Has ganado ${puntos} puntos.`);
    }
  };

  const retosPredefinidos = [
    { id: '1', titulo: 'Cepillado 3 veces', descripcion: 'Cepilla tus dientes después de cada comida principal.', puntos: 50, icono: 'bi-droplet', color: 'primary' },
    { id: '2', titulo: 'Cero Humo', descripcion: 'Pasa todo el día sin consumir tabaco ni vapear.', puntos: 100, icono: 'bi-no-circle', color: 'danger' },
    { id: '3', titulo: 'Hidratación Dental', descripcion: 'Toma al menos 2 litros de agua durante el día.', puntos: 30, icono: 'bi-cup-straw', color: 'info' },
    { id: '4', titulo: 'Hilo Dental', descripcion: 'Usa hilo dental antes de dormir.', puntos: 40, icono: 'bi-dash-lg', color: 'success' }
  ];

  const displayRetos = retos.length > 0 ? retos : retosPredefinidos;

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Retos de Salud 🏆</h2>
        <p className="text-muted">Cumple tus objetivos diarios y mejora tu salud.</p>
      </div>

      <Row className="g-4">
        {displayRetos.map((reto) => (
          <Col md={6} key={reto.id}>
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-hover">
              <Card.Body className="p-4 d-flex align-items-center">
                <div className={`bg-light-${reto.color || 'primary'} p-4 rounded-4 me-4 text-${reto.color || 'primary'}`}>
                  <i className={`bi ${reto.icono || 'bi-star'} fs-1`}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{reto.titulo}</h5>
                    <Badge bg={reto.color || 'primary'} className="rounded-pill px-3">+{reto.puntos} pts</Badge>
                  </div>
                  <p className="text-muted small mb-3">{reto.descripcion}</p>
                  <Button 
                    variant={reto.color || 'primary'} 
                    className="rounded-pill px-4 fw-bold w-100"
                    onClick={() => completarReto(reto.id, reto.puntos)}
                  >
                    Marcar como completado
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-5 border-0 bg-primary text-white rounded-4 p-4 shadow-sm">
        <Row className="align-items-center">
          <Col md={8}>
            <h4 className="fw-bold mb-2">Tu racha semanal</h4>
            <p className="mb-3 mb-md-0 opacity-75">Has completado 12 retos esta semana. ¡Vas por excelente camino!</p>
          </Col>
          <Col md={4} className="text-md-end">
            <div className="display-4 fw-bold">12/15</div>
            <ProgressBar now={80} variant="success" className="bg-white-50 mt-2" style={{ height: '10px' }} />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Retos;
