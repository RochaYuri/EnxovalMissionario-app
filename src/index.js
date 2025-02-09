import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css"
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./Admin/Login/Login";
import AdminHome from "./Admin/Home/Home";
import Donations from "./Admin/Donations/Donations";
import Maintenance from "./Admin/Maintenance/Maintenance";
import Categories from "./Admin/Categories/Categories";
import PersonalInfos from "./Admin/PersonalInfos/PersonalInfos";
import Items from "./Admin/Items/Items";
import Users from "./Admin/Users/Users";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Admin" element={<AdminHome />} />
      <Route path="/Admin/Login" element={<Login />} />
      <Route path="/Admin/Doacoes" element={<Donations />} />
      <Route path="/Admin/Categorias" element={<Categories />} />
      <Route path="/Admin/Itens" element={<Items />} />
      <Route path="/Admin/Usuarios" element={<Users />} />
      <Route path="/Admin/InformacoesPessoais" element={<PersonalInfos />} />
      <Route path="/Manutencao" element={<Maintenance />} />
    </Routes>
  </BrowserRouter>
);
