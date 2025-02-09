import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "reactstrap";
import styles from "./styles.module.css"

export default function Loader() {
    return (
        <Row className={`${styles.bgLoader} z-3`} id="loader">
            <Col xs="12" className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
                <FontAwesomeIcon icon={faBookOpen} beatFade color="white" className="display-1" />
            </Col>
        </Row>
    )
}