import "../css/styles.css";
import NavbarAdmin from "../../components/Navbar/Navbar";
import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";

export default function Maintenance() {
  return (
    <div className="backgroundAdmin">
      <NavbarAdmin />
      <Container>
        <Row className="mt-4">
            <Col>
            <h1 className="text-white text-center">
                OPS! ESTA PÁGINA ESTÁ EM MANUTENÇÃO{" "}
                <FontAwesomeIcon icon={faScrewdriverWrench} />
            </h1>
            </Col>
        </Row>
      </Container>
    </div>
  );
}
