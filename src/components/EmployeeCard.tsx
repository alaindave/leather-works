import { Card, Image, VStack } from "@chakra-ui/react";
import { CardBody } from "react-bootstrap";
import { Text } from "@chakra-ui/react";
import source from "../assets/photos/Jeanne.jpeg";

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
    <Card
      bg="#e63900
    "
      width="500px"
      padding="30px"
      borderRadius="30px"
    >
      <CardBody>
        <VStack>
          <Image src={source} borderRadius={30} width={200} />
          <ul>
            <li>
              <Text>Nom:{employee.lastName}</Text>
            </li>
            <li>
              <Text>Prenom:{employee.firstName}</Text>
            </li>
            <li>
              <Text>Matricule:{employee.matricule}</Text>
            </li>
          </ul>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default EmployeeCard;
