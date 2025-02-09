import { Col, Container, Row } from "reactstrap";
import NavbarAdmin from "../../components/Navbar/Navbar";
import "../css/styles.css";
import InfoBox from "../../components/InfoBox/InfoBox";
import {
  faArrowUp19,
  faCheck,
  faCheckDouble,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Footer from "../../components/Footer/Footer";
import Loader from "../../components/Loader/Loader";

export default function AdminHome() {
  const [totalItems, setTotalItems] = useState(0);
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [itemsPartial, setItemsPartial] = useState(0);
  const [itemsPending, setItemsPending] = useState(0);
  const [infos, setInfos] = useState(null);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(window.sessionStorage.getItem("user"));

    if (!storedUser) {
      navigate("/Admin/Login");
    } else {
      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items`)
        .then((response) => {
          const itemsInfos = response.data;
          setTotalItems(itemsInfos.length);
          setItemsCompleted(
            itemsInfos.filter((item) => item.remainQuantity === 0).length
          );
          setItemsPartial(
            itemsInfos.filter(
              (item) => item.remainQuantity > 0 && item.donations.length > 0
            ).length
          );
          setItemsPending(
            itemsInfos.filter(
              (item) => item.remainQuantity > 0 && item.donations.length === 0
            ).length
          );
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/personalInfos`)
        .then((response) => {
          const data = response.data;

          setInfos(data);
          setIsLoaderVisible(false);
        })
        .catch((err) => console.log(err));

    }
  }, []);

  return (
    <>
      {!isLoaderVisible ? (
        <div className="backgroundAdmin">
          <NavbarAdmin />
          <Container className="main">
            <Row className="mt-5">
              <Col xs="12" md="5">
                <h2 className="text-white">Olá, líder!</h2>
                <p className="h5 text-white">
                  Seja bem vindo ao sistema administrativo do enxoval do{" "}
                  {infos.missionaryName}!
                </p>
                <br />
                <br />
                <p className="h5 text-white">
                  Neste sistema você poderá:
                  <ul>
                    <li>Acompanhar com detalhes as doações de cada item;</li>
                    <li>
                      Gerenciar as informações pessoais do(a) missionário(a);
                    </li>
                    <li>Gerenciar as categorias dos itens;</li>
                    <li>Gerenciar os itens;</li>
                    <li>
                      Gerenciar os usuários que possuem acesso ao sistema.
                    </li>
                  </ul>
                </p>
                <br />
                <p className="h5 text-white">
                  Também é possível visualizar alguns dados numéricos ao lado
                  para melhor visualização de quantidades
                </p>
                <br />
                <p className="h5 text-white">
                  Navegue pelas opções no menu acima, em caso de dúvidas, entre
                  em contato com seu líder ou responsável pelo sistema.
                </p>
              </Col>
              <Col xs="12" md="6" className="offset-md-1">
                <Row className=" d-flex">
                  <Col xs="12">
                    <h3 className="bg-secondary w-100 p-3 text-white rounded text-center">
                      ITENS
                    </h3>
                  </Col>
                  <Col xs="12" lg="6" xl="4">
                    <InfoBox
                      Text="Total"
                      Number={totalItems}
                      Icon={faArrowUp19}
                      Background="bg-secondary"
                    />
                  </Col>
                  <Col xs="12" lg="6" xl="4">
                    <InfoBox
                      Text="Completos"
                      Number={itemsCompleted}
                      Icon={faCheckDouble}
                      Background="bg-success"
                    />
                  </Col>
                  <Col xs="12" lg="6" xl="4">
                    <InfoBox
                      Text="Parciais"
                      Number={itemsPartial}
                      Icon={faCheck}
                      Background="bg-warning"
                    />
                  </Col>
                  <Col xs="12" lg="6" xl="4">
                    <InfoBox
                      Text="Pendentes"
                      Number={itemsPending}
                      Icon={faXmark}
                      Background="bg-danger"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
          <Footer />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
