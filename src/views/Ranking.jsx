import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Card, Row, Col } from 'react-bootstrap';
import { supabase } from '../database/supabaseconfig';

const Ranking = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('nombre, puntos, nivel, barrio_comunidad')
        .order('puntos', { ascending: false })
        .limit(10);
      
      if (data) setUsuarios(data);
      setLoading(false);
    };

    fetchRanking();
  }, []);

  const getBadgeColor = (index) => {
    if (index === 0) return 'warning';
    if (index === 1) return 'secondary';
    if (index === 2) return 'info';
    return 'light';
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Ranking de Embajadores 👑</h2>
        <p className="text-muted">Los jóvenes más comprometidos con su salud bucal.</p>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Top 3 Visual */}
          <Row className="mb-5 g-4 align-items-end text-center">
            {usuarios.slice(0, 3).map((user, index) => {
              const order = [1, 0, 2]; // 2nd, 1st, 3rd
              const currentUser = usuarios[order[index]];
              if (!currentUser) return null;
              
              const isFirst = order[index] === 0;
              return (
                <Col key={order[index]} xs={4} className={isFirst ? 'order-2' : order[index] === 1 ? 'order-1' : 'order-3'}>
                  <div className={`p-3 rounded-4 bg-white shadow-sm ${isFirst ? 'border-primary border-3 border' : ''}`}>
                    <div className={`mb-2 display-${isFirst ? '4' : '6'}`}>
                      {order[index] === 0 ? '🥇' : order[index] === 1 ? '🥈' : '🥉'}
                    </div>
                    <h6 className="fw-bold text-truncate mb-1">{currentUser.nombre}</h6>
                    <Badge bg="primary" className="rounded-pill mb-2">{currentUser.puntos} pts</Badge>
                    <div className="small text-muted text-truncate">{currentUser.nivel}</div>
                  </div>
                </Col>
              );
            })}
          </Row>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3 border-0">#</th>
                  <th className="py-3 border-0">Usuario</th>
                  <th className="py-3 border-0">Nivel</th>
                  <th className="py-3 border-0">Barrio</th>
                  <th className="text-end px-4 py-3 border-0">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user, index) => (
                  <tr key={index} className="align-middle">
                    <td className="px-4 py-3 border-bottom border-light">
                      <span className={`fw-bold ${index < 3 ? 'text-primary' : 'text-muted'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 border-bottom border-light">
                      <div className="fw-bold">{user.nombre}</div>
                    </td>
                    <td className="py-3 border-bottom border-light">
                      <Badge bg="outline-primary" className="text-primary border border-primary rounded-pill px-2">
                        {user.nivel}
                      </Badge>
                    </td>
                    <td className="py-3 border-bottom border-light text-muted small">
                      {user.barrio_comunidad}
                    </td>
                    <td className="text-end px-4 py-3 border-bottom border-light fw-bold text-primary">
                      {user.puntos.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ranking;
