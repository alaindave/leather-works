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
  const [attendanceId, setAttendanceId] = useState("");
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
    console.log("Attendance to delete", attendanceId);
    await axios
      .delete(`//localhost:5000/employees/attendance/${attendanceId}`)
      .then((res) => {
        console.log("Deleted attendance", res.data);
        window.location.reload();
      })
      .catch((e) =>
        console.log("An error occured while deleting attendance", e)
      );
  };

  const handleClick = (attendanceId: string) => {
    onOpen();
    setAttendanceId(attendanceId);
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
                    {attendance.employee.firstName}{" "}
                    {attendance.employee.lastName}
                  </Td>
                  <Td>{attendance.employee.employeeID}</Td>
                  <Td>
                    <Editable
                      defaultValue={attendance.clockIn}
                      submitOnBlur
                      onSubmit={(newTime) =>
                        handleSubmit(newTime, attendance._id)
                      }
                    >
                      <EditablePreview color="white" />
                      <EditableInput />
                    </Editable>
                  </Td>
                  <FaWindowClose onClick={() => handleClick(attendance._id)} />
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    );
  else return <h1>Pas de presence aujurd'hui</h1>;
};

export default EmployeeAttendance;
