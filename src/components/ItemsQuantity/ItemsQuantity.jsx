import { Input, InputGroup, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

export default function ItemsQuantity({ onChange, id }) {
  const handleChange = (e) => {
    onChange(e.target.value, id);
  };

  return (
    <InputGroup>
      <InputGroupText>
        <FontAwesomeIcon icon={faArrowUpWideShort} />
      </InputGroupText>
      <Input
        placeholder="Quantidade"
        type="number"
        onChange={handleChange}
        required
      />
    </InputGroup>
  );
}
