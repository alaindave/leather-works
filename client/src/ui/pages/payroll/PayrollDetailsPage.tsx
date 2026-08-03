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
} from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import defaultAvatar from "../assets/default-avatar.jpeg";
import { CiCalendarDate } from "react-icons/ci";

import {
  PayrollResultRecord,
  PayrollRun,
} from "../../../common/types/payroll/Payroll";
import { getMonthName } from "../../util/getMonthName";
import PayrollResultsTable from "../../components/PayrollResultsTable";
import { getPayrollPeriod } from "../../util/getPayrollPeriod";
import PayrollDashboard from "../../components/PayrollDashboard";
// import AttendanceTable from "../components/AttendanceRecordTable";

const PayrollDetailsPage = () => {
  const { _id } = useParams();
  const [payrollRun, setPayrollRun] = useState<PayrollRun | null>(
    {} as PayrollRun
  );
  const [payrollResults, setPayrollResults] = useState<PayrollResultRecord[]>(
    []
  );

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
    const payrollResults = await window.electron.payrollRun.getPayrollResults(
      _id
    );
    setPayrollResults(payrollResults);
    console.log("FETCHED PAYROLL RESULTS", payrollResults);
  };

  console.log("payroll run test", payrollRun);

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
            mt="0.5rem"
            ml="0.5rem"
            mb="2rem"
            p={2}
            border="1px solid #14376b"
            borderRadius="10px"
          >
            <FaArrowLeftLong color="black" />
          </Box>
        </Link>
        <Box mt="0.5rem">
          <HStack>
            <Text mt="0.8rem" ml="0.5rem" fontSize="1.4rem" fontWeight="600">
              Fiches de paye
            </Text>
            <Box>
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text mt="0.9rem">
              {payrollRun?.month && payrollRun?.year
                ? getMonthName(payrollRun.month)
                : " "}{" "}
              {payrollRun?.year}
            </Text>
          </HStack>
          <HStack ml="0.6rem" color="gray.500">
            <Box position="relative" bottom="0.5rem" fontSize="1.2rem">
              <CiCalendarDate />
            </Box>
            <Text>
              {payrollRun?.month && payrollRun?.year
                ? getPayrollPeriod(payrollRun.month, payrollRun.year)
                : ""}
            </Text>{" "}
            <Box mb="0.9rem">
              <GoDotFill fontSize="1.3rem" />
            </Box>
            <Text>
              Crée le{" "}
              {payrollRun?.createdAt &&
                new Date(payrollRun?.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </Text>
            <Box mb="0.9rem">
              <GoDotFill fontSize="1.3rem" />
            </Box>
            <Text>Crée par {payrollRun?.generatedByName}</Text>
          </HStack>
        </Box>
      </HStack>
      {/* Payroll dashboard */}
      {payrollRun?.employeeCount &&
      payrollRun?.totalEarnings &&
      payrollRun?.totalDeductions ? (
        <PayrollDashboard
          employeeCount={payrollRun?.employeeCount}
          totalEarnings={payrollRun?.totalEarnings}
          totalDeductions={payrollRun?.totalDeductions}
        />
      ) : null}
      {/* Payroll results table */}
      <Box ml="1rem" mb="1rem">
        <PayrollResultsTable payrollResults={payrollResults} />
      </Box>
    </Flex>
  );
};

export default PayrollDetailsPage;
