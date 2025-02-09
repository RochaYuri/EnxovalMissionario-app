import {
  faAt,
  faEdit,
  faFloppyDisk,
  faIdCard,
  faList,
  faLock,
  faSignature,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import Select from "react-select";
import styles from "./styles.module.css";
import "../css/styles.css";
import NavbarAdmin from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import PaginationComponent from "../../components/Pagination/Pagination";

export default function Users() {
  let [funcao, setFuncao] = useState("Cadastrar");
  const [usersList, setUsersList] = useState([]);
  const [userToUpdate, setUserToUpdate] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalFalha, setModalFalha] = useState(false);
  const [modalSucessoMessage, setModalSucessoMessage] = useState("");
  const [modalFalhaMessage, setModalFalhaMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [roles, setRoles] = useState({});
  const [rolesSelected, setRolesSelected] = useState([]);
  const [userLogged, setUserLogged] = useState({});
  const navigate = useNavigate();

  const modalSucessoToggle = () => setModalSucesso(!modalSucesso);
  const modalFalhaToggle = () => setModalFalha(!modalFalha);

  useEffect(() => {
    const storedUser = JSON.parse(window.sessionStorage.getItem("user"));

    if (
      !storedUser ||
      !storedUser.roles.some((role) => role.toUpperCase() === "ADMIN")
    ) {
      navigate("/Admin");
    } else {
      setUserLogged(storedUser);
      setIsLoaderVisible(true);

      axios
        .get(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users/page/${currentPage}/${process.env.REACT_APP_PAGE_SIZE}`
        )
        .then((response) => {
          setUsersList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users`)
        .then((response) => {
          const length = response.data.length;
          let quantity = [];
          for (
            let i = 1;
            i <= Math.ceil(length / process.env.REACT_APP_PAGE_SIZE);
            i++
          ) {
            quantity.push(i);
          }
          setTotalPages(quantity);
        });

      const rolesObj = [
        { value: "ADMIN", label: "ADMIN" },
        { value: "MISSIONARY", label: "MISSIONARY" },
      ];

      setRoles(rolesObj);

      setIsLoaderVisible(false);
    }
  }, []);

  const handlePagination = (newPage) => {
    setCurrentPage(newPage);

    setIsLoaderVisible(true);

    axios
      .get(
        `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users/page/${newPage}/${process.env.REACT_APP_PAGE_SIZE}`
      )
      .then((response) => {
        setUsersList(response.data);
        setIsLoaderVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemoveInputValue = () => {
    document.getElementById("InputNameUser").value = "";
    document.getElementById("InputUsername").value = "";
    document.getElementById("InputEmail").value = "";
    document.getElementById("InputPasswordUser").value = "";
    setRolesSelected(null);

    setFuncao("Cadastrar");
  };

  const handleUpdateInputValue = (user) => {
    setUserToUpdate(user);
    document.getElementById("InputNameUser").value = user.name;
    document.getElementById("InputUsername").value = user.username;
    document.getElementById("InputEmail").value = user.email;
    document.getElementById("InputPasswordUser").value = user.password;

    const userRoles = [];

    user.roles.forEach((role) => {
      userRoles.push({ label: role, value: role });
    });

    setRolesSelected(userRoles);
    setFuncao("Editar");
  };

  const handleRemoveUser = (userId) => {
    document.getElementById("loaderDiv").classList.add("d-none");

    axios
      .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users`)
      .then((response) => {
        axios
          .delete(
            `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users/remove/${userId}`
          )
          .then((response) => {
            const newUsersList = usersList.filter((user) => user.id !== userId);

            setUsersList(newUsersList);

            setModalSucessoMessage("Usuário removido com sucesso!");

            handleRemoveInputValue();

            document.getElementById("loaderDiv").classList.add("d-none");
            modalSucessoToggle();
          })
          .catch((err) => {
            setModalFalhaMessage(
              "Ops! Ocorreu uma falha ao remover o usuário! Por favor, contate o responsável técnico!"
            );

            handleRemoveInputValue();
            document.getElementById("loaderDiv").classList.add("d-none");
            modalFalhaToggle();
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    document.getElementById("loaderDiv").classList.remove("d-none");

    const name = document.getElementById("InputNameUser").value;
    const username = document.getElementById("InputUsername").value;
    const email = document.getElementById("InputEmail").value;
    const password = document.getElementById("InputPasswordUser").value;
    const rolesValues = [];
    rolesSelected.forEach((role) => {
      rolesValues.push(role.value);
    });

    const newUser = {
      id: 0,
      name: name.toUpperCase(),
      username: username.toUpperCase(),
      password: password,
      email: email.toLowerCase(),
      roles: rolesValues,
      createdAt: "",
      createdBy: "",
      updatedAt: "",
      updatedBy: "",
    };

    if (funcao === "Cadastrar") {
      newUser.createdAt = new Date().toLocaleString("pt-BR");
      newUser.createdBy = userLogged.username;

      axios
        .post(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users/add`,
          newUser
        )
        .then((response) => {
          setModalSucessoMessage(
            `Usuário ${newUser.name.toUpperCase()} adicionado com sucesso!`
          );

          document.getElementById("loaderDiv").classList.add("d-none");

          modalSucessoToggle();

          axios
            .get(
              `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users/page/${currentPage}/${process.env.REACT_APP_PAGE_SIZE}`
            )
            .then((response) => {
              setUsersList(response.data);
            });

          handleRemoveInputValue();
        })
        .catch((err) => {
          setModalFalhaMessage(
            `Ops! Ocorreu uma falha ao adicionar o usuário ${newUser.name}. Por favor, contate o responsável técnico para resolução!`
          );
          document.getElementById("loaderDiv").classList.add("d-none");
          modalFalhaToggle();
          console.log(err);
        });
    } else {
      newUser.id = userToUpdate.id;
      newUser.createdAt = userToUpdate.createdAt;
      newUser.createdBy = userToUpdate.createdBy;
      newUser.updatedAt = new Date().toLocaleString("pt-BR");
      newUser.updatedBy = userLogged.username;

      axios
        .put(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users/update`,
          newUser
        )
        .then((response) => {
          setModalSucessoMessage(
            `Usuário ${newUser.name.toUpperCase()} atualizado com sucesso!`
          );

          handleRemoveInputValue();
          document.getElementById("loaderDiv").classList.add("d-none");

          modalSucessoToggle();

          axios
            .get(
              `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/users/page/${currentPage}/${process.env.REACT_APP_PAGE_SIZE}`
            )
            .then((response) => {
              setUsersList(response.data);
            });
        })
        .catch((err) => {
          setModalFalhaMessage(
            `Ops! Ocorreu uma falha ao alterar o usuário ${newUser.name.toUpperCase()}. Por favor, contate o responsável técnico para resolução!`
          );
          handleRemoveInputValue();
          document.getElementById("loaderDiv").classList.add("d-none");
          modalFalhaToggle();
          console.log(err);
        });
    }
  };

  return (
    <div className="backgroundAdmin">
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs="12">
            <h3 className="text-center fw-bold text-white">USUÁRIOS</h3>
          </Col>
        </Row>
        <hr className="text-white" />
        <Row>
          <Col md="8" xs="12">
            <Card className="cardTable">
              <CardBody>
                <Table hover className="table-dark rounded">
                  <thead>
                    <tr>
                      <th className="text-center"></th>
                      <th className="text-center">ID</th>
                      <th>Nome</th>
                      <th>Usuário</th>
                      <th className="text-center">Roles</th>
                      <th>Criado em</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.length > 0 ? (
                      usersList.map((user) => (
                        <tr key={user.id}>
                          <td className={`${styles.colOptions} text-center`}>
                          {user.id !== 1 ? (
                            <Button
                              onClick={() => handleUpdateInputValue(user)}
                              className="text-warning btn-unstyled p-0"
                              title={`Editar o usuário ${
                                user.id
                              } - ${user.name.toUpperCase()}`}
                            >
                              <FontAwesomeIcon icon={faEdit} className="mx-2" />
                            </Button>
                            ) : null}
                            {user.id !== 1 ? (
                              <Button
                                className="text-danger btn-unstyled p-0"
                                title={`Remover o usuário ${
                                  user.id
                                } - ${user.name.toUpperCase()}`}
                                onClick={() => handleRemoveUser(user.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="mx-2 text-danger"
                                />
                              </Button>
                            ) : null}
                          </td>
                          <td className="text-center">{user.id}</td>
                          <td>{user.name.toUpperCase()}</td>
                          <td>{user.username.toUpperCase()}</td>
                          <td>
                            <ul className="pe-3">
                              {user.roles.map((role) => (
                                <li key={role}>{role}</li>
                              ))}
                            </ul>
                          </td>
                          <td>{user.createdAt.split(",")[0]}</td>
                          <td>{user.createdBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="text-center bg-danger fw-bold"
                          colSpan={7}
                        >
                          Não encontramos nenhum usuário cadastrado!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <PaginationComponent
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handlePagination={handlePagination}
                />
              </CardFooter>
            </Card>
          </Col>
          <Col md="4" xs="12">
            <Card className="cardBg">
              <CardHeader>
                <h4 className="text-center m-auto fw-bold text-white">
                  {funcao}
                  {funcao === "Editar"
                    ? ` o usuário ${
                        userToUpdate.id
                      } - ${userToUpdate.name.toUpperCase()}`
                    : ` um novo usuário`}
                </h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="input-group">
                    <InputGroupText
                      className={`${styles.inputGroupText} text-dark`}
                    >
                      <FontAwesomeIcon icon={faSignature} />
                    </InputGroupText>
                    <Input
                      id="InputNameUser"
                      type="text"
                      placeholder="Digite o nome do novo usuário"
                      className="rounded"
                      required
                    />
                  </InputGroup>
                  <InputGroup className="input-group mt-3">
                    <InputGroupText
                      className={`${styles.inputGroupText} text-dark`}
                    >
                      <FontAwesomeIcon icon={faIdCard} />
                    </InputGroupText>
                    <Input
                      id="InputUsername"
                      type="text"
                      placeholder="Digite o login do novo usuário"
                      className="rounded"
                      required
                    />
                  </InputGroup>
                  <InputGroup className="input-group mt-3">
                    <InputGroupText
                      className={`${styles.inputGroupText} text-dark`}
                    >
                      <FontAwesomeIcon icon={faAt} />
                    </InputGroupText>
                    <Input
                      id="InputEmail"
                      type="email"
                      placeholder="email@email.com"
                      className="rounded"
                      required
                    />
                  </InputGroup>
                  <InputGroup className="input-group mt-3">
                    <InputGroupText
                      className={`${styles.inputGroupText} text-dark`}
                    >
                      <FontAwesomeIcon icon={faLock} />
                    </InputGroupText>
                    <Input
                      id="InputPasswordUser"
                      type="text"
                      placeholder="Digite a senha do novo usuário"
                      className="rounded"
                      required
                    />
                  </InputGroup>
                  <InputGroup className="input-group mt-3">
                    <InputGroupText
                      className={`${styles.inputGroupText} text-dark`}
                    >
                      <FontAwesomeIcon icon={faList} />
                    </InputGroupText>
                    <Select
                      required
                      isMulti
                      name="userRoles"
                      id="inputUserRoles"
                      options={roles}
                      className="form-control p-0 basic-multi-select"
                      classNamePrefix="select"
                      onChange={(role) => setRolesSelected(role)}
                      value={rolesSelected}
                      placeholder="Selecione..."
                    />
                  </InputGroup>
                  <Row>
                    <Col xs="6">
                      <Button
                        type="button"
                        className="mt-3"
                        color="danger"
                        onClick={handleRemoveInputValue}
                      >
                        Limpar
                        <FontAwesomeIcon icon={faXmark} className="ms-2" />
                      </Button>
                    </Col>
                    <Col xs="6" className="text-end">
                      <Button type="submit" className="mt-3" color="success">
                        Salvar
                        <FontAwesomeIcon icon={faFloppyDisk} className="ms-2" />
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modalSucesso} toggle={modalSucessoToggle}>
        <ModalHeader
          className="bg-success text-white border-dark border-2"
          toggle={modalSucessoToggle}
        >
          SUCESSO!
        </ModalHeader>
        <ModalBody className="bg-success text-white">
          {modalSucessoMessage}
        </ModalBody>
      </Modal>

      <Modal isOpen={modalFalha} toggle={modalFalhaToggle}>
        <ModalHeader
          className="bg-danger text-white border-dark border-2"
          toggle={modalFalhaToggle}
        >
          ERRO!
        </ModalHeader>
        <ModalBody className="bg-danger text-white">
          {modalFalhaMessage}
        </ModalBody>
      </Modal>

      <div id="loaderDiv" className={`${isLoaderVisible ? "" : "d-none"}`}>
        <Loader />
      </div>
    </div>
  );
}
