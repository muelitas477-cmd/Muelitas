import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';
import { enviarNotificacionPuntos } from '../services/notificationService';
import { enviarEmailPuntos } from '../services/emailService';

const Encuestas = () => {
  const [paso, setPaso] = useState(1);
  const [respuestas, setRespuestas] = useState({
    frecuenciaCepillado: '',
    usaHiloDental: false,
    consumeTabaco: '',
    nivelAnsiedad: 5
  });
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRespuestas({
      ...respuestas,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const enviarEncuesta = async () => {
    setEnviando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('surveys').insert({
          user_id: user.id,
          tipo_encuesta: 'habitos_iniciales',
          respuestas: respuestas
        });
        if (error) throw error;

        // Sumar puntos por completar encuesta
        const { data: perfil } = await supabase.from('profiles').select('puntos').eq('id', user.id).single();
        await supabase.from('profiles').update({ puntos: (perfil?.puntos || 0) + 100 }).eq('id', user.id);

        // Notificación al teléfono
        await enviarNotificacionPuntos(100, "Completar encuesta de hábitos");
        
        // Enviar correo electrónico
        if (perfil) {
          await enviarEmailPuntos(perfil.correo, perfil.nombre, 100, "Completar encuesta de hábitos");
        }

        setCompletado(true);
      }
    } catch (err) {
      alert("Error al enviar encuesta: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (completado) {
    return (
      <Container className="py-5 text-center">
        <i className="bi bi-check-circle-fill text-success display-1 mb-4"></i>
        <h2 className="fw-bold">¡Gracias por participar!</h2>
        <p className="text-muted fs-5">Tus respuestas nos ayudan a personalizar tu experiencia. Has ganado 100 puntos.</p>
        <Button variant="primary" className="rounded-pill px-5 fw-bold" href="/">Ir al Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Encuesta de Hábitos 📝</h2>
        <p className="text-muted">Ayúdanos a conocerte mejor para cuidar tu sonrisa.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <Form>
              {paso === 1 && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold mb-4">Higiene Bucal</h5>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">¿Cuántas veces al día te cepillas los dientes?</Form.Label>
                    <div className="d-flex flex-column gap-2">
                      {['1 vez', '2 veces', '3 o más veces', 'No todos los días'].map(opcion => (
                        <Form.Check
                          key={opcion}
                          type="radio"
                          id={`cepillado-${opcion}`}
                          name="frecuenciaCepillado"
                          label={opcion}
                          value={opcion}
                          checked={respuestas.frecuenciaCepillado === opcion}
                          onChange={handleChange}
                          className="p-2 border rounded-3"
                        />
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="usa-hilo"
                      name="usaHiloDental"
                      label="¿Utilizas hilo dental regularmente?"
                      checked={respuestas.usaHiloDental}
                      onChange={handleChange}
                      className="fw-semibold"
                    />
                  </Form.Group>
                  <Button variant="primary" className="w-100 rounded-pill fw-bold" onClick={() => setPaso(2)}>Continuar</Button>
                </div>
              )}

              {paso === 2 && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold mb-4">Tabaco y Estrés</h5>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">¿Has consumido tabaco o vapeado en la última semana?</Form.Label>
                    <div className="d-flex flex-column gap-2">
                      {['Sí, diariamente', 'Sí, ocasionalmente', 'No, nunca', 'Estoy tratando de dejarlo'].map(opcion => (
                        <Form.Check
                          key={opcion}
                          type="radio"
                          id={`tabaco-${opcion}`}
                          name="consumeTabaco"
                          label={opcion}
                          value={opcion}
                          checked={respuestas.consumeTabaco === opcion}
                          onChange={handleChange}
                          className="p-2 border rounded-3"
                        />
                      ))}
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Nivel de ansiedad hoy (1-10)</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                      <Form.Range
                        name="nivelAnsiedad"
                        min="1"
                        max="10"
                        value={respuestas.nivelAnsiedad}
                        onChange={handleChange}
                      />
                      <span className="fw-bold text-primary fs-4">{respuestas.nivelAnsiedad}</span>
                    </div>
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button variant="light" className="w-50 rounded-pill fw-bold" onClick={() => setPaso(1)}>Atrás</Button>
                    <Button variant="success" className="w-50 rounded-pill fw-bold" onClick={enviarEncuesta} disabled={enviando}>
                      {enviando ? 'Enviando...' : 'Finalizar'}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Encuestas;
