import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import VerdaderoFalso from '../components/juegos/VerdaderoFalso';

const Juegos = () => {
  const [juegoActivo, setJuegoActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const abrirJuego = (juego) => {
    setJuegoActivo(juego);
    setShowModal(true);
  };

  const cerrarJuego = () => {
    setJuegoActivo(null);
    setShowModal(false);
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Zona de Juegos 🎮</h2>
        <p className="text-muted">Diviértete aprendiendo y suma puntos para tu nivel.</p>
      </div>

      <Row className="g-4">
        {/* Juego 1: Verdadero o Falso */}
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center">
            <div className="bg-primary py-4 text-white">
              <i className="bi bi-patch-question display-4"></i>
            </div>
            <Card.Body className="d-flex flex-column">
              <h5 className="fw-bold">Verdadero o Falso</h5>
              <p className="text-muted small flex-grow-1">Pon a prueba tus conocimientos sobre salud bucal y tabaco.</p>
              <Button variant="primary" className="rounded-pill fw-bold w-100" onClick={() => abrirJuego('vf')}>
                Jugar ahora
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Juego 2: Detecta el daño */}
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center">
            <div className="bg-success py-4 text-white">
              <i className="bi bi-eye display-4"></i>
            </div>
            <Card.Body className="d-flex flex-column">
              <h5 className="fw-bold">Detecta el Daño</h5>
              <p className="text-muted small flex-grow-1">Identifica problemas dentales en imágenes reales e ilustrativas.</p>
              <Button variant="success" className="rounded-pill fw-bold w-100" onClick={() => abrirJuego('dd')}>
                Próximamente
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Juego 3: Escape del cigarro */}
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center">
            <div className="bg-danger py-4 text-white">
              <i className="bi bi-dash-circle-dotted display-4"></i>
            </div>
            <Card.Body className="d-flex flex-column">
              <h5 className="fw-bold">Escape del Cigarro</h5>
              <p className="text-muted small flex-grow-1">Esquiva los cigarros y atrapa elementos saludables para ganar.</p>
              <Button variant="danger" className="rounded-pill fw-bold w-100" onClick={() => abrirJuego('ec')}>
                Próximamente
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para Juegos */}
      <Modal show={showModal} onHide={cerrarJuego} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {juegoActivo === 'vf' && "Mito o Realidad"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {juegoActivo === 'vf' && <VerdaderoFalso alTerminar={cerrarJuego} />}
          {juegoActivo === 'dd' && <div className="text-center py-5">Este juego estará disponible pronto.</div>}
          {juegoActivo === 'ec' && <div className="text-center py-5">Este juego estará disponible pronto.</div>}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Juegos;
