import {
  Box,
  Flex,
  HStack,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CiCalendar } from "react-icons/ci";
import {
  FaArrowDownLong,
  FaArrowLeftLong,
  FaArrowTrendUp,
  FaRegCalendarCheck,
} from "react-icons/fa6";
import { FcApproval } from "react-icons/fc";
import { IoWalletOutline } from "react-icons/io5";
import { LuInfo } from "react-icons/lu";
import {
  MdFreeCancellation,
  MdOutlineChevronRight,
  MdPayment,
} from "react-icons/md";
import { PiCreditCardLight } from "react-icons/pi";
import { FaDollarSign } from "react-icons/fa";
import { Link, useLocation, useParams } from "react-router-dom";
import Employee from "../../../common/types/Employee";
import { PayrollResult } from "../../../common/types/payroll/Payroll";
import { PayrollItem } from "../../../common/types/payroll/Payroll";
import defaultAvatar from "../../assets/default-avatar.jpeg";
import PayslipItemDisplay from "../../components/payroll/PayslipItemDisplay";
import { formatCurrency } from "../../util/currencyFormatter";
import { getPayrollPeriod } from "../../util/getPayrollPeriod";
import { usePayrollSettings } from "../../hooks/payroll_settings.hook";

type EmployeeState = {
  employee?: Employee;
};

type PhotoState = {
  photo_url?: string;
};

