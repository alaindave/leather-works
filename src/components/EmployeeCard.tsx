import { Card, Image, VStack } from "@chakra-ui/react";
import { CardBody } from "react-bootstrap";
import { Text } from "@chakra-ui/react";
import source from "../assets/photos/Jeanne.jpeg";
import "../css/App.css";

interface Employee {
  id: number;
  lastName: string;
  firstName: string;
  matricule: string;
  dateBirth: string;
  address: string;
  telephone: number;
  photo: string;
  date_embauche: string;
  salaire: string;
}

interface Props {
  employee: Employee;
}

const EmployeeCard = ({ employee }: Props) => {
  return (
    <Card bg=" #c39409" width="500px" padding="30px" borderRadius="30px">
      <CardBody>
        <VStack>
          <Image src={source} borderRadius={30} width={140} />
          <ul>
            <li>
              <Text color=" #262626" fontWeight="700">
                Nom:<span>{employee.lastName}</span>
              </Text>
            </li>
            <li>
              <Text color=" #262626" fontWeight="700">
                Prenom:<span>{employee.firstName}</span>
              </Text>
            </li>
            <li>
              <Text color=" #262626" fontWeight="700">
                Matricule:<span>{employee.matricule}</span>
              </Text>
            </li>
          </ul>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default EmployeeCard;
