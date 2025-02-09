import { useState } from "react";
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import styles from "./styles.module.css";
import { Link } from "react-router";

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar expand="lg" className="bg-dark header">
      <NavbarBrand
        className={styles.navbarBrand + " text-center px-4"}
      >
        <Link to="/Admin" className={styles.navbarBrand}>
          <span className={styles.navbarBrandHigh}>Enxoval</span>
          <br />
          <span className={styles.navbarBrandDown}>Missionário</span>
        </Link>
      </NavbarBrand>
      <NavbarToggler onClick={toggle} className={styles.toggler} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto pt-lg-0 pt-4" navbar>
          <NavItem className="px-lg-3 px-0">
            <NavLink className="px-lg-4 px-0">
              <Link to="/Admin/Doacoes" className={styles.navLink}>
                Doações
              </Link>
            </NavLink>
          </NavItem>
          <NavItem className="px-lg-3 px-0">
            <NavLink className="px-lg-4 px-0">
              <Link to="/Admin/InformacoesPessoais" className={styles.navLink}>
                Informações pessoais
              </Link>
            </NavLink>
          </NavItem>
          <NavItem className="px-lg-3 px-0">
            <NavLink className="px-lg-4 px-0">
              <Link to="/Admin/itens" className={styles.navLink}>
                Itens
              </Link>
            </NavLink>
          </NavItem>
          <NavItem className="px-lg-3 px-0">
            <NavLink className="px-lg-4 px-0">
              <Link to="/Admin/Categorias" className={styles.navLink}>
                Categorias
              </Link>
            </NavLink>
          </NavItem>
          <NavItem className="px-lg-3 px-0">
            <NavLink className="px-lg-4 px-0">
              <Link to="/Admin/Usuarios" className={styles.navLink}>
                Usuários
              </Link>
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
}
