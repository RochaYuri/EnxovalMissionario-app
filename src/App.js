import "./App.css";
import { Container } from "reactstrap";
import React from "react";
import Header from "./components/Header/Header";
import ItemsForm from "./components/ItemsForm/ItemsForm";

function App() {
  return (
    <div className="App">
      <Container className="my-4">
        <Header />
        <hr className="my-5" />
        <ItemsForm />
      </Container>
    </div>
  );
}

export default App;
