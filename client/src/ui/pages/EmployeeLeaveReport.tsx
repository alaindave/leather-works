import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LeaveHistoryTable from "../components/LeaveHistoryTable";
import { Link, useLocation } from "react-router-dom";
import Employee from "../../shared/types/Employee";
import Leave from "../../shared/types/Leave";
import { MdOutlineChevronRight } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";

type EmployeeState = {
  employee?: Employee;
};

type PhotoState = {
  photo_url?: string;
};

const EmployeeLeaveReport = () => {
  const location = useLocation();
  const { employee } = (location.state as EmployeeState) || {};
  const { photo_url } = (location.state as PhotoState) || "";
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    async function getLeaveHistory() {
      if (!employee?._id) return;
      const leaves = await window.electron.leave.getLeaveByEmployeeId(
        employee?._id
      );
      console.log("Leave history fetched:", leaves);
      setLeaves(leaves);
    }
    getLeaveHistory();
  }, []);
  return (
    <Flex direction="column" bg="#ffffff" width="100%" alignItems="flex-start">
      {/* Header */}
      <HStack mt="1.4rem">
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employee?._id}`,
          }}
          state={{ photo_url }}
        >
          <Box
            ml="0.8rem"
            mb="2rem"
            p={2}
            border="1px solid #14376b"
            borderRadius="10px"
          >
            <FaArrowLeftLong color="black" />
          </Box>
        </Link>
        <Box mt="0.5rem">
          <HStack ml="0.3rem" position="relative" bottom="1rem">
            <Text fontSize="1.1rem" fontWeight="500">
              Employés
            </Text>
            <Box position="relative" bottom="0.3rem">
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text fontSize="1.1rem" fontWeight="500">
              {" "}
              {employee?.firstName} {employee?.lastName}
            </Text>
            <Box position="relative" bottom="0.3rem">
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text fontSize="1.1rem" fontWeight="500">
              Congés
            </Text>
          </HStack>
        </Box>
      </HStack>
      {leaves.length != 0 ? (
        <LeaveHistoryTable leaves={leaves} />
      ) : (
        <Text
          fontSize="1.7rem"
          color="gray.800"
          position="relative"
          left="20rem"
          top="15rem"
        >
          Pas de congés à afficher
        </Text>
      )}
    </Flex>
  );
};

export default EmployeeLeaveReport;
