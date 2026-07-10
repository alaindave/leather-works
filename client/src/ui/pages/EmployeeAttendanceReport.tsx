import { Link, useLocation } from "react-router-dom";
import { Box, Flex, HStack, Text, VStack, Image } from "@chakra-ui/react";
import type Employee from "../../shared/types/Employee";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import Attendance from "../../shared/types/Attendance";

type EmployeeState = {
  employee?: Employee;
};

type PhotoState = {
  photo_url?: string;
};

type AttendanceState = {
  attendance?: Attendance;
};

const EmployeeAttendanceReport = () => {
  const location = useLocation();
  const { employee } = (location.state as EmployeeState) || {};
  const { photo_url } = (location.state as PhotoState) || "";
  const { attendance } = (location.state as AttendanceState) || {};

  return (
    <Flex
      bg="#ffffff"
      width="100%"
      mt="0.5rem"
      direction="column"
      alignItems="flex-start"
    >
      {/* Header */}
      <HStack mt="0.6rem">
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employee?._id}`,
          }}
          state={{ photo_url }}
        >
          <Box
            ml="1rem"
            mb="2rem"
            p={2}
            border="1px solid #14376b"
            borderRadius="10px"
          >
            <FaArrowLeftLong color="black" />
          </Box>
        </Link>
        <Box mt="0.3rem">
          <Text ml="1rem" fontSize="1.4rem" fontWeight="600">
            Details de la présence
          </Text>
          <HStack ml="1rem" position="relative" bottom="1rem">
            <Text>Employés</Text>
            <Box position="relative" bottom="0.3rem">
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text>
              {" "}
              {employee?.firstName} {employee?.lastName}
            </Text>
            <Box position="relative" bottom="0.3rem">
              <MdOutlineChevronRight fontSize="1.3rem" />
            </Box>
            <Text>Présence</Text>
          </HStack>
        </Box>
      </HStack>
      {/* Employee bio */}
      <Flex>
        <Flex
          bg="#F8F9FB"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          ml="5rem"
          height="13rem"
          width="30rem"
        >
          <Image
            src={photo_url}
            boxSize="8rem"
            borderRadius="full"
            objectFit="cover"
            mt="1rem"
            ml="0.5rem"
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

            <HStack w="120px">
              <Text color="gray.600" fontSize="1.1rem">
                Matricule:
              </Text>
              <Text color="gray.800" fontSize="1rem">
                {employee?.matricule}
              </Text>
            </HStack>
            <HStack w="120px">
              <Text color="gray.600" fontSize="1.1rem">
                Poste:
              </Text>
              <Text color="gray.800" fontSize="1rem">
                {employee?.role}
              </Text>
            </HStack>
            <HStack w="120px">
              <Text color="gray.600" fontSize="1.1rem">
                Departement:
              </Text>
              <Text color="gray.800" fontSize="1rem">
                {employee?.department}
              </Text>
            </HStack>
          </VStack>
        </Flex>
        <Box
          bg="#F8F9FB"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          ml="2.5rem"
          height="13rem"
          width="22rem"
        >
          <Text fontWeight="600" fontSize="1.1rem" ml="1rem" mt="0.5rem">
            Aujurdui-{new Date().toLocaleDateString("fr-FR")}
          </Text>
          <Box>
            <Text>{attendance?.status}</Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default EmployeeAttendanceReport;
