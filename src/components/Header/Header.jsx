import { Col, Row } from "reactstrap";
import fotoAdan from "../../images/missionary_pic.jpg";
import bandeiraRs from "../../images/flag.webp";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

export default function Header() {
  const [infos, setInfos] = useState(null);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/personalInfos`)
      .then((response) => {
        const data = response.data;

        setInfos(data);
        setIsLoaderVisible(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      {!isLoaderVisible ? (
        <Row className="mt-5">
          <Col xs="12" md="6">
            <img
              src={fotoAdan}
              alt="Foto do Missionário"
              className={styles.missionaryPicture}
            />
          </Col>
          <Col xs="12" md="6" className="mt-2">
            <div className="text-start">
              <img
                src={bandeiraRs}
                alt="Bandeira"
                className={styles.flag}
              />
              <p className="justify">
                <span className="h4">{infos.name.toUpperCase()}</span>
                <br />
                <span className="h5">{infos.mission}</span>
                <br />
                <span className="h6">
                  {infos.start} ~ {infos.end}
                </span>
                <br />
                <a
                  href={infos.missionOfficeLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Escritório da Missão
                </a>
                <br />
                <br />
                Olá! Obrigado por entrar no meu site de doações para meu enxoval
                da missão! Estou muito animado para poder servir ao senhor
                nestes próximos meses de minha vida!
                <br />
                Aqui neste site você poderá selecionar quais itens e qual
                quantidade você deseja realizar a doação. Após seu
                preenchimento:
                <br />
                <br />
                <ul>
                  <li>Assim que possível entrarei em contato com você;</li>
                  {/* AQUI PODE SER PREENCHIDO AS MANEIRAS QUE O MISSIONÁRIO RECEBERÁ OS ITENS (SEJA O PIX, O ENDEREÇO DA CAPELA, OU QUALQUER OUTRA FORMA) */}
                </ul>
                Gostaria somente de brevemente prestar meu testemunho à você:
                <br />
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html: infos.testimony.replace(/\n/g, "<br/>"),
                  }}
                ></span>
                <blockquote className="blockquote mt-3">
                  <p>
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="fa-xs me-1"
                    />
                    ...Em verdade vos digo que, quando o fizestes a um destes
                    meus pequeninos irmãos, a mim o fizestes.
                    <FontAwesomeIcon
                      icon={faQuoteRight}
                      className="fa-xs ms-1"
                    />
                  </p>
                </blockquote>
                <figcaption className="blockquote-footer">
                  <cite title="Escritura">
                    <a href="https://www.churchofjesuschrist.org/study/scriptures/nt/matt/25?lang=por&id=p40#p40" target="blank">
                      Mateus 25:40
                    </a>
                  </cite>
                </figcaption>
              </p>
            </div>
          </Col>
        </Row>
      ) : (
        <Loader />
      )}
    </>
  );
}
