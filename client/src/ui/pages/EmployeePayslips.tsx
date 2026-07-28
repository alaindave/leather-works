import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdOutlineChevronRight } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import Employee from "../../shared/types/Employee";

type EmployeeState = {
  employee?: Employee;
};

type PhotoState = {
  photo_url?: string;
};

const EmployeePayrollReport = () => {
  const location = useLocation();
  const { employee } = (location.state as EmployeeState) || {};
  const { photo_url } = (location.state as PhotoState) || "";
  // const [payrollProfiles, setPayrollProfiles] = useState<
  //   PayrollEmployeeProfile[]
  // >([]);

  // useEffect(() => {
  //   getPayrollHistory();
  // }, []);

  // async function getPayrollHistory() {
  //   if (!employee?._id) return;
  //   const payroll_profiles =
  //     await window.electron.payrollEmployeeProfiles.getByEmployee(
  //       employee?._id
  //     );
  //   console.log("PAYROLL PROFILES FETCHED:", payroll_profiles);
  //   setPayrollProfiles(payroll_profiles);
  // }

  return (
    <Flex direction="column" bg="#ffffff" width="100%" alignItems="flex-start">
      {/* Header */}
      <Flex justify="space-between" width="100%">
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
                Fiches de paye
              </Text>
            </HStack>
          </Box>
        </HStack>
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employee?._id}/payslips/settings`,
          }}
          state={{ employee, photo_url }}
        >
          <Box position="absolute" top="1rem " right="1.5rem">
            <IoSettings fontSize="1.7rem" />
          </Box>
        </Link>
      </Flex>
      <Text>Payroll history goes here</Text>
    </Flex>
  );
};

export default EmployeePayrollReport;
