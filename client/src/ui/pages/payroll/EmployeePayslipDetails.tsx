import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import { PayrollResultRecord } from "../../../common/types/payroll/Payroll";
import { getPayrollPeriod } from "../../util/getPayrollPeriod";
import PayrollItem from "../../../common/types/payroll/PayrollItem";

const EmployeePayslipDetails = () => {
  const { _id: employeeId, payslipId } = useParams();
  const [payrollResults, setPayrollResults] =
    useState<PayrollResultRecord | null>({} as PayrollResultRecord);
  const [payrollItems, setPayrollItems] = useState<PayrollItem[] | null>([]);
  console.log("Employee ID:", employeeId);
  console.log("PAYROLL ID", payslipId);

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
            position="absolute"
            top="1rem"
            ml="0.2rem"
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
            <Text mt="0.9rem" color="gray.600">
              Periode du{" "}
              {payrollResults?.month && payrollResults?.year
                ? getPayrollPeriod(payrollResults.month, payrollResults.year)
                : ""}
            </Text>{" "}
          </HStack>
        </Box>
      </HStack>
    </Flex>
  );
};

export default EmployeePayslipDetails;