const EmployeePayslipDetails = () => {
  const { _id: employeeId, payslipId } = useParams();
  const location = useLocation();
  const { employee } = (location.state as EmployeeState) || {};
  const { photo_url } = (location.state as PhotoState) || "";
  const [payrollResults, setPayrollResults] = useState<PayrollResult | null>(
    {} as PayrollResult
  );
  const [payrollItems, setPayrollItems] = useState<PayrollItem[] | null>([]);
  console.log("Employee ID:", employeeId);
  console.log("PAYROLL ID", payslipId);
  const earnings = payrollItems?.filter((p) => p.type === "EARNING") ?? [];
  const deductions = payrollItems?.filter((p) => p.type === "DEDUCTION") ?? [];
  const totalEarnings = earnings.reduce(
    (total, item) => total + item.amount,
    0
  );
  const totalDeductions = deductions.reduce(
    (total, item) => total + item.amount,
    0
  );
  const payrollSettings = usePayrollSettings();
  const currency = payrollSettings?.currency ?? "BIF";
  const statusColor = {
    BROUILLON: "#e6b800",
    VERIFICATION: "#1a53ff",
    APPROUVÉ: "green",
    PAYÉ: "pink.600",
    ANNULÉ: "red",
  } as const;
  const statusBgColor = {
    BROUILLON: "yellow.200",
    VERIFICATION: "blue.200",
    APPROUVÉ: "green.200",
    PAYÉ: "pink.200",
    ANNULÉ: "red.200",
  } as const;

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = async () => {
    if (!employeeId || !payslipId) return;

    try {
      const payrollResults =
        await window.electron.payrollRun.getEmployeePayrollResults(
          employeeId,
          payslipId
        );
      console.log("FETCHED PAYROLL RESULTS", payrollResults);
      setPayrollResults(payrollResults);

      const payrollItems = await window.electron.payrollRun.getPayrollItems(
        payrollResults?._id!,
        employeeId
      );
      console.log("FETCHED PAYROLL ITEMS", payrollItems);
      setPayrollItems(payrollItems);
    } catch (e) {
      console.error("AN ERROR OCCURED WHILE FETCHING PAYROLL DATA", e);
    }
  };

  return (
    <Flex bg="#ffffff" width="100%" direction="column">
      {/* Header */}
      <HStack>
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employeeId}/payslips`,
          }}
          state={{ employee, photo_url }}
        >
          <Box
            position="absolute"
            top="1rem"
            ml="0.4rem"
            mr="2rem"
            p={2}
            border="1px solid #14376b"
            borderRadius="10px"
          >
            <FaArrowLeftLong color="black" />
          </Box>
        </Link>
        <Box ml="2rem">
          <HStack>
            <Text mt="0.8rem" ml="0.5rem" fontSize="1.4rem" fontWeight="600">
              Fiches de paye
            </Text>
            <Box>
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text mt="0.9rem" color="purple.600">
              Periode du{" "}
              {payrollResults?.month && payrollResults?.year
                ? getPayrollPeriod(payrollResults.month, payrollResults.year)
                : ""}
            </Text>{" "}
          </HStack>
        </Box>
      </HStack>
      {/* Bio */}
      <Flex>
        <Flex
          bg="#F8F9FB"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          mt="1.2rem"
          ml="1rem"
          minH="11rem"
          minW="30rem"
        >
          <Image
            src={photo_url || defaultAvatar}
            boxSize="8rem"
            borderRadius="full"
            objectFit="cover"
            mt="1rem"
            ml="0.8rem"
          />

          <VStack ml="1rem">
            <HStack mt="0.2rem" w="120px">
              <Text fontWeight="600" fontSize="1.2rem">
                {employee?.firstName}
              </Text>
              <Text fontWeight="600" fontSize="1.2rem">
                {employee?.lastName}
              </Text>
            </HStack>

            <HStack w="120px" position="relative" bottom="0.8rem">
              <Text color="gray.600" fontSize="1.1rem">
                Matricule:
              </Text>
              <Text color="gray.800" fontSize="1rem">
                {employee?.matricule}
              </Text>
            </HStack>
            <HStack w="120px" position="relative" bottom="1.7rem">
              <Text color="gray.600" fontSize="1.1rem">
                Poste:
              </Text>
              <Text color="gray.800" fontSize="1rem">
                {employee?.role}
              </Text>
            </HStack>
            <HStack w="120px" position="relative" bottom="2.5rem">
              <Text color="gray.600" fontSize="1.1rem">
                Departement:
              </Text>
              <Text color="gray.800" fontSize="1rem">
                {employee?.department}
              </Text>
            </HStack>
          </VStack>
        </Flex>
        {/* Payroll info */}
        <HStack
          bg="#F8F9FB"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          mt="1rem"
          ml="0.5rem"
          height="13rem"
          width="44vw"
        >
          {/* Periode de paie */}
          <HStack mt="0.4rem" ml="1rem">
            <Box
              borderRadius="0.5rem"
              padding="0.3rem"
              bg="purple.100"
              position="relative"
              bottom="0.7rem"
              mr="1rem"
            >
              <CiCalendar size="2rem" color="purple.800" />
            </Box>
            <Box>
              <Text color="gray.500" whiteSpace="nowrap">
                Periode de paie
              </Text>
              <Text
                position="relative"
                bottom="1rem"
                fontWeight="600"
                whiteSpace="nowrap"
              >
                {payrollResults?.month && payrollResults?.year
                  ? getPayrollPeriod(payrollResults.month, payrollResults.year)
                  : ""}
              </Text>
            </Box>
          </HStack>
          {/* Payroll status */}
          <HStack mt="0.4rem" ml="1rem">
            <Box
              borderRadius="0.5rem"
              padding="0.3rem"
              bg={
                payrollResults?.status && statusBgColor[payrollResults?.status]
              }
              fontSize="1.8rem"
              position="relative"
              bottom="0.7rem"
              mr="1rem"
            >
              <LuInfo />
            </Box>
            <Box>
              <Text color="gray.500">Statut</Text>
              <Text
                color={
                  payrollResults?.status && statusColor[payrollResults?.status]
                }
                position="relative"
                bottom="1rem"
                fontWeight="700"
              >
                {payrollResults?.status && payrollResults.status}
              </Text>
            </Box>
          </HStack>
          {/* Creation date */}

          {payrollResults?.status === "BROUILLON" ? (
            <HStack mt="0.4rem" ml="1rem">
              <Box
                borderRadius="0.5rem"
                padding="0.3rem"
                bg="red.300"
                fontSize="1.8rem"
                position="relative"
                bottom="0.7rem"
                mr="1rem"
              >
                <MdFreeCancellation />
              </Box>
              <Box>
                <Text color="gray.500">Date de creation</Text>
                <HStack>
                  <Text position="relative" bottom="1rem" fontWeight="600">
                    {payrollResults?.createdAt &&
                      new Date(payrollResults?.createdAt).toLocaleDateString(
                        "fr-FR"
                      )}
                  </Text>
                  <Text position="relative" right="0.1rem" bottom="1rem">
                    {payrollResults?.createdAt &&
                      new Date(payrollResults?.createdAt).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          ) : null}

          {/* Cancellation date */}
          {payrollResults?.status === "ANNULÉ" ? (
            <HStack mt="0.4rem" ml="1rem">
              <Box
                borderRadius="0.5rem"
                padding="0.3rem"
                bg="red.300"
                fontSize="1.8rem"
                position="relative"
                bottom="0.7rem"
                mr="1rem"
              >
                <MdFreeCancellation />
              </Box>
              <Box>
                <Text color="gray.500">Date d'annulation</Text>
                <Text position="relative" bottom="1rem" fontWeight="600">
                  {payrollResults?.cancelledAt &&
                    new Date(payrollResults?.cancelledAt).toLocaleDateString(
                      "fr-FR"
                    )}
                </Text>
              </Box>
            </HStack>
          ) : null}
          {/* Date de verification */}
          {payrollResults?.status === "VERIFICATION" ? (
            <HStack mt="0.4rem" ml="1rem">
              <Box
                borderRadius="0.5rem"
                padding="0.3rem"
                bg="blue.200"
                fontSize="1.8rem"
                position="relative"
                bottom="0.7rem"
                mr="1rem"
              >
                <FaRegCalendarCheck color="purple.500" />
              </Box>
              <Box>
                <Text
                  position="relative"
                  bottom="0.1rem"
                  color="gray.500"
                  whiteSpace="normal"
                >
                  En verification
                </Text>
                <HStack>
                  <Text
                    position="relative"
                    right="1rem"
                    bottom="1rem"
                    fontWeight="600"
                  >
                    {payrollResults?.verifiedAt &&
                      new Date(payrollResults?.verifiedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                  </Text>
                  <Text position="relative" bottom="1rem" right="1rem">
                    {payrollResults?.verifiedAt &&
                      new Date(payrollResults?.verifiedAt).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          ) : null}
          {/* Approval date  */}
          {payrollResults?.status === "APPROUVÉ" ? (
            <HStack mt="0.4rem" ml="1rem">
              <Box
                borderRadius="0.5rem"
                padding="0.3rem"
                bg="blue.100"
                fontSize="1.8rem"
                position="relative"
                bottom="1rem"
                mr="1rem"
              >
                <FcApproval color="blue.500" />
              </Box>
              <Box position="relative" bottom="0.1rem">
                <Text color="gray.500">Date d'approbation</Text>
                <HStack>
                  <Text position="relative" bottom="1rem" fontWeight="600">
                    {payrollResults?.approvedAt &&
                      new Date(payrollResults?.approvedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                  </Text>
                  <Text position="relative" bottom="1rem">
                    {payrollResults?.approvedAt &&
                      new Date(payrollResults?.approvedAt).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          ) : null}
          {/* Payment date  */}
          {payrollResults?.status === "PAYÉ" ? (
            <HStack mt="0.4rem" ml="1rem">
              <Box
                borderRadius="0.5rem"
                padding="0.3rem"
                bg="green.100"
                fontSize="1.8rem"
                position="relative"
                bottom="0.7rem"
                mr="1rem"
              >
                <MdPayment color="green.500" />
              </Box>
              <Box>
                <Text color="gray.500">Date de paiement</Text>
                <HStack>
                  <Text position="relative" bottom="1rem" fontWeight="600">
                    {payrollResults?.paidAt &&
                      new Date(payrollResults?.paidAt).toLocaleDateString(
                        "fr-FR"
                      )}
                  </Text>
                  <Text position="relative" bottom="1rem">
                    {payrollResults?.paidAt &&
                      new Date(payrollResults?.paidAt).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          ) : null}
        </HStack>
      </Flex>
      {/* Salary breakdown */}
      <HStack
        bg="#F8F9FB"
        border="1px solid"
        borderColor="#D1D9E0"
        borderRadius="8px"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        height="15vh"
        width="78vw"
        mt="0.5rem"
        ml="1rem"
        gap={10}
        padding={10}
      >
        <PayslipItemDisplay
          itemName="Salaire de base"
          amount={payrollResults?.baseSalary ?? 0}
          icon={IoWalletOutline}
          color="green"
        />
        <PayslipItemDisplay
          itemName="Remunerations"
          amount={payrollResults?.totalEarnings ?? 0}
          icon={FaArrowTrendUp}
          color="blue"
        />
        <PayslipItemDisplay
          itemName="Salaire brut"
          amount={payrollResults?.grossSalary ?? 0}
          icon={FaDollarSign}
          color="purple"
        />
        <PayslipItemDisplay
          itemName="Deductions"
          amount={payrollResults?.totalDeductions ?? 0}
          icon={FaArrowDownLong}
          color="red"
        />
        <PayslipItemDisplay
          itemName="Salaire net"
          amount={payrollResults?.netSalary ?? 0}
          icon={PiCreditCardLight}
          color="purple"
        />
      </HStack>
      {/* Earnings and deductions breakdown */}
      <HStack
        ml="1rem"
        mt="0.5rem"
        spacing="1rem"
        width="calc(100% - 4rem)"
        height="400px"
        align="stretch"
      >
        {/* Earnings */}
        <Box
          width="40vw"
          height="43vh"
          border="1px solid"
          bg="#ffffff"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Fixed Header */}
          <Table variant="simple" sx={{ tableLayout: "fixed" }} flexShrink={0}>
            <Thead>
              <Tr>
                <Th color="purple.600" fontSize="0.8rem">
                  Rémunérations
                </Th>
                <Th isNumeric>Montant</Th>
              </Tr>
            </Thead>
          </Table>

          {/* ONLY THIS SECTION SCROLLS */}
          <Box
            flex="1"
            overflowY="auto"
            overflowX="hidden"
            sx={{
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "10px",
              },
            }}
          >
            <Table
              variant="simple"
              sx={{
                tableLayout: "fixed",
              }}
            >
              <Tbody>
                {earnings.map((item) => (
                  <Tr key={item.componentId}>
                    <Td>{item.displayName}</Td>
                    <Td isNumeric>{formatCurrency(item.amount, currency)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Fixed Footer */}
          <Table variant="simple" sx={{ tableLayout: "fixed" }} flexShrink={0}>
            <Tfoot>
              <Tr>
                <Th
                  fontSize="0.9rem"
                  bg="purple.100"
                  color="purple.800"
                  fontWeight="800"
                >
                  Total
                </Th>
                <Th
                  fontSize="0.9rem"
                  bg="purple.100"
                  color="purple.800"
                  fontWeight="800"
                  isNumeric
                >
                  {formatCurrency(totalEarnings, currency)}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </Box>
        {/* Deductions */}
        <Box
          width="40vw"
          height="43vh"
          border="1px solid"
          bg="#ffffff"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Fixed Header */}
          <Table variant="simple" sx={{ tableLayout: "fixed" }} flexShrink={0}>
            <Thead>
              <Tr>
                <Th color="purple.600" fontSize="0.8rem">
                  Déductions
                </Th>
                <Th isNumeric>Montant</Th>
              </Tr>
            </Thead>
          </Table>

          {/* ONLY THIS SECTION SCROLLS */}
          <Box
            flex="1"
            overflowY="auto"
            overflowX="hidden"
            sx={{
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "10px",
              },
            }}
          >
            <Table
              variant="simple"
              sx={{
                tableLayout: "fixed",
              }}
            >
              <Tbody>
                {deductions.map((item) => (
                  <Tr key={item.componentId}>
                    <Td>{item.displayName}</Td>
                    <Td isNumeric>{formatCurrency(item.amount, currency)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Fixed Footer */}
          <Table variant="simple" sx={{ tableLayout: "fixed" }} flexShrink={0}>
            <Tfoot>
              <Tr>
                <Th
                  fontSize="0.9rem"
                  bg="red.100"
                  color="red.800"
                  fontWeight="800"
                >
                  Total
                </Th>
                <Th
                  fontSize="0.9rem"
                  bg="red.100"
                  color="red.800"
                  fontWeight="800"
                  isNumeric
                >
                  {formatCurrency(totalDeductions, currency)}
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </Box>
      </HStack>
    </Flex>
  );
};

export default EmployeePayslipDetails;
