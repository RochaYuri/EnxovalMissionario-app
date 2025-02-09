import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import Loader from "../../components/Loader/Loader";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarMinus,
  faCalendarPlus,
  faComment,
  faEraser,
  faFloppyDisk,
  faIdCard,
  faLink,
  faLocationDot,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import ReactInputMask from "react-input-mask";

export default function PersonalInfos() {
  const [modalFalha, setModalFalha] = useState(false);
  const [modalFalhaMessage, setModalFalhaMessage] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [name, setName] = useState(null);
  const [missionaryName, setMissionaryName] = useState(null);
  const [mission, setMission] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [missionOfficeLink, setMissionOfficeLink] = useState(null);
  const [testimony, setTestimony] = useState(null);
  const navigate = useNavigate();

  const modalSucessoToggle = () => setModalSucesso(!modalSucesso);
  const modalFalhaToggle = () => setModalFalha(!modalFalha);

  useEffect(() => {
    const storedUser = JSON.parse(window.sessionStorage.getItem("user"));

    if (
      !storedUser ||
      !storedUser.roles.some((role) => role.toUpperCase() === "MISSIONARY")
    ) {
      navigate("/Admin");
    } else {
      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/personalInfos`)
        .then((response) => {
          const data = response.data;

          setName(data.name);
          setMissionaryName(data.missionaryName);
          setMission(data.mission);
          setStart(data.start);
          setEnd(data.end);
          setMissionOfficeLink(data.missionOfficeLink);
          setTestimony(data.testimony);

          setIsLoaderVisible(false);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const isValidDate = (str) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(str);
  };

  const handleRemoveValues = () => {
    setName(null);
    setMissionaryName(null);
    setMission(null);
    setStart("");
    setEnd("");
    setMissionOfficeLink(null);
    setTestimony(null);

    document.getElementById("InputName").value = "";
    document.getElementById("InputMissionaryName").value = "";
    document.getElementById("InputMission").value = "";
    document.getElementById("InputStart").value = "";
    document.getElementById("InputEnd").value = "";
    document.getElementById("InputMissionOfficeLink").value = "";
    document.getElementById("InputTestimony").value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    document.getElementById("loaderDiv").classList.remove("d-none");

    const validStart = isValidDate(start);
    const validEnd = isValidDate(end);

    if (!validStart || !validEnd) {
      setModalFalhaMessage("Insira uma data válida para continuar!");
      document.getElementById("loaderDiv").classList.add("d-none");
      modalFalhaToggle();
      return;
    }

    const infos = {
      name: name,
      missionaryName: missionaryName,
      mission: mission,
      start: start,
      end: end,
      missionOfficeLink: missionOfficeLink,
      testimony: testimony,
    };

    axios
      .put(
        `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/personalInfos/update`,
        infos
      )
      .then((response) => {
        axios
          .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/personalInfos`)
          .then((response) => {
            setName(response.data.name);
            setMissionaryName(response.data.missionaryName);
            setMission(response.data.mission);
            setStart(response.data.start);
            setEnd(response.data.end);
            setMissionOfficeLink(response.data.missionOfficeLink);
            setTestimony(response.data.testimony);
          });

        document.getElementById("loaderDiv").classList.add("d-none");
        modalSucessoToggle();
      })
      .catch((err) => {
        setModalFalhaMessage(
          "Ocorreu uma falha ao realizar as alterações! Por favor, contate o responsável técnico para a correção."
        );
        document.getElementById("loaderDiv").classList.add("d-none");
        modalFalhaToggle();
        console.log(err);
      });
  };

  return (
    <>
      {!isLoaderVisible ? (
        <div className="backgroundAdmin">
          <NavbarAdmin />
          <Container className="mt-5">
            <Row>
              <Col xs="12">
                <h3 className="text-center fw-bold text-white">
                  INFORMAÇÕES PESSOAIS
                </h3>
              </Col>
            </Row>
            <hr className="text-white" />
            <Row>
              <Col xs="12">
                <Card className="cardBg">
                  <CardBody>
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col xs="12" md="8">
                          <Label className="text-white fw-bold">NOME</Label>
                          <InputGroup className="input-group">
                            <InputGroupText
                              className={`${styles.inputGroupText} text-dark`}
                            >
                              <FontAwesomeIcon icon={faSignature} />
                            </InputGroupText>
                            <Input
                              id="InputName"
                              type="text"
                              placeholder="Digite o nome"
                              className="rounded"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </InputGroup>
                        </Col>
                        <Col xs="12" md="4">
                          <Label className="text-white fw-bold mt-md-0 mt-3">
                            NOME MISSIONÁRIO
                          </Label>
                          <InputGroup className="input-group mt-md-0">
                            <InputGroupText
                              className={`${styles.inputGroupText} text-dark`}
                            >
                              <FontAwesomeIcon icon={faIdCard} />
                            </InputGroupText>
                            <Input
                              id="InputMissionaryName"
                              type="text"
                              placeholder="Digite o nome de missionário(a)"
                              className="rounded"
                              value={missionaryName}
                              onChange={(e) =>
                                setMissionaryName(e.target.value)
                              }
                              required
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col xs="12" md="4">
                          <Label className="text-white fw-bold">MISSÃO</Label>
                          <InputGroup className="input-group">
                            <InputGroupText
                              className={`${styles.inputGroupText} text-dark`}
                            >
                              <FontAwesomeIcon icon={faLocationDot} />
                            </InputGroupText>
                            <Input
                              id="InputMission"
                              type="text"
                              placeholder="Digite o nome da missão"
                              className="rounded"
                              value={mission}
                              onChange={(e) => setMission(e.target.value)}
                              required
                            />
                          </InputGroup>
                        </Col>
                        <Col xs="12" md="4">
                          <Label className="text-white fw-bold mt-md-0 mt-3">
                            INÍCIO
                          </Label>
                          <InputGroup className="input-group mt-md-0">
                            <InputGroupText
                              className={`${styles.inputGroupText} text-dark`}
                            >
                              <FontAwesomeIcon icon={faCalendarPlus} />
                            </InputGroupText>
                            <ReactInputMask
                              id="InputStart"
                              type="text"
                              placeholder="__/____"
                              className="rounded form-control"
                              value={start}
                              onChange={(e) => setStart(e.target.value)}
                              mask="99/9999"
                              maskPlaceholder="_"
                              alwaysShowMask
                              required
                            />
                          </InputGroup>
                        </Col>
                        <Col xs="12" md="4">
                          <Label className="text-white fw-bold mt-md-0 mt-3">
                            FIM
                          </Label>
                          <InputGroup className="input-group mt-md-0">
                            <InputGroupText
                              className={`${styles.inputGroupText} text-dark`}
                            >
                              <FontAwesomeIcon icon={faCalendarMinus} />
                            </InputGroupText>
                            <ReactInputMask
                              id="InputEnd"
                              type="text"
                              placeholder="__/____"
                              className="rounded form-control"
                              value={end}
                              onChange={(e) => setEnd(e.target.value)}
                              mask="99/9999"
                              maskPlaceholder="_"
                              alwaysShowMask
                              required
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col xs="12">
                          <Label className="text-white fw-bold">
                            LINK DO ESCRITÓRIO DA MISSÃO
                          </Label>
                          <InputGroup className="input-group">
                            <InputGroupText
                              className={`${styles.inputGroupText} text-dark`}
                            >
                              <FontAwesomeIcon icon={faLink} />
                            </InputGroupText>
                            <Input
                              id="InputMissionOfficeLink"
                              type="text"
                              placeholder="Insira o link do escritório da missão no google maps"
                              className="rounded"
                              value={missionOfficeLink}
                              onChange={(e) =>
                                setMissionOfficeLink(e.target.value)
                              }
                              required
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col xs="12">
                          <Label className="text-white fw-bold">
                            TESTEMUNHO
                          </Label>
                          <InputGroup className="input-group">
                            <InputGroupText
                              className={`${styles.inputGroupText} text-dark`}
                            >
                              <FontAwesomeIcon icon={faComment} />
                            </InputGroupText>
                            <textarea
                              id="InputTestimony"
                              type="text"
                              placeholder="Digite o testemunho que aparecerá no site"
                              className="rounded form-control"
                              value={testimony}
                              onChange={(e) => setTestimony(e.target.value)}
                              rows={6}
                              required
                            ></textarea>
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col xs="6">
                          <Button
                            color="danger"
                            type="button"
                            onClick={handleRemoveValues}
                          >
                            Limpar
                            <FontAwesomeIcon icon={faEraser} className="ms-2" />
                          </Button>
                        </Col>
                        <Col xs="6" className="text-end">
                          <Button color="success" type="submit">
                            Salvar
                            <FontAwesomeIcon
                              icon={faFloppyDisk}
                              className="ms-2"
                            />
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>

          <Modal isOpen={modalFalha} toggle={modalFalhaToggle}>
            <ModalHeader
              className="bg-danger text-white border-dark border-2"
              toggle={modalFalhaToggle}
            >
              Ops! ocorreu um erro ao fazer o login
            </ModalHeader>
            <ModalBody className="bg-danger text-white">
              {modalFalhaMessage}
            </ModalBody>
          </Modal>

          <Modal isOpen={modalSucesso} toggle={modalSucessoToggle}>
            <ModalHeader
              className="bg-success text-white border-dark border-2"
              toggle={modalSucessoToggle}
            >
              SUCESSO!
            </ModalHeader>
            <ModalBody className="bg-success text-white">
              Informações pessoais atualizadas com sucesso!
            </ModalBody>
          </Modal>

          <div className={`${isLoaderVisible ? "" : "d-none"}`} id="loaderDiv">
            <Loader />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
