import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type Attendance from "../Attendance";
import { FaWindowClose } from "react-icons/fa";

const EmployeeAttendance = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [attendance, setAttendance] = useState<Attendance>({} as Attendance);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

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

  const handleSubmit = (newTime: string, attendanceId: string) => {
    axios
      .put<Attendance[]>(
        `http://localhost:5000/employees/attendance/${attendanceId}`,
        {
          clockIn: newTime,
        }
      )
      .then((res) => {
        console.log("Edited attendance", res.data);
        window.location.reload();
      })
      .catch((e) =>
        console.log("An error occured while editing attendance:", e)
      );
  };

  const handleDelete = async () => {
    console.log("Attendance to delete", attendance);
    await axios
      .put(`//localhost:5000/employees/${attendance.employee._id}`, {
        present: false,
      })
      .then(() => {
        return axios.delete(
          `//localhost:5000/employees/attendance/${attendance._id}`
        );
      })
      .then((res) => {
        console.log("Deleted attendance", res.data);
        window.location.reload();
      })
      .catch((e) =>
        console.log("An error occured while deleting attendance", e)
      );
  };

  const handleClick = (attendance: Attendance) => {
    onOpen();
    setAttendance(attendance);
  };

  if (attendances.length > 0)
    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Supprimer de la liste de presence
              </AlertDialogHeader>

              <AlertDialogBody>
                Etes de vous sur de vouloir supprimer l'employe de la liste de
                presence?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Annuler
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Supprimer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
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
                <Tr key={attendance._id}>
                  <Td>
                    {attendance.employee && attendance.employee.firstName}{" "}
                    {attendance.employee && attendance.employee.lastName}
                  </Td>
                  <Td>
                    {attendance.employee && attendance.employee.employeeID}
                  </Td>
                  <Td>
                    <Editable
                      defaultValue={attendance && attendance.clockIn}
                      submitOnBlur
                      onSubmit={(newTime) =>
                        handleSubmit(newTime, attendance._id)
                      }
                    >
                      <EditablePreview color="white" />
                      <EditableInput />
                    </Editable>
                  </Td>
                  <FaWindowClose onClick={() => handleClick(attendance)} />
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  else
    return (
      <p style={{ fontSize: "40px", color: "#d6b65c" }}>
        Pas de presence aujurd'hui
      </p>
    );
};

export default EmployeeAttendance;
