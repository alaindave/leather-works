import {
  Badge,
  HStack,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { ViewIcon, DownloadIcon } from "@chakra-ui/icons";
import { LuPrinter } from "react-icons/lu";
import { PayrollResultRecord } from "../../common/types/payroll/Payroll";

interface Props {
  payrollResults: PayrollResultRecord[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-BI", {
    style: "currency",
    currency: "FBU",
    maximumFractionDigits: 0,
  }).format(value);

const statusColor = {
  BROUILLON: "gray",
  EN_VERIFICATION: "gray",
  APPROUVÉ: "blue",
  PAYÉ: "green",
  ANNULÉ: "gray",
} as const;

export default function PayrollResultsTable({ payrollResults }: Props) {
  return (
    <TableContainer borderWidth="1px" borderRadius="lg" overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          <Tr>
            <Th>Employé</Th>
            <Th>Departement</Th>
            <Th isNumeric>Salaire de base</Th>
            <Th isNumeric>Remunération</Th>
            <Th isNumeric>Deductions</Th>
            <Th isNumeric>Salaire net</Th>
            <Th>Statut</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {payrollResults.map((result) => (
            <Tr key={result._id}>
              <Td fontWeight="medium" fontSize="1rem">
                {result.firstName} {result.lastName}
              </Td>

              <Td fontSize="0.9rem">{result.department}</Td>

              <Td isNumeric>{formatCurrency(result.baseSalary)}</Td>

              <Td isNumeric>{formatCurrency(result.totalEarnings)}</Td>

              <Td isNumeric color="red.500">
                {formatCurrency(result.totalDeductions)}
              </Td>

              <Td isNumeric fontWeight="bold" color="green.500">
                {formatCurrency(result.netSalary)}
              </Td>

              <Td>
                <Badge colorScheme={statusColor[result.status]}>
                  {result.status}
                </Badge>
              </Td>

              <Td>
                <HStack justify="center" spacing={1}>
                  <IconButton
                    aria-label="View payroll"
                    icon={<ViewIcon />}
                    size="xs"
                    variant="ghost"
                  />

                  <IconButton
                    aria-label="Print payslip"
                    icon={<LuPrinter />}
                    size="xs"
                    variant="ghost"
                  />

                  <IconButton
                    aria-label="Download PDF"
                    icon={<DownloadIcon />}
                    size="xs"
                    variant="ghost"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
