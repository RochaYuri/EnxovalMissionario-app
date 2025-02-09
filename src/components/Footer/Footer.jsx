import { Col, Container, Row } from "reactstrap";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <div className={`${styles.footer}`}>
      <hr className="text-white" />
      <Container fluid>
        <Row>
          <Col sm="4" xs="12" className={`${styles.dev}`}>
            <div className={`${styles.logoDev}`}>
              <p>Desenvolvido por:</p>
              <a
                href="https://www.linkedin.com/in/rocha-yuri/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://i.ibb.co/1fTv8gf/Rocha-Yuri-white-png.png"
                  alt="logo yuri"
                  className={`${styles.logoDev}`}
                />
              </a>
            </div>
          </Col>
          <Col lg="4" sm="5" xs="12" className={`${styles.rightsText}`}>
            <h6>
              <a
                href="https://www.linkedin.com/in/rocha-yuri/"
                target="_blank"
                rel="noreferrer"
              >
                RochaYuri
              </a>{" "}
              - {new Date().getFullYear()} | Todos os direitos reservados
            </h6>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
