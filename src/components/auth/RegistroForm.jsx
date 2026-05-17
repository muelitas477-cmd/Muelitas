import React from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegistroForm = ({ formData, setFormData, error, loading, onRegister }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="p-4 shadow-lg rounded-4 bg-white" style={{ maxWidth: '500px', width: '100%' }}>
      <div className="text-center mb-4">
        <i className="bi bi-person-plus text-success display-4"></i>
        <h2 className="fw-bold mt-2">Crea tu cuenta</h2>
        <p className="text-muted">Únete a la comunidad NewMe</p>
      </div>

      {error && <Alert variant="danger" className="py-2">{error}</Alert>}

      <Form onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Nombre Completo</Form.Label>
              <Form.Control
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="rounded-3 py-2"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold text-muted">Correo Electrónico</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            className="rounded-3 py-2"
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Edad</Form.Label>
              <Form.Control
                name="edad"
                type="number"
                placeholder="18-22"
                min="18"
                max="22"
                value={formData.edad}
                onChange={handleChange}
                className="rounded-3 py-2"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Barrio/Comunidad</Form.Label>
              <Form.Control
                name="barrio"
                type="text"
                placeholder="Tu barrio"
                value={formData.barrio}
                onChange={handleChange}
                className="rounded-3 py-2"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold text-muted">Contraseña</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="rounded-3 py-2"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4 d-flex align-items-center bg-light p-3 rounded-3 border">
          <Form.Check
            type="switch"
            id="es-fumador"
            name="esFumador"
            label="¿Consumes tabaco actualmente?"
            checked={formData.esFumador}
            onChange={handleChange}
            className="fw-semibold text-dark"
          />
        </Form.Group>

        <Button
          variant="success"
          type="submit"
          className="w-100 rounded-pill py-2 fw-bold mb-3 shadow-sm"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Empezar ahora'}
        </Button>
      </Form>

      <div className="text-center mt-3">
        <p className="small text-muted mb-0">¿Ya tienes cuenta? <Link to="/login" className="text-primary fw-bold text-decoration-none">Inicia sesión</Link></p>
      </div>
    </div>
  );
};

export default RegistroForm;
