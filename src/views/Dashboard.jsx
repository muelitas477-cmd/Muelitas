import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, Modal } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';
import { solicitarPermisoNotificaciones } from '../services/notificationService';

const Dashboard = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarModalBienvenida, setMostrarModalBienvenida] = useState(false);

  useEffect(() => {
    solicitarPermisoNotificaciones(); 
    const fetchPerfil = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setPerfil(data);
          // Verificar si es la primera vez que entra (puntos == 100 y no hay flag en localStorage)
          const yaMostrado = localStorage.getItem(`bienvenida_mostrada_${user.id}`);
          if (data.puntos === 100 && !yaMostrado) {
            setMostrarModalBienvenida(true);
            localStorage.setItem(`bienvenida_mostrada_${user.id}`, 'true');
          }
        }
      }
      setLoading(false);
    };

    fetchPerfil();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary fw-bold">¡Hola, {perfil?.nombre || 'Joven'}! 👋</h2>
          <p className="text-muted">Bienvenido a tu panel de salud bucal.</p>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Tarjeta de Puntos y Nivel */}
        <Col md={4}>
          <Card className="h-100 shadow-sm border-0 bg-primary text-white rounded-4">
            <Card.Body className="d-flex flex-column justify-content-center text-center p-4">
              <h4 className="mb-0">Nivel</h4>
              <h2 className="fw-bold mb-3">{perfil?.nivel || 'Protector Dental'}</h2>
              <div className="bg-white text-primary rounded-pill py-2 px-3 d-inline-block mx-auto fw-bold fs-4">
                {perfil?.puntos || 0} Puntos
              </div>
              <div className="mt-4">
                <p className="small mb-1 text-white-50">Siguiente nivel: Sonrisa Saludable</p>
                <ProgressBar now={45} variant="success" className="bg-white-50" style={{ height: '10px' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Retos Activos */}
        <Col md={8}>
          <Card className="h-100 shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold text-dark mb-0">Retos del Día 🦷</h5>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
              <div className="d-flex align-items-center mb-3 p-3 border rounded-3 hover-shadow transition">
                <div className="bg-light-success p-2 rounded-circle me-3">
                  <i className="bi bi-droplet-fill text-primary fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold">Cepillado Matutino</h6>
                  <small className="text-muted">¡No olvides limpiar tu lengua!</small>
                </div>
                <Badge bg="success" className="rounded-pill px-3">+50 pts</Badge>
              </div>

              <div className="d-flex align-items-center mb-3 p-3 border rounded-3 opacity-75">
                <div className="bg-light-danger p-2 rounded-circle me-3">
                  <i className="bi bi-no-circle text-danger fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold text-decoration-line-through">Día sin Tabaco</h6>
                  <small className="text-muted">Completado ayer</small>
                </div>
                <i className="bi bi-check-circle-fill text-success fs-4"></i>
              </div>

              <div className="d-flex align-items-center p-3 border rounded-3">
                <div className="bg-light-info p-2 rounded-circle me-3">
                  <i className="bi bi-cup-straw text-info fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold">Tomar 2L de Agua</h6>
                  <small className="text-muted">Hidrata tu boca y cuerpo</small>
                </div>
                <Badge bg="primary" className="rounded-pill px-3">+30 pts</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4 g-4">
        {/* Acceso rápido a juegos */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden h-100">
            <Row className="g-0 h-100">
              <Col xs={4} className="bg-success d-flex align-items-center justify-content-center">
                <i className="bi bi-controller text-white display-4"></i>
              </Col>
              <Col xs={8}>
                <Card.Body>
                  <h5 className="fw-bold">Juegos Educativos</h5>
                  <p className="text-muted small">Aprende jugando y gana puntos para subir de nivel.</p>
                  <Button variant="outline-success" className="rounded-pill btn-sm">Jugar Ahora</Button>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Progreso Semanal */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-3">Tu Progreso Semanal</h5>
              <div className="d-flex justify-content-between mb-2">
                <small>Higiene Bucal</small>
                <small className="fw-bold">80%</small>
              </div>
              <ProgressBar now={80} variant="primary" className="mb-3" style={{ height: '8px' }} />
              
              <div className="d-flex justify-content-between mb-2">
                <small>Días sin Fumar</small>
                <small className="fw-bold">100%</small>
              </div>
              <ProgressBar now={100} variant="success" className="mb-3" style={{ height: '8px' }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Bienvenida */}
      <Modal 
        show={mostrarModalBienvenida} 
        onHide={() => setMostrarModalBienvenida(false)}
        centered
        className="border-0"
      >
        <Modal.Body className="text-center p-5">
          <div className="mb-4">
            <i className="bi bi-gift-fill text-primary display-1 animate__animated animate__bounceIn"></i>
          </div>
          <h2 className="fw-bold text-primary mb-3">¡Bienvenido a NewMe!</h2>
          <p className="fs-5 text-muted mb-4">
            Estamos felices de tenerte aquí. Para empezar tu camino hacia una sonrisa saludable...
          </p>
          <div className="bg-light-success p-4 rounded-4 mb-4">
            <h3 className="fw-bold text-success mb-0">✨ ¡Te regalamos 100 puntos! ✨</h3>
            <p className="small text-success mb-0">Por unirte a nuestra comunidad</p>
          </div>
          <Button 
            variant="primary" 
            className="rounded-pill px-5 py-2 fw-bold fs-5 shadow-sm"
            onClick={() => setMostrarModalBienvenida(false)}
          >
            ¡Genial, gracias!
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;
