import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginForm = ({ email, setEmail, password, setPassword, error, loading, onLogin, onGoogleLogin }) => {
  return (
    <div className="p-4 bg-transparent" style={{ maxWidth: '380px', width: '100%' }}>
      <div className="text-center mb-5">
        <div className="mb-3 d-inline-block p-3 rounded-circle bg-light-primary">
          <i className="bi bi-shield-plus text-primary fs-1"></i>
        </div>
        <h2 className="fw-bold text-dark">Muelitas</h2>
        <p className="text-muted small">Tu salud bucal empieza aquí</p>
      </div>

      {error && <Alert variant="danger" className="py-2 small border-0 rounded-3 mb-4">{error}</Alert>}

      <Form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-0 border-bottom rounded-0 px-0 bg-transparent py-2 shadow-none border-secondary"
            style={{ fontSize: '0.95rem' }}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-0 border-bottom rounded-0 px-0 bg-transparent py-2 shadow-none border-secondary"
            style={{ fontSize: '0.95rem' }}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 rounded-pill py-2 fw-bold mb-4 shadow-sm border-0"
          style={{ letterSpacing: '0.5px' }}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </Button>

        <div className="text-center mb-4">
          <span className="text-muted small px-2 bg-white" style={{ position: 'relative', zIndex: 1 }}>o continúa con</span>
          <hr className="mt-n2" style={{ marginTop: '-10px' }} />
        </div>

        <Button
          variant="outline-light"
          className="w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center border shadow-sm text-dark bg-white"
          onClick={onGoogleLogin}
          disabled={loading}
        >
          <i className="bi bi-google me-2"></i> Google
        </Button>
      </Form>

      <div className="text-center mt-5">
        <p className="small text-muted">
          ¿Nuevo en Muelitas? <Link to="/registro" className="text-primary fw-bold text-decoration-none ms-1">Crea tu cuenta</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
