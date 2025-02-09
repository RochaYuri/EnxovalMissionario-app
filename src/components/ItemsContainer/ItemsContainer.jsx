import { Button, Col, Row } from "reactstrap";
import ItemsSelect from "../ItemsSelect/ItemsSelect";
import ItemsQuantity from "../ItemsQuantity/ItemsQuantity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";

export default function ItemsContainer({ items, onRemove, onSelect, onEditQuantity, id, quantity }) {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(id);
    }
  };

  const handleChange = (value) => {
    if (onSelect) {
      onSelect(value, id);
    }
  };

  const handleEditQuantity = (quantity) => {
    if (onEditQuantity) {
      onEditQuantity(quantity, id);
    }
  };

  return (
    <Row className="my-5 d-flex justify-content-center align-items-center" id={`item${id}`}>
      <Col>
        <Button
          color="danger"
          outline
          children={<FontAwesomeIcon icon={faMinus} />}
          type="button"
          onClick={handleRemove}
        />
      </Col>
      <Col xs="9">
        <Col>
          <ItemsSelect items={items} onChange={handleChange} />
        </Col>
        <Col className="mt-3">
          <ItemsQuantity onChange={handleEditQuantity} />
        </Col>
      </Col>
    </Row>
  );
}
