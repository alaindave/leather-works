import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Image,
  Spacer,
} from "@chakra-ui/react";
import type Employee from "../../common/types/Employee";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineChevronRight } from "react-icons/md";
import Attendance from "../../common/types/Attendance";
import { GoDotFill } from "react-icons/go";
import defaultAvatar from "../assets/default-avatar.jpeg";
import AttendanceTable from "../components/AttendanceRecordTable";
import { useEffect, useState } from "react";

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
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const statusColor = {
    PONCTUEL: "green",
    RETARD: "orange",
    ABSENT: "red",
    CONGÉ: "blue",
  } as const;

  useEffect(() => {
    async function getAttendanceHistory() {
      if (!employee?._id) return;
      const attendances = await window.electron.attendance.getByEmployee(
        employee?._id
      );
      setAttendances(attendances);
    }
    getAttendanceHistory();
  }, []);

  return (
    <Flex bg="#ffffff" width="100%" direction="column" alignItems="flex-start">
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
            Details de présence
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
          mt="1.5rem"
          minH="13rem"
          minW="25rem"
        >
          <Image
            src={photo_url || defaultAvatar}
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
        <Flex
          direction="column"
          bg="#F8F9FB"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          ml="3rem"
          mt="1.5rem"
          height="16rem"
          width="20rem"
        >
          <Text fontWeight="600" fontSize="1.1rem" ml="1rem" mt="0.5rem">
            Aujurdui-
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}
          </Text>
          <HStack
            mt="0.5rem"
            ml="1rem"
            bg={attendance?.status && statusColor[attendance?.status]}
            borderRadius="0.2rem"
            height="2rem"
            width="18rem"
          >
            <Box
              mt="1rem"
              color="#ffffff"
              fontSize="1.4rem"
              position="relative"
              bottom="0.5rem"
            >
              <GoDotFill />
            </Box>
            <Text mt="0.8rem" color="#ffffff" fontWeight="600">
              {attendance?.status === "PONCTUEL" ? (
                "A l'heure"
              ) : attendance?.status === "RETARD" ? (
                "En retard"
              ) : attendance?.status === "CONGÉ" ? (
                "En congé"
              ) : attendance?.status === "ABSENT" ? (
                "ABSENT"
              ) : (
                <Text color="red">Pas de pointage</Text>
              )}
            </Text>
          </HStack>
          <HStack mt="1.5rem">
            <Text ml="1rem" fontWeight="600">
              Entrée
            </Text>
            <Spacer />
            <Text
              mr="1rem"
              color={
                attendance?.clockIn && attendance.status == "PONCTUEL"
                  ? "green.800"
                  : "red.800"
              }
            >
              {attendance?.clockIn
                ? new Date(attendance?.clockIn).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "----"}
            </Text>
          </HStack>
          <HStack mt="0.5rem">
            <Text ml="1rem" fontWeight="600">
              Sortie
            </Text>
            <Spacer />
            <Text
              mr="1rem"
              color={attendance?.clockOut ? "purple.800" : "red.800"}
            >
              {attendance?.clockOut
                ? new Date(attendance?.clockOut).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "----"}
            </Text>
          </HStack>
        </Flex>
      </Flex>
      <Box ml="5rem" mt="3rem">
        <AttendanceTable records={attendances} />
      </Box>
    </Flex>
  );
};

export default EmployeeAttendanceReport;
