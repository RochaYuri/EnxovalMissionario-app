import { faListDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { InputGroup, InputGroupText } from "reactstrap";

export default function ItemsSelect({ items, onChange, id }) {
  const [selectedItem, setSelectedItem] = useState("");

  const handleChange = (e) => {
    setSelectedItem(e.target.value);
    onChange(e.target.value, id);
  };

  let previousCategory = 0;

  return (
    <InputGroup>
      <InputGroupText>
        <FontAwesomeIcon icon={faListDots} />
      </InputGroupText>
      <select
        id="select"
        className="form-control"
        value={selectedItem}
        onChange={handleChange}
        required
      >
        <option value="">Selecione um item</option>
        {items
          .filter((item) => item.remainQuantity > 0)
          .sort((a, b) => a.category.id - b.category.id)
          .map((item, index) => {
            const isNewCategory = item.category.id !== previousCategory;
            if (isNewCategory) {
              previousCategory = item.category.id; // Atualiza a categoria para o próximo item
            }
            return (
              <React.Fragment key={index}>
                {isNewCategory && (
                  <>
                  <hr />
                    <optgroup label={item.category.name.toUpperCase()} />
                  </>
                )}
                <option
                  value={item.id}
                >{`${item.name} (${item.remainQuantity} restante(s))`}</option>
              </React.Fragment>
            );
          })}
      </select>
    </InputGroup>
  );
}
