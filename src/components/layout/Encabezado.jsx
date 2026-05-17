import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cargar preferencia de modo oscuro
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.body.classList.toggle('dark-mode', savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.body.classList.toggle('dark-mode', newMode);
  };

  useEffect(() => {
    // Verificar sesión inicial
    const obtenerSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUsuario(session?.user ?? null);
    };

    obtenerSesion();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMostrarMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error.message);
    }
  };

  const esLoginORegistro = ["/login", "/registro"].includes(location.pathname);

  return (
    <Navbar bg="white" expand="lg" sticky="top" className="shadow-sm py-3 border-bottom border-success border-3">
      <Container>
        <Navbar.Brand 
          onClick={() => manejarNavegacion("/")} 
          className="d-flex align-items-center cursor-pointer"
          style={{ cursor: 'pointer' }}
        >
          <i className="bi bi-shield-plus text-primary fs-2 me-2"></i>
          <span className="fw-bold fs-3 text-primary">New<span className="text-success">Me</span></span>
        </Navbar.Brand>

        {usuario ? (
          <>
            <Navbar.Toggle onClick={manejarToggle} aria-controls="offcanvasNavbar" />
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              placement="end"
              show={mostrarMenu}
              onHide={() => setMostrarMenu(false)}
            >
              <Offcanvas.Header closeButton className="border-bottom">
                <Offcanvas.Title id="offcanvasNavbarLabel" className="fw-bold text-primary">
                  Menú Muelitas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/")} 
                    active={location.pathname === "/"}
                    className="fw-semibold px-3"
                  >
                    <i className="bi bi-house-door me-2"></i>Dashboard
                  </Nav.Link>
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/juegos")} 
                    active={location.pathname === "/juegos"}
                    className="fw-semibold px-3"
                  >
                    <i className="bi bi-controller me-2"></i>Juegos
                  </Nav.Link>
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/encuestas")} 
                    active={location.pathname === "/encuestas"}
                    className="fw-semibold px-3"
                  >
                    <i className="bi bi-clipboard-check me-2"></i>Encuestas
                  </Nav.Link>
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/retos")} 
                    active={location.pathname === "/retos"}
                    className="fw-semibold px-3"
                  >
                    <i className="bi bi-trophy me-2"></i>Retos
                  </Nav.Link>
                  <Nav.Link 
                    onClick={() => manejarNavegacion("/ranking")} 
                    active={location.pathname === "/ranking"}
                    className="fw-semibold px-3"
                  >
                    <i className="bi bi-bar-chart-line me-2"></i>Ranking
                  </Nav.Link>
                  <Nav.Link 
                    onClick={toggleDarkMode}
                    className="fw-semibold px-3"
                  >
                    <i className={`bi bi-${darkMode ? 'sun' : 'moon'} me-2`}></i>
                    {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                  </Nav.Link>
                  <hr className="d-lg-none" />
                  <Button 
                    variant="outline-danger" 
                    onClick={cerrarSesion} 
                    className="ms-lg-3 rounded-pill px-4"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Salir
                  </Button>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </>
        ) : (
          !esLoginORegistro && (
            <Button 
              variant="primary" 
              onClick={() => navigate("/login")} 
              className="rounded-pill px-4"
            >
              Iniciar Sesión
            </Button>
          )
        )}
      </Container>
    </Navbar>
  );
};

export default Encabezado;
