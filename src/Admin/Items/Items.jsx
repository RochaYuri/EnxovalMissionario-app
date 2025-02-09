import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
  faEdit,
  faFloppyDisk,
  faIdCard,
  faListDots,
  faQ,
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
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  Toast,
} from "reactstrap";
import styles from "./styles.module.css";
import "../css/styles.css";
import NavbarAdmin from "../../components/Navbar/Navbar";
import Loader from "../../components/Loader/Loader";
import PaginationComponent from "../../components/Pagination/Pagination";

export default function Items() {
  let [funcao, setFuncao] = useState("Cadastrar");
  const [itemsList, setItemsList] = useState([]);
  const [itemToUpdate, setItemToUpdate] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalFalha, setModalFalha] = useState(false);
  const [modalSucessoMessage, setModalSucessoMessage] = useState("");
  const [modalFalhaMessage, setModalFalhaMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [userLogged, setUserLogged] = useState("");
  const navigate = useNavigate();

  const modalSucessoToggle = () => setModalSucesso(!modalSucesso);
  const modalFalhaToggle = () => setModalFalha(!modalFalha);

  useEffect(() => {
    const storedUser = JSON.parse(window.sessionStorage.getItem("user"));

    if (!storedUser) {
      navigate("/Admin");
    } else {
      setUserLogged(storedUser);

      axios
        .get(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/page/${currentPage}/${process.env.REACT_APP_PAGE_SIZE}`
        )
        .then((response) => {
          setItemsList(response.data);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items`)
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

  const handlePagination = (newPage) => {
    setCurrentPage(newPage);

    setIsLoaderVisible(true);

    axios
      .get(
        `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/page/${newPage}/${process.env.REACT_APP_PAGE_SIZE}`
      )
      .then((response) => {
        setItemsList(response.data);
        setIsLoaderVisible(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemoveInputValue = () => {
    document.getElementById("InputNameItem").value = "";
    document.getElementById("selectCategoryNewItem").value = "";
    document.getElementById("InputQuantityNewItem").value = "";

    setFuncao("Cadastrar");
  };

  const handleUpdateInputValue = (item) => {
    setItemToUpdate(item);
    document.getElementById("InputNameItem").value = item.name;
    document.getElementById("selectCategoryNewItem").value = item.category.id;
    document.getElementById("InputQuantityNewItem").value = item.totalQuantity;

    setFuncao("Editar");
  };

  const handleRemoveItem = (itemId) => {
    document.getElementById("loaderDiv").classList.add("d-none");

    axios
      .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items`)
      .then((response) => {
        axios
          .delete(
            `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/remove/${itemId}`
          )
          .then((response) => {
            const newItemsList = itemsList.filter((item) => item.id !== itemId);

            setItemsList(newItemsList);

            setModalSucessoMessage("Item removido com sucesso!");

            handleRemoveInputValue();

            document.getElementById("loaderDiv").classList.add("d-none");
            modalSucessoToggle();
          })
          .catch((err) => {
            setModalFalhaMessage(
              "Ops! Ocorreu uma falha ao remover o item! Por favor, contate o responsável técnico!"
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

    let name = document.getElementById("InputNameItem").value;
    let categoryId = document.getElementById("selectCategoryNewItem").value;
    let categoryName = categoriesList.find(
      (category) => category.id === parseInt(categoryId)
    ).name;
    let quantity = document.getElementById("InputQuantityNewItem").value;

    const newItem = {
      id: 0,
      category: {
        id: parseInt(categoryId),
        name: categoryName.toLowerCase(),
      },
      remainQuantity: quantity,
      totalQuantity: quantity,
      name: name,
      donations: [],
      createdAt: "",
      createdBy: "",
      updatedAt: "",
      updatedBy: "",
    };

    if (funcao === "Cadastrar") {
      newItem.createdAt = new Date().toLocaleString("pt-BR");
      newItem.createdBy = userLogged.username;

      axios
        .post(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/add`,
          newItem
        )
        .then((response) => {
          setModalSucessoMessage(
            `Item ${newItem.name.toUpperCase()} adicionado com sucesso!`
          );

          document.getElementById("loaderDiv").classList.add("d-none");

          modalSucessoToggle();

          axios
            .get(
              `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/page/${currentPage}/${process.env.REACT_APP_PAGE_SIZE}`
            )
            .then((response) => {
              setItemsList(response.data);
            });
        })
        .catch((err) => {
          setModalFalhaMessage(
            `Ops! Ocorreu uma falha ao adicionar o item ${newItem.name}. Por favor, contate o responsável técnico para resolução!`
          );
          document.getElementById("loaderDiv").classList.add("d-none");
          modalFalhaToggle();
          console.log(err);
        });
    } else {
      newItem.id = itemToUpdate.id;
      newItem.createdAt = itemToUpdate.createdAt;
      newItem.createdBy = itemToUpdate.createdBy;
      newItem.updatedAt = new Date().toLocaleString("pt-BR");
      newItem.updatedBy = userLogged.username;

      axios
        .put(
          `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/update`,
          newItem
        )
        .then((response) => {
          setModalSucessoMessage(
            `Item ${newItem.name.toUpperCase()} atualizado com sucesso!`
          );

          handleRemoveInputValue();
          document.getElementById("loaderDiv").classList.add("d-none");

          modalSucessoToggle();

          axios
            .get(
              `${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/page/${currentPage}/${process.env.REACT_APP_PAGE_SIZE}`
            )
            .then((response) => {
              setItemsList(response.data);
            });
        })
        .catch((err) => {
          setModalFalhaMessage(
            `Ops! Ocorreu uma falha ao alterar o item ${newItem.name.toUpperCase()}. Por favor, contate o responsável técnico para resolução!`
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
      {!isLoaderVisible ? (
        <>
          <NavbarAdmin />
          <Container className="mt-5">
            <Row>
              <Col xs="12">
                <h3 className="text-center fw-bold text-white">ITENS</h3>
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
                          <th>Categoria</th>
                          <th className="text-center">Qtd</th>
                          <th>Criado em</th>
                          <th>Responsável</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsList.length > 0 ? (
                          itemsList.map((item) => (
                            <tr key={item.id}>
                              <td
                                className={`${styles.colOptions} text-center`}
                              >
                                <Button
                                  onClick={() => handleUpdateInputValue(item)}
                                  className="text-warning btn-unstyled p-0"
                                  title={`Editar o item ${
                                    item.id
                                  } - ${item.name.toUpperCase()}`}
                                >
                                  <FontAwesomeIcon
                                    icon={faEdit}
                                    className="mx-2"
                                  />
                                </Button>
                                <Button
                                  className="text-danger btn-unstyled p-0"
                                  title={`Remover o item ${
                                    item.id
                                  } - ${item.name.toUpperCase()}`}
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="mx-2 text-danger"
                                  />
                                </Button>
                              </td>
                              <td className="text-center">{item.id}</td>
                              <td>{item.name.toUpperCase()}</td>
                              <td>
                                {item.category.id} -{" "}
                                {item.category.name.toUpperCase()}
                              </td>
                              <td className="text-center">
                                {item.totalQuantity}
                              </td>
                              <td>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </td>
                              <td>{item.createdBy.toUpperCase()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              className="text-center bg-danger fw-bold"
                              colSpan={7}
                            >
                              Não encontramos nenhum item cadastrado!
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
                        ? ` o item ${
                            itemToUpdate.id
                          } - ${itemToUpdate.name.toUpperCase()}`
                        : ` um novo item`}
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
                          id="InputNameItem"
                          type="text"
                          placeholder="Digite o nome do novo item"
                          className="rounded"
                          required
                        />
                      </InputGroup>
                      <InputGroup className="input-group mt-3">
                        <InputGroupText
                          className={`${styles.inputGroupText} text-dark`}
                        >
                          <FontAwesomeIcon icon={faListDots} />
                        </InputGroupText>
                        <select
                          id="selectCategoryNewItem"
                          className="rounded form-control"
                          required
                        >
                          <option value="">Selecione</option>
                          {categoriesList.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </InputGroup>
                      <InputGroup className="input-group mt-3">
                        <InputGroupText
                          className={`${styles.inputGroupText} text-dark`}
                        >
                          <FontAwesomeIcon icon={faQ} />
                        </InputGroupText>
                        <Input
                          id="InputQuantityNewItem"
                          type="number"
                          placeholder="Digite a quantidade do novo item"
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
                          <Button
                            type="submit"
                            className="mt-3"
                            color="success"
                          >
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
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
