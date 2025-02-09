import { Col, Container, Row } from "reactstrap";
import "../css/styles.css";

import NavbarAdmin from "../../components/Navbar/Navbar";
import DonationsCard from "../../components/DonationsCard/DonationsCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Donations() {
  const [categoriesArray, setCategoriesArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(window.sessionStorage.getItem("user"));

    if (!storedUser) {
      navigate("/Admin");
    } else {
      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories`)
        .then((response) => setCategoriesArray(response.data))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="backgroundAdmin">
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs="12" id="coluna">
            {categoriesArray.length > 0 ? (
              categoriesArray.map((category) => (
                <DonationsCard
                  key={category.id}
                  categoryName={category.name}
                  categoryId={category.id}
                />
              ))
            ) : (
              <h2 className="bg-danger text-white p-4 rounded">
                OCORREU UM ERRO AO TRAZER OS DADOS OU NENHUMA CATEGORIA FOI ENCONTRADA!
              </h2>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
