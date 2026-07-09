import {
  Badge,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CiClock2 } from "react-icons/ci";
import { GiClockwork } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";
import type Attendance from "../../shared/types/Attendance";
import type Employee from "../../shared/types/Employee";
// @ts-ignore
import { useEffect, useState } from "react";
import "../styles/App.css";
import AddClockInNotesPopover from "./AddClockInNotesPopover";
import defaultAvatar from "../assets/default-avatar.jpeg";

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
  const [photo_url, setPhotoUrl] = useState("");

  //Fetch attendance r
  useEffect(() => {
    window.electron.attendance
      .getAttendanceRecord(employee._id, new Date().toISOString().split("T")[0])
      .then((attendance) => {
        setAttendance(attendance);
        console.log("Attendance fetched: ", attendance);
      })
      .catch((error) => {
        console.error(
          "An error occured while fetching attendance data: ",
          error
        );
      })
      .finally(() => setLoadingAttendance(false));
  }, []);

  //Fetch employee photos URL
  useEffect(() => {
    async function load() {
      if (!employee.photo_path) return;
      const base64 = await window.electron.employees.getPhotoUrl(
        employee.photo_path
      );
      setPhotoUrl(`data:image/jpeg;base64,${base64}`);
    }

    load();
  }, [employee.photo_path]);

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
    console.log("Clock In to submit", clockIn.toISOString());
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
    <Flex
      bg="#ffffff"
      height="5.2rem"
      w="80vw"
      padding="0.3rem"
      justify="space-between"
    >
      {/* Employee info */}
      <Flex justify="space-between">
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employee._id}`,
          }}
          state={{ photo_url }}
        >
          <Image
            src={photo_url || defaultAvatar}
            boxSize="70px"
            borderRadius="full"
            fit="cover"
            mt="0.1rem"
            ml="0.4rem"
          />
        </Link>
        <Box ml="1.8rem">
          <Text
            color="gray.900"
            fontWeight="600"
            fontSize="23px"
            fontFamily="revert-layer"
          >
            {employee.firstName} {employee.lastName}
          </Text>

          <HStack position="relative" bottom="0.95rem">
            <Text color="gray.700" fontSize="16px" fontWeight="500">
              {employee.role}
            </Text>{" "}
            <Box
              color="green"
              fontSize="14px"
              position="relative"
              bottom="0.5rem"
            >
              <GoDotFill />
            </Box>
            <Text color="gray.800" fontWeight="500">
              {employee.department}
            </Text>
          </HStack>
        </Box>
      </Flex>

      {/* Clock In Info */}
      <Flex justify="space-between" mt="0.5rem" mr="9rem">
        {errorMessage && (
          <Text color="red.400" mt="1rem" fontSize="1.2rem" fontWeight="500">
            Veuillez entrer une heure valide!
          </Text>
        )}
        <VStack>
          <Box
            opacity={attendance ? 1 : 0}
            pointerEvents={attendance ? "auto" : "none"}
            animation={
              attendance && attendance?.status !== "PONCTUEL"
                ? `${flashLate} 1.5s ease-in-out 2`
                : undefined
            }
          >
            {!loadingAttendance && attendance?.status === "PONCTUEL" ? (
              <Badge bg="#123D2B" color="#5EF29B" fontSize="14px">
                A l'heure
              </Badge>
            ) : !loadingAttendance && attendance?.status === "ABSENT" ? (
              <Badge mt="1rem" bg="red.900" color="red.200" fontSize="14px">
                Absence
              </Badge>
            ) : (
              <AddClockInNotesPopover
                existingNotes={attendance?.lateNotes}
                onSubmit={handleLateNotes}
              />
            )}
          </Box>
          <HStack>
            <Box
              opacity={attendance && attendance.status !== "ABSENT" ? 1 : 0}
              pointerEvents={attendance ? "auto" : "none"}
            >
              <CiClock2 color="#967103" size="22px" />
            </Box>
            <Box
              opacity={attendance && attendance.status !== "ABSENT" ? 1 : 0}
              pointerEvents={attendance ? "auto" : "none"}
              color="gray.900"
              fontSize="17px"
              fontWeight="500"
            >
              {attendance?.clockIn &&
                String(new Date(attendance.clockIn).getHours()).padStart(
                  2,
                  "0"
                )}
              :
              {attendance?.clockIn &&
                String(new Date(attendance.clockIn).getMinutes()).padStart(
                  2,
                  "0"
                )}
            </Box>
          </HStack>
        </VStack>
        <HStack
        //  position="relative" left="3rem"
        >
          {!attendance && displayClock ? (
            <Button
              color="#c89704"
              backgroundColor="transparent"
              _hover={{ bg: "transparent" }}
              onClick={handleToggleClockInEdit}
              mr="1rem"
            >
              <GiClockwork className="fa-3x" size="2rem" />
            </Button>
          ) : null}

          <Box width="4rem">
            {showEditable && (
              <Editable
                visibility={showEditable ? "visible" : "hidden"}
                pointerEvents={showEditable ? "auto" : "none"}
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
            )}
          </Box>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default EmployeeCard;
