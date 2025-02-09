import {
  faEdit,
  faFloppyDisk,
  faIdCard,
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
import styles from "./styles.module.css";
import "../css/styles.css";
import NavbarAdmin from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import PaginationComponent from "../../components/Pagination/Pagination";

export default function Categories() {
  const [categoriesList, setCategoriesList] = useState([]);
  let [funcao, setFuncao] = useState("Cadastrar");
  const [categoryToUpdate, setCategoryToUpdate] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalFalha, setModalFalha] = useState(false);
  const [modalSucessoMessage, setModalSucessoMessage] = useState("");
  const [modalFalhaMessage, setModalFalhaMessage] = useState("");
  const [itemsInsideCategory, setItemsInsideCategory] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [userLogged, setUserLogged] = useState("");
  const navigate = useNavigate();

  const modalSucessoToggle = () => setModalSucesso(!modalSucesso);
  const modalFalhaToggle = () => setModalFalha(!modalFalha);

  useEffect(() => {
    const storedUser = JSON.parse(window.sessionStorage.getItem("user"));

    if (!storedUser) {
      navigate("/Admin");
    } else {
      setUserLogged(storedUser)
      setIsLoaderVisible(true);

      axios
        .get(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories/page/${currentPage}/${process.env.REACT_APP_PAGE_SIZE}`
        )
        .then((response) => {
          setCategoriesList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories`)
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

      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories`)
        .then((response) => {
          setCategoriesList(response.data);
          setIsLoaderVisible(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleRemoveInputValue = () => {
    document.getElementById("InputNomeCategoria").value = "";

    setFuncao("Cadastrar");
  };

  const handleUpdateInputValue = (category) => {
    setCategoryToUpdate(category);
    document.getElementById("InputNomeCategoria").value =
      category.name.toUpperCase();

    setFuncao("Editar");
  };

  const handleRemoveCategory = (categoryId) => {
    document.getElementById("loaderDiv").classList.add("d-none");

    axios
      .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items`)
      .then((response) => {
        const quantity = response.data.filter(
          (item) => item.category.id === categoryId
        ).length;

        setItemsInsideCategory(quantity);

        if (itemsInsideCategory > 0) {
          setModalFalhaMessage(
            `Há ${itemsInsideCategory} itens vinculados a categoria. Por favor, remova todos eles para que seja possível excluir a categoria!`
          );

          handleRemoveInputValue();
          document.getElementById("loaderDiv").classList.add("d-none");
          modalFalhaToggle();
        } else {
          axios
            .delete(
              `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories/remove/${categoryId}`
            )
            .then((response) => {
              const newCategoriesList = categoriesList.filter(
                (category) => category.id !== categoryId
              );

              setCategoriesList(newCategoriesList);

              setModalSucessoMessage("Categoria removida com sucesso!");

              handleRemoveInputValue();

              document.getElementById("loaderDiv").classList.add("d-none");
              modalSucessoToggle();
            })
            .catch((err) => {
              setModalFalhaMessage(
                "Ops! Ocorreu uma falha ao remover a categoria! Por favor, contate o responsável técnico!"
              );

              handleRemoveInputValue();
              document.getElementById("loaderDiv").classList.add("d-none");
              modalFalhaToggle();
              console.log(err);
            });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    document.getElementById("loaderDiv").classList.remove("d-none");

    const newCategory = {
      id: 0,
      name: document.getElementById("InputNomeCategoria").value.toLowerCase(),
      createdAt: "",
      createdBy: "",
      updatedAt: "",
      updatedBy: "",
    };

    if (funcao === "Cadastrar") {
      newCategory.createdAt = new Date().toLocaleString("pt-BR");
      newCategory.createdBy = userLogged.username;

      axios
        .post(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories/add`,
          newCategory
        )
        .then((response) => {
          setModalSucessoMessage(
            `Categoria ${newCategory.name.toUpperCase()} adicionada com sucesso!`
          );

          document.getElementById("loaderDiv").classList.add("d-none");

          modalSucessoToggle();

          axios
            .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories`)
            .then((response) => {
              setCategoriesList(response.data);
            });
        })
        .catch((err) => {
          setModalFalhaMessage(
            `Ops! Ocorreu uma falha ao adicionar a categoria ${newCategory.name}. Por favor, contate o responsável técnico para resolução!`
          );
          document.getElementById("loaderDiv").classList.add("d-none");
          modalFalhaToggle();
          console.log(err);
        });
    } else {
      newCategory.id = categoryToUpdate.id;
      newCategory.createdAt = categoryToUpdate.createdAt;
      newCategory.createdBy = categoryToUpdate.createdBy;
      newCategory.updatedAt = new Date().toLocaleString("pt-BR");
      newCategory.updatedBy = userLogged.username;

      axios
        .put(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories/update`,
          newCategory
        )
        .then((response) => {
          setModalSucessoMessage(
            `Categoria ${newCategory.name.toUpperCase()} atualizada com sucesso!`
          );

          handleRemoveInputValue();
          document.getElementById("loaderDiv").classList.add("d-none");

          modalSucessoToggle();

          axios
            .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories`)
            .then((response) => {
              setCategoriesList(response.data);
            });
        })
        .catch((err) => {
          setModalFalhaMessage(
            `Ops! Ocorreu uma falha ao alterar a categoria ${newCategory.name}. Por favor, contate o responsável técnico para resolução!`
          );
          handleRemoveInputValue();
          document.getElementById("loaderDiv").classList.add("d-none");
          modalFalhaToggle();
          console.log(err);
        });

      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories`)
        .then((response) => {
          setCategoriesList(response.data);
        });
    }
  };

  const handlePagination = (newPage) => {
    setCurrentPage(newPage);

    setIsLoaderVisible(true);

    axios
      .get(
        `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/categories/page/${newPage}/${process.env.REACT_APP_PAGE_SIZE}`
      )
      .then((response) => {
        setCategoriesList(response.data);
        setIsLoaderVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="backgroundAdmin">
      <NavbarAdmin />
      <Container className="mt-5">
        <Row>
          <Col xs="12">
            <h3 className="text-center fw-bold text-white">CATEGORIAS</h3>
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
                      <th>Criado em</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesList.length > 0 ? (
                      categoriesList.map((category) => (
                        <tr key={category.id}>
                          <td className={`${styles.colOptions} text-center`}>
                            <Button
                              onClick={() => handleUpdateInputValue(category)}
                              className="text-warning btn-unstyled"
                              title={`Editar a categoria ${
                                category.id
                              } - ${category.name.toUpperCase()}`}
                            >
                              <FontAwesomeIcon icon={faEdit} className="mx-2" />
                            </Button>
                            <Button
                              className="text-danger btn-unstyled"
                              title={`Remover a categoria ${
                                category.id
                              } - ${category.name.toUpperCase()}`}
                              onClick={() => handleRemoveCategory(category.id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="mx-2"
                              />
                            </Button>
                          </td>
                          <td className="text-center">{category.id}</td>
                          <td>{category.name.toUpperCase()}</td>
                          <td>
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>
                          <td>{category.createdBy.toUpperCase()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="text-center bg-danger fw-bold"
                          colSpan={5}
                        >
                          Não encontramos nenhuma categoria cadastrada!
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
                    ? ` a categoria ${
                        categoryToUpdate.id
                      } - ${categoryToUpdate.name.toUpperCase()}`
                    : ` uma nova categoria`}
                </h4>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="input-group">
                    <InputGroupText
                      className={`${styles.inputGroupText} text-dark`}
                    >
                      <FontAwesomeIcon icon={faIdCard} />
                    </InputGroupText>
                    <Input
                      id="InputNomeCategoria"
                      type="text"
                      placeholder="Digite o nome da nova categoria"
                      className="rounded"
                      required
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
