import {
  Avatar,
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
import { CiClock2 } from "react-icons/ci";
import { GiClockwork } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";
import type Attendance from "../../shared/types/Attendance";
import type Employee from "../../shared/types/Employee";
import source from "../assets/employee_photos/Jeanne.jpeg";
// @ts-ignore
import { useEffect, useState } from "react";
import "../styles/App.css";
import AddClockInNotesPopover from "./AddClockInNotesPopover";

interface Props {
  employee: Employee;
}

function formatClockInTime(input: string): string | null {
  const cleaned = input.trim().replace(/[hH]/g, ":");

  // Handle 0830
  if (/^\d{4}$/.test(cleaned)) {
    const hours = Number(cleaned.slice(0, 2));
    const minutes = Number(cleaned.slice(2, 4));

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours > 23 ||
      minutes > 59
    ) {
      return null;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  // Handle 08:30, 8:30, 08H30, 08h30
  const match = cleaned.match(/^(\d{1,2}):(\d{1,2})$/);

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours > 23 ||
    minutes > 59
  ) {
    return null;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

const EmployeeCard = ({ employee }: Props) => {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [_clockIn, setClockIn] = useState("");
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [displayClock, setDisplayClock] = useState(true);
  const [showEditable, setShowEditable] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  useEffect(() => {
    window.electron.attendance
      .getAttendanceRecord(employee._id, new Date().toISOString().split("T")[0])
      .then((attendance) => {
        setAttendance(attendance);
        console.log("Attendance fetched: ", attendance);
      })

      .catch((error) => {
        console.error("An error occured while fetching attendance: ", error);
      })
      .finally(() => setLoadingAttendance(false));
  }, []);

  const handleToggleClockInEdit = () => {
    setErrorMessage(false);
    if (isClockingIn) {
      setClockIn("");
      setShowEditable(false);
      setIsClockingIn(false);
      return;
    }
    const clockIn = new Date();
    const _clockIn = `${String(clockIn.getHours()).padStart(2, "0")}:${String(
      clockIn.getMinutes()
    ).padStart(2, "0")} `;
    setClockIn(_clockIn);
    setShowEditable(true);
    setIsClockingIn(true);
  };

  const handleClockInSubmit = async () => {
    const formatted = formatClockInTime(_clockIn);
    if (!formatted) {
      setErrorMessage(true);
      return;
    }
    const [hours, minutes] = formatted.split(":").map(Number);
    const clockIn = new Date();
    clockIn.setHours(hours, minutes, 0, 0);
    console.log("clock In to submit", clockIn.toISOString());
    await window.electron.attendance
      .create(employee._id, clockIn.toISOString())
      .then((attendance) => {
        console.log("Attendance creation success:", attendance);
        setAttendance(attendance);
        setDisplayClock(false);
        setShowEditable(false);
      })
      .catch((error: Error) => console.error(error));
  };

  const handleLateNotes = async (
    lateNotes: string | undefined
  ): Promise<boolean> => {
    try {
      if (!attendance?._id) {
        throw new Error("Attendance record not found");
      }

      const updatedAttendance = await window.electron.attendance.update(
        attendance._id,
        { lateNotes }
      );
      setAttendance(updatedAttendance);
      return true;
    } catch (error) {
      console.error("An error occured while submitting late notes: ", error);
      return false;
    }
  };

  const flashLate = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.2;
    transform: scale(1.08);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

  return (
    <HStack
      bg="#ffffff"
      height="80px"
      w="77.8vw"
      padding="10px"
      position="relative"
      right="20px"
      spacing={4}
      borderRadius="8px"
    >
      <Box ml="1.3rem">
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employee._id}`,
          }}
        >
          <Avatar size="lg" name="profile picture" src={source} />
          {/* <Image src={source} boxSize="70px" borderRadius="full" fit="cover" /> */}
        </Link>
      </Box>
      <Box position="relative" top="10px">
        <Text
          color="gray.900"
          fontWeight="600"
          fontSize="23px"
          fontFamily="revert-layer"
          position="relative"
          left="30px"
        >
          {employee.firstName} {employee.lastName}
        </Text>

        <HStack position="relative" left="30px" bottom="12px">
          <Text color="gray.700" fontSize="16px" fontWeight="500">
            {employee.role}
          </Text>{" "}
          <Box color="green" fontSize="14px" position="relative" bottom="7px">
            <GoDotFill />
          </Box>
          <Text color="gray.800" fontWeight="500">
            {employee.department}
          </Text>
        </HStack>
      </Box>
      <Box position="relative" left="10rem" top="0.3rem">
        {errorMessage && (
          <Text color="red.400" fontSize="1rem" fontWeight="500">
            Veuillez entrer une heure valide!
          </Text>
        )}
      </Box>
      <Box>
        <Box>
          <Box
            opacity={attendance ? 1 : 0}
            pointerEvents={attendance ? "auto" : "none"}
            animation={
              attendance && attendance?.status !== "ponctuel"
                ? `${flashLate} 1.5s ease-in-out 2`
                : undefined
            }
            position="absolute"
            top="15px"
            right="13rem"
          >
            {!loadingAttendance && attendance?.status === "ponctuel" ? (
              <Badge bg="#123D2B" color="#5EF29B" fontSize="14px">
                A l'heure
              </Badge>
            ) : (
              <AddClockInNotesPopover
                existingNotes={attendance?.lateNotes}
                onSubmit={handleLateNotes}
              />
            )}
          </Box>
          <Box
            opacity={attendance ? 1 : 0}
            pointerEvents={attendance ? "auto" : "none"}
            position="absolute"
            top="1.3rem"
            right="6.1rem"
          >
            <CiClock2 color="#967103" size="22px" />
          </Box>

          <Text
            opacity={attendance ? 1 : 0}
            pointerEvents={attendance ? "auto" : "none"}
            position="absolute"
            top="18px"
            right="2.5rem"
            color="gray.900"
            fontSize="17px"
            fontWeight="500"
          >
            {attendance?.clockIn &&
              String(new Date(attendance.clockIn).getHours()).padStart(2, "0")}
            :
            {attendance?.clockIn &&
              String(new Date(attendance.clockIn).getMinutes()).padStart(
                2,
                "0"
              )}
          </Text>
        </Box>
        <Box>
          {!attendance && displayClock ? (
            <Button
              position="absolute"
              top="18px"
              right="5rem"
              color="#c89704"
              backgroundColor="transparent"
              _hover={{ bg: "transparent" }}
              onClick={handleToggleClockInEdit}
            >
              <GiClockwork className="fa-3x" size="2rem" />
            </Button>
          ) : null}

          {showEditable && (
            <Box>
              <Editable
                width="65px"
                position="absolute"
                right="9rem"
                bottom="1.5rem"
                defaultValue={_clockIn}
                onChange={(clockIn) => setClockIn(clockIn)}
                onFocus={() => setErrorMessage(false)}
                submitOnBlur={false}
                onSubmit={handleClockInSubmit}
              >
                <EditablePreview
                  color="red.600"
                  fontSize="18px"
                  animation="pulse 1.7s infinite"
                  _focus={{
                    animation: "none",
                  }}
                  sx={{
                    "@keyframes pulse": {
                      "0%": {
                        opacity: 1,
                      },
                      "50%": {
                        opacity: 0.3,
                      },
                      "100%": {
                        opacity: 1,
                      },
                    },
                  }}
                />
                <EditableInput color="gray.700" />
              </Editable>
            </Box>
          )}
        </Box>
      </Box>
    </HStack>
  );
};

export default EmployeeCard;
