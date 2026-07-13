import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Text,
} from "@chakra-ui/react";
import Leave from "../../shared/types/Leave";

const statusColor = (status: string) => {
  switch (status) {
    case "APPROUVÉ":
      return "green";
    case "REFUSÉ":
      return "red";
    case "EN ATTENTE D'APPROBATION":
      return "orange";
    case "ANNULÉ":
      return "gray";
    default:
      return "gray";
  }
};

interface Props {
  leaves: Leave[];
}

export default function LeaveHistoryTable({ leaves }: Props) {
  return (
    <TableContainer
      borderWidth="1px"
      borderRadius="lg"
      overflowX="auto"
      bg="white"
      shadow="sm"
      mt="2rem"
      ml="2rem"
    >
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th>Soumis le</Th>
            <Th>Debut de congé</Th>
            <Th>Fin de congé</Th>
            <Th>Motif</Th>
            <Th>Notes</Th>
            <Th>Statut</Th>
          </Tr>
        </Thead>

        <Tbody>
          {leaves.map((leave) => (
            <Tr key={leave._id}>
              <Td>{new Date(leave.submittedAt).toLocaleDateString("fr-FR")}</Td>

              <Td>{new Date(leave.startDate).toLocaleDateString("fr-FR")}</Td>

              <Td>{new Date(leave.endDate).toLocaleDateString("fr-FR")}</Td>

              <Td fontWeight="medium">{leave.subject}</Td>

              <Td maxW="300px">
                <Text mt="1rem" noOfLines={3}>
                  {leave.notes}
                </Text>
              </Td>

              <Td>
                <Badge
                  bg={statusColor(leave.status)}
                  color="#ffffff"
                  borderRadius="full"
                  px={3}
                  py={1}
                  textTransform="capitalize"
                >
                  {leave.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
