import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type Attendance from "../Attendance";

const EmployeeAttendance = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    axios
      .get<Attendance[]>("http://localhost:5000/employees/attendance")
      .then((res) => {
        setAttendances(res.data);
        console.log("Attendance received", res.data);
      })
      .catch((err) => {
        console.log("This is the error", err.message);
      });
  }, []);

  if (attendances.length > 0)
    return (
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Employes presents aujurd'hui</TableCaption>
          <Thead>
            <Tr>
              <Th color="#d6b65c">Nom et prenom</Th>
              <Th color="#d6b65c">Matricule</Th>
              <Th color="#d6b65c">Pointage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {attendances.map((attendance: Attendance) => (
              <Tr>
                <Td>
                  {attendance.employee.firstName} {attendance.employee.lastName}
                </Td>
                <Td>{attendance.employee.employeeID}</Td>
                <Td>{attendance.clockIn}</Td>
                <Td>
                  <Button>Clock out</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  else return <h1>Pas de presence aujurd'hui</h1>;
};

export default EmployeeAttendance;
