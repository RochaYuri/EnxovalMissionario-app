import {
  faEye,
  faEyeSlash,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  Button,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../components/Loader/Loader";

export default function Login() {
  const [modalFalha, setModalFalha] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [infos, setInfos] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  let users;

  const modalFalhaToggle = () => setModalFalha(!modalFalha);

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

  const showPassHandler = () => {
    setShowPass((prev) => !prev);
    const element = document.getElementById("password");
    element.type = element.type === "password" ? "text" : "password";
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoaderVisible(true);

    axios
      .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users`)
      .then((response) => {
        users = response.data;

        const user = users.find(
          (user) =>
            user.username.toUpperCase() === username.toUpperCase() &&
            user.password === password
        );

        if (user) {
          window.sessionStorage.setItem(
            "user",
            JSON.stringify({
              name: user.name,
              username: user.username,
              roles: user.roles,
            })
          );
          navigate("/Admin");
        } else {
          setIsLoaderVisible(false);
          modalFalhaToggle();
        }
      })
      .catch((err) => {
        setIsLoaderVisible(false);
        modalFalhaToggle();
        console.log(err);
      });
  };

  return (
    <>
      {!isLoaderVisible ? (
        <div className={styles.background}>
          <div className="container d-flex justify-content-center align-items-center vh-100">
            <Row className={styles.login + " px-5 py-4 rounded"}>
              <Col xs="12">
                <h4>
                  Admin enxoval missionário -{" "}
                  {infos ? infos.missionaryName.toUpperCase() : ""}
                </h4>
                <Form onSubmit={handleLogin}>
                  <Row className="my-3">
                    <Col xs="12">
                      <Input
                        type="text"
                        placeholder="Informe o login"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col xs="12">
                      <InputGroup>
                        <Input
                          type="password"
                          placeholder="Informe a senha"
                          id="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <InputGroupText onClick={showPassHandler}>
                          <FontAwesomeIcon
                            icon={showPass ? faEye : faEyeSlash}
                          />
                        </InputGroupText>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" className="text-end">
                      <Button type="submit" color="success">
                        <FontAwesomeIcon
                          icon={faRightFromBracket}
                          className="me-1"
                        />
                        Entrar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>

          <Modal isOpen={modalFalha} toggle={modalFalhaToggle}>
            <ModalHeader
              className="bg-danger text-white border-dark border-2"
              toggle={modalFalhaToggle}
            >
              Ops! ocorreu um erro ao fazer o login
            </ModalHeader>
            <ModalBody className="bg-danger text-white">
              Usuário e/ou senha incorretos! Por favor, tente novamente.
              <br />
              <br />
              Caso o problema persista, por favor entre em contato com um dos
              líderes para realizar a redefinição.
            </ModalBody>
          </Modal>

          <div className={`${isLoaderVisible ? "" : "d-none"}`}>
            <Loader />
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
