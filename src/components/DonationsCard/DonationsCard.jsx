import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  UncontrolledCollapse,
} from "reactstrap";
import styles from "./styles.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
} from "@fortawesome/free-solid-svg-icons";

export default function DonationsCard({ categoryName, categoryId }) {
  const [donationsArray, setDonationsArray] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ROUTE_PRODUCTION}/items`)
      .then((response) => {
        let duplicates;

        // retiro registros duplicados
        response.data.forEach((element) => {
          duplicates = element.donations.filter((donations, index, self) => {
            return (
              self.filter(
                (p, i) => p.name.toLowerCase() === donations.name.toLowerCase()
              ).length > 1
            );
          });

          if (duplicates.length > 1) {
            for (let i = 1; i < duplicates.length; i++) {
              duplicates[0].quantity += duplicates[i].quantity;
            }

            const newDonations = element.donations.filter(
              (person) =>
                person.name.toLowerCase() !== duplicates[0].name.toLowerCase()
            );

            newDonations.push(duplicates[0]);
            element.donations = newDonations;
          }
        });

        setDonationsArray(
          response.data.filter((item) => item.category.id === categoryId)
        );
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Card className="cardBg my-4">
      <CardHeader className="cardBtn text-center">
        <h4 id={"cardCategory" + categoryId}>{categoryName.toUpperCase()}</h4>
      </CardHeader>
      <UncontrolledCollapse toggler={"cardCategory" + categoryId}>
        <CardBody>
          {donationsArray.map((item) => (
            <div className="py-3" key={item.id}>
              <Button
                id={"item" + item.id}
                className={styles.buttonItem + " w-100"}
              >
                <h4>{item.name}</h4>
              </Button>
              <UncontrolledCollapse toggler={"item" + item.id}>
                <Card className="cardTable">
                  <CardBody className="overflow-auto">
                    <Table className="table-dark" hover>
                      <thead className="table-dark-header">
                        <tr>
                          <th>NOME</th>
                          <th className="text-center">CONTATO</th>
                          <th className="text-center">QUANTIDADE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.donations.length > 0 ? (
                          item.donations
                            .sort((a, b) => a.quantity - b.quantity)
                            .map((donation) => (
                              <tr>
                                <td className="fw-bold">{donation.name}</td>
                                <td className="text-center">
                                  {donation.contact}
                                </td>
                                <td className="text-center fw-bold">
                                  {donation.quantity}
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td
                              colSpan={3}
                              className={styles.noRows + " text-center fw-bold bg-danger"}
                            >
                              AINDA NÃO HÁ DOAÇÕES{" "}
                              <FontAwesomeIcon
                                icon={faFaceFrown}
                                className="ms-1"
                              />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </UncontrolledCollapse>
            </div>
          ))}
        </CardBody>
      </UncontrolledCollapse>
    </Card>
  );
}
