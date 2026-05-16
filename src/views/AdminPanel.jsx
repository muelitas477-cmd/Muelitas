import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Nav, Tab, Button } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSurveys: 0,
    totalPoints: 0,
    smokersPercentage: 0
  });
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Obtener todos los usuarios
      const { data: users, count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      if (users) {
        setUsuarios(users);
        const smokers = users.filter(u => u.es_fumador).length;
        const totalPoints = users.reduce((acc, u) => acc + (u.puntos || 0), 0);
        
        // 2. Obtener total de encuestas
        const { count: surveyCount } = await supabase
          .from('surveys')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalUsers: userCount || 0,
          totalSurveys: surveyCount || 0,
          totalPoints: totalPoints,
          smokersPercentage: userCount ? Math.round((smokers / userCount) * 100) : 0
        });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold text-dark">Panel Administrativo ⚙️</h2>
          <p className="text-muted mb-0">Gestión global de la plataforma Muelitas.</p>
        </div>
        <Button variant="primary" className="rounded-pill px-4 fw-bold">
          <i className="bi bi-plus-lg me-2"></i> Nuevo Anuncio
        </Button>
      </div>

      {/* Resumen de Estadísticas */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="text-muted small fw-bold mb-2">USUARIOS TOTALES</div>
            <div className="d-flex align-items-center">
              <div className="display-6 fw-bold text-primary">{stats.totalUsers}</div>
              <i className="bi bi-people ms-auto fs-1 text-primary opacity-25"></i>
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="text-muted small fw-bold mb-2">ENCUESTAS COMPLETADAS</div>
            <div className="d-flex align-items-center">
              <div className="display-6 fw-bold text-success">{stats.totalSurveys}</div>
              <i className="bi bi-clipboard-check ms-auto fs-1 text-success opacity-25"></i>
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="text-muted small fw-bold mb-2">PUNTOS REPARTIDOS</div>
            <div className="d-flex align-items-center">
              <div className="display-6 fw-bold text-warning">{stats.totalPoints.toLocaleString()}</div>
              <i className="bi bi-star ms-auto fs-1 text-warning opacity-25"></i>
            </div>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="text-muted small fw-bold mb-2">% FUMADORES</div>
            <div className="d-flex align-items-center">
              <div className="display-6 fw-bold text-danger">{stats.smokersPercentage}%</div>
              <i className="bi bi-exclamation-triangle ms-auto fs-1 text-danger opacity-25"></i>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Gestión de Datos */}
      <Tab.Container id="admin-tabs" defaultActiveKey="usuarios">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Header className="bg-white border-bottom py-3">
            <Nav variant="pills" className="nav-fill">
              <Nav.Item>
                <Nav.Link eventKey="usuarios" className="rounded-pill fw-bold mx-2">
                  <i className="bi bi-person me-2"></i>Usuarios
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="retos" className="rounded-pill fw-bold mx-2">
                  <i className="bi bi-trophy me-2"></i>Retos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="anuncios" className="rounded-pill fw-bold mx-2">
                  <i className="bi bi-megaphone me-2"></i>Anuncios
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body className="p-0">
            <Tab.Content>
              <Tab.Pane eventKey="usuarios">
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4">Nombre</th>
                      <th>Correo</th>
                      <th>Barrio</th>
                      <th>Estado</th>
                      <th>Puntos</th>
                      <th className="text-end px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((user) => (
                      <tr key={user.id} className="align-middle">
                        <td className="px-4 fw-bold">{user.nombre}</td>
                        <td className="text-muted small">{user.correo}</td>
                        <td>{user.barrio_comunidad}</td>
                        <td>
                          <Badge bg={user.es_fumador ? 'danger' : 'success'} className="rounded-pill px-2">
                            {user.es_fumador ? 'Fumador' : 'No fumador'}
                          </Badge>
                        </td>
                        <td className="fw-bold text-primary">{user.puntos}</td>
                        <td className="text-end px-4">
                          <Button variant="outline-primary" size="sm" className="rounded-circle me-1">
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button variant="outline-danger" size="sm" className="rounded-circle">
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>
              <Tab.Pane eventKey="retos">
                <div className="p-5 text-center text-muted">
                  <i className="bi bi-tools display-1 mb-3 opacity-25"></i>
                  <h5>Configuración de Retos</h5>
                  <p>Próximamente: Crea y edita retos dinámicos para los usuarios.</p>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="anuncios">
                <div className="p-5 text-center text-muted">
                  <i className="bi bi-envelope-paper display-1 mb-3 opacity-25"></i>
                  <h5>Envíos de Resend</h5>
                  <p>Configura campañas de correo electrónico automáticas.</p>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
};

export default AdminPanel;
