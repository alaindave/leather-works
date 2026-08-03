import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Image,
  Spacer,
  Button,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import defaultAvatar from "../assets/default-avatar.jpeg";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { IoSync } from "react-icons/io5";
import { GiConfirmed } from "react-icons/gi";
import useAdminUser from "../../../store/auth.store";
import {
  PayrollResultRecord,
  PayrollRun,
} from "../../../common/types/payroll/Payroll";
import { getMonthName } from "../../util/getMonthName";
import PayrollResultsTable from "../../components/PayrollResultsTable";
import { getPayrollPeriod } from "../../util/getPayrollPeriod";
import PayrollDashboard from "../../components/PayrollDashboard";
import User from "../../../common/types/User";
import { formatTime } from "../../util/timeFormatter";
import DeletionDialog from "../../components/DeletionDialog";
import { aborted } from "node:util";
// import AttendanceTable from "../components/AttendanceRecordTable";

const PayrollDetailsPage = () => {
  const { _id } = useParams();
  const adminUser: Omit<User, "password" | "notes"> = useAdminUser(
    (store) => store.adminUser
  );
  const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(
    {} as PayrollRun
  );
  const [payrollResults, setPayrollResults] = useState<PayrollResultRecord[]>(
    []
  );

  const statusColor = {
    BROUILLON: "#e6b800",
    VERIFICATION: "#1a53ff",
    APPROUVÉ: "green",
    PAYÉ: "purple",
    ANNULÉ: "red",
  } as const;
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();

  useEffect(() => {
    loadPayrollRun();
    loadPayrollResuts();
  }, []);

  const loadPayrollRun = async () => {
    if (!_id) return;
    const payrollRun = await window.electron.payrollRun.getPayrollRunById(_id);
    setPayrollRun(payrollRun);
  };

  const loadPayrollResuts = async () => {
    if (!_id) return;
    try {
      const payrollResults = await window.electron.payrollRun.getPayrollResults(
        _id
      );
      setPayrollResults(payrollResults);
      console.log("FETCHED PAYROLL RESULTS", payrollResults);
    } catch (e) {
      console.error("AN ERROR OCCURED WHILE FETCHING PAYROLL RESULTS", e);
    }
  };

  const handlePayrollCancellation = async () => {
    onConfirmationClose();
    if (!_id) return;
    try {
      const results = await window.electron.payrollRun.cancelPayroll(
        _id,
        adminUser
      );
      console.log("CANCELLATION RESULTS", results);
      loadPayrollRun();
      loadPayrollResuts();
    } catch (e) {
      console.error("AN ERROR OCCURED DURING CANCELLATION", e);
    }
  };

  const verify = async () => {
    if (!_id) return;
    try {
      const results = await window.electron.payrollRun.submitForVerification(
        _id,
        adminUser
      );
      console.log("VERIFICATION RESULTS", results);
      loadPayrollRun();
      loadPayrollResuts();
    } catch (e) {
      console.error("AN ERROR OCCURED WHILE SUBMITTING FOR VERIFICATION", e);
    }
  };

  return (
    <Flex
      bg="#ffffff"
      width="100%"
      height="93vh"
      direction="column"
      alignItems="flex-start"
      justify="space-between"
    >
      {/* Header */}
      <HStack>
        <Link
          to={{
            pathname: `/employees_admin/payroll/`,
          }}
        >
          <Box
            ml="0.5rem"
            mb="2rem"
            p={2}
            border="1px solid #14376b"
            borderRadius="10px"
          >
            <FaArrowLeftLong color="black" />
          </Box>
        </Link>
        <Box>
          <HStack>
            <Text mt="0.8rem" ml="0.5rem" fontSize="1.4rem" fontWeight="600">
              Fiches de paye
            </Text>
            <Box>
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text mt="0.9rem" color="gray.600">
              Periode du{" "}
              {payrollRun?.month && payrollRun?.year
                ? getPayrollPeriod(payrollRun.month, payrollRun.year)
                : ""}
            </Text>{" "}
            {payrollRun?.status === "ANNULÉ" || (
              <HStack position="absolute" right="1rem">
                <Button
                  onClick={onConfirmationOpen}
                  width="10rem"
                  bg="#ffffff"
                  border="1px solid gray"
                >
                  <Box color="red.400" fontSize="1.2rem" mr="0.7rem">
                    <MdOutlineCancel />
                  </Box>
                  Annuler
                </Button>
                {payrollRun?.status === "VERIFICATION" ? (
                  <Button width="10rem" bg="#ffffff" border="1px solid gray">
                    <Box color="green.600" fontSize="1.2rem" mr="0.7rem">
                      <GiConfirmed />
                    </Box>
                    Approuver
                  </Button>
                ) : (
                  <Button
                    onClick={verify}
                    width="10rem"
                    bg="#ffffff"
                    border="1px solid gray"
                  >
                    <Box color="green.600" fontSize="1.2rem" mr="0.7rem">
                      <GiConfirmed />
                    </Box>
                    Verifier
                  </Button>
                )}
              </HStack>
            )}
          </HStack>
          <Text
            position="relative"
            left="0.5rem"
            bottom="1rem"
            color="gray.500"
          >
            Crée le{" "}
            {payrollRun?.createdAt &&
              new Date(payrollRun?.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            {"  "}à {payrollRun?.createdAt && formatTime(payrollRun?.createdAt)}{" "}
            {"  "}
            par {payrollRun?.generatedByName}
            {/* Cancelled payroll run */}
          </Text>
          {payrollRun?.status === "ANNULÉ" ? (
            <Text
              position="relative"
              left="0.5rem"
              bottom="2rem"
              color="gray.500"
            >
              Annulé le{" "}
              {payrollRun?.cancelledAt &&
                new Date(payrollRun?.cancelledAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              {"  "}à{" "}
              {payrollRun?.cancelledAt && formatTime(payrollRun?.cancelledAt)}{" "}
              {"  "}
              par {payrollRun?.cancelledByName}
            </Text>
          ) : null}
        </Box>
        {payrollRun?.status && payrollRun?.status === "ANNULÉ" ? (
          <Badge
            position="absolute"
            top="1rem"
            right="2rem"
            bg="#E53E3E"
            color="gray.200"
            fontSize="1rem"
          >
            {payrollRun.status}
          </Badge>
        ) : (
          <Badge
            position="relative"
            top="2rem"
            left="2rem"
            bg={payrollRun?.status && statusColor[payrollRun.status]}
            color="gray.200"
            fontSize="1rem"
          >
            {payrollRun?.status}
          </Badge>
        )}
      </HStack>
      {/* Payroll dashboard */}
      {payrollRun?.employeeCount &&
      payrollRun?.totalEarnings &&
      payrollRun?.totalDeductions ? (
        <PayrollDashboard
          employeeCount={payrollRun?.employeeCount}
          totalBasicSalary={payrollRun.totalBasicSalary}
          totalEarnings={payrollRun?.totalEarnings}
          totalDeductions={payrollRun?.totalDeductions}
          totalNetSalary={payrollRun.totalNetSalary}
        />
      ) : null}
      {/* Payroll results table */}
      <Box ml="0.3rem" mb="1rem">
        <PayrollResultsTable payrollResults={payrollResults} />
      </Box>
      <DeletionDialog
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        onConfirmation={handlePayrollCancellation}
        header="Annuler"
        body="Etes vous sur de vouloir annuler cette fiche de paye?"
      />
    </Flex>
  );
};

export default PayrollDetailsPage;
