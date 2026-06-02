import {
  Badge,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import { CiClock2 } from "react-icons/ci";
import { GiClockwork } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import type Attendance from "../../shared/types/Attendance";
import type Employee from "../../shared/types/Employee";
import source from "../assets/employee_photos/Jeanne.jpeg";

interface Props {
  employee: Employee;
}

const EmployeeCard = ({ employee }: Props) => {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [_clockIn, setClockIn] = useState("");
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [showEditable, setShowEditable] = useState(false);
  const [displayClock, setDisplayClock] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get<Attendance>(`${API_URL}/attendances/${employee._id}`)
      .then((res) => setAttendance(res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const flashLate = keyframes`
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.2; transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
  `;

  const handleToggleClockInEdit = () => {
    if (isClockingIn) {
      setClockIn("");
      setShowEditable(false);
      setIsClockingIn(false);
      return;
    }

    const now = new Date();
    setClockIn(
      `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`
    );

    setShowEditable(true);
    setIsClockingIn(true);
  };

  const handleClockInSubmit = async () => {
    const [hours, minutes] = _clockIn.split(":").map(Number);
    const clockIn = new Date();
    clockIn.setHours(hours, minutes, 0, 0);

    const res = await axios.post(`${API_URL}/attendances/${employee._id}`, {
      clockIn,
    });

    setAttendance(res.data);
    setDisplayClock(false);
    setShowEditable(false);
  };

  return (
    <HStack
      bg="#0A1F57"
      w="70vw"
      h="5.5rem"
      p={3}
      borderRadius="10px"
      spacing={6}
    >
      {/* Avatar */}
      <Link to={`/employees_admin/employees_list/${employee._id}`}>
        <Image src={source} boxSize="65px" borderRadius="full" />
      </Link>

      {/* Name + role */}
      <Box flex="1">
        <Text color="gray.200" fontSize="22px" fontWeight="500" mt="1.5rem">
          {employee.firstName} {employee.lastName}
        </Text>

        <HStack
          spacing={2}
          fontSize="1rem"
          color="gray.400"
          position="relative"
          bottom="1.1rem"
        >
          <Text>{employee.role}</Text>
          <Box mb="0.9rem">
            <GoDotFill color="green" />
          </Box>

          <Text color="#8ECDF8">{employee.department}</Text>
        </HStack>
      </Box>

      {/* Attendance info */}
      <HStack spacing={5} position="relative" bottom="0.7rem">
        {attendance && (
          <>
            <Badge
              bg={attendance.status === "ponctuel" ? "#123D2B" : "#4A1F2D"}
              color={attendance.status === "ponctuel" ? "#5EF29B" : "#FF6B81"}
              animation={
                attendance.status !== "ponctuel"
                  ? `${flashLate} 1.4s ease-in-out 3`
                  : undefined
              }
              fontSize="0.8rem"
            >
              {attendance.status === "ponctuel" ? "A l'heure" : "En retard"}
            </Badge>

            <CiClock2 color="#F2B705" size={22} />

            <Text
              color="gray.300"
              position="relative"
              top="0.5rem"
              fontSize="1.1rem"
            >
              {new Date(attendance.clockIn)
                .getHours()
                .toString()
                .padStart(2, "0")}
              :
              {new Date(attendance.clockIn)
                .getMinutes()
                .toString()
                .padStart(2, "0")}
            </Text>
          </>
        )}

        {/* Clock-in button */}
        {!attendance && displayClock && (
          <Button
            bg="transparent"
            _hover={{ bg: "transparent" }}
            color="#F2B705"
            onClick={handleToggleClockInEdit}
          >
            <GiClockwork size="2rem" />
          </Button>
        )}

        {/* Editable clock-in */}
        {showEditable && (
          <Editable
            value={_clockIn}
            onChange={setClockIn}
            onSubmit={handleClockInSubmit}
            submitOnBlur={false}
          >
            <EditablePreview
              color="yellow"
              fontSize="18px"
              sx={{
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.3 },
                  "100%": { opacity: 1 },
                },
              }}
            />
            <EditableInput color="white" />
          </Editable>
        )}
      </HStack>
    </HStack>
  );
};

export default EmployeeCard;
