import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { faFloppyDisk, faPlus } from "@fortawesome/free-solid-svg-icons";
import ItemsContainer from "../../components/ItemsContainer/ItemsContainer";
import axios from "axios";
import InputMask from "react-input-mask";

export default function ItemsForm() {
  const [containers, setContainers] = useState([]);
  const [formData, setFormData] = useState([]);
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalFalha, setModalFalha] = useState(false);
  const [btnSubmit, setBtnSubmit] = useState(false);
  const [items, setItems] = useState([]);
  let index;

  const modalSucessoToggle = () => setModalSucesso(!modalSucesso);
  const modalFalhaToggle = () => setModalFalha(!modalFalha);

  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items`)
    .then((response) => setItems(response.data))
    .catch((err) => console.log(err));
  }, [])

  const handleAddClick = () => {
    const newKey = containers.length;
    setContainers((prevContainers) => [
      ...prevContainers,
      { key: newKey, items: items },
    ]);

    setTimeout(() => {
      var totalItems =
        document.getElementsByClassName("items-container")[0].childNodes.length;

      totalItems === 0 ? setBtnSubmit(false) : setBtnSubmit(true);
    }, 100);
  };

  const handleRemoveClick = (key) => {
    setContainers((prevContainers) =>
      prevContainers.filter((container) => container.key !== key)
    );

    setTimeout(() => {
      var totalItems =
        document.getElementsByClassName("items-container")[0].childNodes.length;

      totalItems === 0 ? setBtnSubmit(false) : setBtnSubmit(true);
    }, 100);
  };

  const handleOnChange = (value, id) => {
    index = formData.findIndex((items) => items.id === id);

    index !== -1
      ? setFormData(
          formData.map((item, i) =>
            i === index ? { ...item, value: value } : item
          )
        )
      : setFormData([...formData, { id: id, value: value, quantity: 0 }]);
  };

  const handleOnEditQuantity = (quantity, id) => {
    index = formData.findIndex((items) => items.id === id);

    index !== -1
      ? setFormData(
          formData.map((item, i) =>
            i === index ? { ...item, quantity: quantity } : item
          )
        )
      : setFormData([...formData, { id: id, value: 0, quantity: quantity }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const finalArray = {
      updates: [],
    };
    const name = document.getElementById("personName").value;
    const contact = document.getElementById("personContact").value;

    formData.forEach((data) => {
      finalArray.updates.push({
        itemId: parseInt(data.value),
        donationsObject: {
          name: name,
          contact: contact,
          quantity: parseInt(data.quantity),
        },
      });
    });

    axios
      .put(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items/donations`, finalArray)
      .then((response) => {
        console.log(response);
        modalSucessoToggle();
        var totalItems =
          document.getElementsByClassName("items-container")[0].childNodes
            .length;
        console.log(totalItems);

        for (var i = 0; i < totalItems; i++) {
          document.getElementById(`item${i}`).remove();
        }
      })
      .catch((error) => {
        modalFalhaToggle();
      });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs="12" md="6" className="my-2 my-md-0">
            <Input
              type="text"
              placeholder="Qual seu nome?"
              id="personName"
              required
            />
          </Col>
          <Col xs="12" md="6" className="my-2 my-md-0">
            <InputMask
              mask="(99) 999999999"
              maskChar={null}
              placeholder="Qual seu contato?"
              className="form-control"
              id="personContact"
              required
            />
          </Col>
        </Row>
        <h4 className="mt-4 p-3 bg-secondary rounded text-white">
          Selecione um item e sua quantidade. Se desejar, pode adicionar outras
          opções clicando no botão "+"
        </h4>
        <div className="items-container my-md-5 my-3">
          {containers.map((container) => (
            <ItemsContainer
              key={container.key}
              id={container.key}
              items={container.items}
              onRemove={handleRemoveClick}
              onSelect={handleOnChange}
              onEditQuantity={handleOnEditQuantity}
            />
          ))}
        </div>
        <Button
          color="success"
          outline
          onClick={handleAddClick}
          children={<FontAwesomeIcon icon={faPlus} />}
        />
        <Row className="mt-3 text-end">
          <Col>
            <Button color="success" type="submit" disabled={!btnSubmit && true}>
              <FontAwesomeIcon icon={faFloppyDisk} className="me-1" /> Salvar
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal isOpen={modalSucesso} toggle={modalSucessoToggle}>
        <ModalHeader
          className="bg-success text-white border-dark border-2"
          toggle={modalSucessoToggle}
        >
          Agradecemos à sua ajuda!
        </ModalHeader>
        <ModalBody className="bg-success text-white">
          Recebemos as informações das doações que você fará, e agradecemos
          imensamente o apoio!
          <br />
          <br />
          Sabemos que o senhor lhe abençoará imensamente por estar sendo um
          instrumento nas mãos do próprio senhor ao ajudar um de seus servos!
        </ModalBody>
      </Modal>

      <Modal isOpen={modalFalha} toggle={modalFalhaToggle}>
        <ModalHeader
          className="bg-danger text-white border-dark border-2"
          toggle={modalFalhaToggle}
        >
          Ops! ocorreu um erro ao salvarmos suas informações
        </ModalHeader>
        <ModalBody className="bg-danger text-white">
          Tentamos realizar a gravação de suas doações, porém encontramos
          problemas durante o caminho!
          <br />
          <br />
          Por gentileza, contate um dos líderes para que possamos verificar e
          resolver o mais rápido possível!
        </ModalBody>
      </Modal>
    </>
  );
}
