import {
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import Attendance from "../../shared/types/Attendance";
import { formatLateMinutes } from "./ClockIn";

interface AttendanceTableProps {
  records: Attendance[];
}

const getStatusColor = (status: Attendance["status"]) => {
  switch (status) {
    case "PONCTUEL":
      return "green";
    case "RETARD":
      return "orange";
    case "ABSENT":
      return "red";
    case "CONGÉ":
      return "purple";
    default:
      return "gray";
  }
};

export default function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <TableContainer
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
    >
      <Table variant="simple" size="md">
        <Thead bg="gray.50">
          <Tr>
            <Th>Date</Th>
            <Th>Pointage entrée</Th>
            <Th>Pointage sortie</Th>
            <Th>Statut</Th>
            <Th>Minutes de retard</Th>
            <Th>Notes</Th>
          </Tr>
        </Thead>

        <Tbody>
          {records.map((record) => (
            <Tr key={record._id}>
              <Td>{new Date(record.date).toLocaleDateString("fr-FR")}</Td>

              <Td>
                {record.clockIn ? (
                  new Date(record.clockIn).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                ) : (
                  <Text color="gray.400">—</Text>
                )}
              </Td>

              <Td>
                {record.clockOut ? (
                  new Date(record.clockOut).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                ) : (
                  <Text color="gray.400">—</Text>
                )}
              </Td>

              <Td>
                <Badge
                  bg={getStatusColor(record.status)}
                  color="#ffffff"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="0.85em"
                >
                  {record.status}
                </Badge>
              </Td>
              <Td>
                {record.lateMinutes && formatLateMinutes(record.lateMinutes)}
              </Td>
              <Td>{record.lateNotes}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
