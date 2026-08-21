import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Grid,
  HStack,
  Text,
  Tooltip,
  Image,
  Badge,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { GiClockwork } from "react-icons/gi";
import { FaWindowClose } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import ClockIn from "./ClockIn";
import AttendanceWithEmployee from "../../common/types/AttendanceWithEmployee";
import Employee from "../../common/types/Employee";
import defaultAvatar from "../assets/default-avatar.jpeg";

interface Props {
  attendance: AttendanceWithEmployee | null;
  selectedDate: string;
  onDelete: () => void;
  gridTemplate: string;
  isUnlocked: boolean;
  toggleOff: () => void;
}

type ClockOutMode = "idle" | "editing" | "submitting" | "completed";

const formatTime = (input?: string | Date) => {
  if (!input) return "";

  const raw = String(input).trim();

  // =========================
  // 1. ISO STRING SUPPORT
  // =========================
  const iso = new Date(raw);
  if (!Number.isNaN(iso.getTime()) && raw.includes("T")) {
    return `${String(iso.getHours()).padStart(2, "0")}:${String(
      iso.getMinutes()
    ).padStart(2, "0")}`;
  }

  const cleaned = raw.replace(/[hH]/g, ":");

  // =========================
  // 2. HHMM (e.g. 1830)
  // =========================
  if (/^\d{4}$/.test(cleaned)) {
    const hours = Number(cleaned.slice(0, 2));
    const minutes = Number(cleaned.slice(2, 4));

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours > 23 ||
      minutes > 59
    ) {
      return "";
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  // =========================
  // 3. HMM (e.g. 930 → 09:30)
  // =========================
  if (/^\d{3}$/.test(cleaned)) {
    const hours = Number(cleaned.slice(0, 1));
    const minutes = Number(cleaned.slice(1, 3));

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours > 23 ||
      minutes > 59
    ) {
      return "";
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  // =========================
  // 4. HH:MM or H:MM
  // =========================
  const match = cleaned.match(/^(\d{1,2}):(\d{1,2})$/);

  if (!match) return "";

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours > 23 ||
    minutes > 59
  ) {
    return "";
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

const EmployeeAttendanceCard = ({
  attendance,
  selectedDate,
  onDelete,
  gridTemplate,
  isUnlocked,
  toggleOff,
}: Props) => {
  if (!attendance) return null;
  const {
    _id,
    date: attendanceDate,
    employeeId,
    firstName,
    lastName,
    matricule,
    role,
    department,
  } = attendance;
  if (attendanceDate !== selectedDate) return;
  const [localAttendance, setLocalAttendance] =
    useState<AttendanceWithEmployee | null>(attendance);
  const [errorMessage, setErrorMessage] = useState("");
  const [clockOutMode, setClockOutMode] = useState<ClockOutMode>("idle");
  const [clockOutValue, setClockOutValue] = useState("");
  const [draftClockOut, setDraftClockOut] = useState("");
  const [employee, setEmployee] = useState<Employee>({} as Employee);
  const [photo_url, setPhotoUrl] = useState("");

  useEffect(() => {
    const formatted = formatTime(localAttendance?.clockOut);

    setClockOutValue(formatted);
    setDraftClockOut(formatted);
  }, [localAttendance?.clockOut]);

  //Fetch employee
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const employee = await window.electron.employees.getById(employeeId);
        setEmployee(employee);
      } catch (e) {
        console.error("AN ERROR OCCURED WHILE FETCHING THE EMPLOYEE.", e);
      }
    }
    fetchEmployee();
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

  useEffect(() => {
    if (!errorMessage) return;

    const timeout = setTimeout(() => {
      setErrorMessage("");
      setDraftClockOut(formatTime(clockOutValue));
    }, 2000);

    return () => clearTimeout(timeout);
  }, [errorMessage]);

  // =========================
  // Toggle Clock Out
  // =========================

  const handleToggleClockOut = () => {
    if (clockOutMode === "editing") {
      setDraftClockOut("");
      setClockOutMode("idle");
      return;
    }
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    setDraftClockOut(currentTime);
    setClockOutMode("editing");
  };

  // =========================
  // Submit Clock Out
  // =========================
  const handleSubmitClockOut = async () => {
    const formattedClockOut = formatTime(draftClockOut);

    if (!formattedClockOut) {
      setErrorMessage("Heure invalide");
      return;
    }

    try {
      setClockOutMode("submitting");

      const [hours, minutes] = formattedClockOut.split(":").map(Number);

      const clockOutDate = new Date();
      clockOutDate.setHours(hours, minutes, 0, 0);
      // optimistic update
      setLocalAttendance((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          clockOut: clockOutDate.toISOString(),
        };
      });

      const updated = await window.electron.attendance.update(
        _id,
        attendanceDate,
        {
          clockOut: clockOutDate.toISOString(),
        }
      );

      setLocalAttendance((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          ...updated,
        };
      });

      setClockOutMode("completed");
      toggleOff();
    } catch (error) {
      console.error("ERROR CLOCKING OUT:", error);
      setClockOutMode("editing");
    }
  };

  const handleEditClockOut = async () => {
    const formattedClockOut = formatTime(draftClockOut);
    if (!formattedClockOut) {
      setErrorMessage("Heure invalide");
      return false;
    }

    if (!localAttendance?.clockOut) return;
    try {
      setDraftClockOut(formattedClockOut);
      setClockOutValue(formattedClockOut);

      const [hours, minutes] = formattedClockOut.split(":").map(Number);

      if (!localAttendance?.clockOut) {
        console.error("Cannot update clock out: no existing clock out date.");
        return;
      }

      const updatedClockOut = new Date(localAttendance.clockOut);

      if (Number.isNaN(updatedClockOut.getTime())) {
        console.error(
          "Cannot update clock out: existing clock out is invalid:",
          localAttendance.clockOut
        );

        return;
      }

      updatedClockOut.setHours(hours, minutes, 0, 0);

      const clockOutISO = updatedClockOut.toISOString();

      // Optimistic UI update
      setLocalAttendance((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          clockOut: clockOutISO,
        };
      });

      const updatedAttendance = await window.electron.attendance.update(
        _id,
        attendanceDate,
        {
          clockOut: clockOutISO,
        }
      );

      setLocalAttendance(updatedAttendance);
      toggleOff();
      return;
    } catch (error) {
      console.error("ERROR EDITING CLOCK OUT:", error);
      return;
    }
  };

  const refreshAttendance = async () => {
    if (!localAttendance?._id) return;
    toggleOff?.();

    const attendance = await window.electron.attendance.getById(
      localAttendance._id
    );

    setLocalAttendance(attendance ?? null);
  };

  return (
    <Grid
      templateColumns={gridTemplate}
      alignItems="center"
      px={4}
      py={5}
      bg="#ffffff"
      borderWidth="0.3px"
      border="1px solid #E2E8F0"
      boxShadow="0 2px 10px rgba(15,23,42,.06)"
      width="78.5vw"
      minH="6.3rem"
      ml="0.5rem"
      mr="0.5rem"
    >
      {/* Employee Name */}
      <HStack>
        <Image
          src={photo_url || defaultAvatar}
          boxSize="70px"
          borderRadius="full"
          fit="cover"
        />
        <Text
          color="gray.800"
          fontWeight="600"
          fontSize="1.3rem"
          whiteSpace="normal"
          wordBreak="break-word"
          maxW="7rem"
          noOfLines={2}
        >
          {firstName} {lastName}
        </Text>
      </HStack>

      {/* Employee ID */}
      <Text color="gray.600" fontWeight="500" fontSize="1.1rem">
        {matricule}
      </Text>

      {/* Role */}
      <Text color="gray.600" fontWeight="500" fontSize="1.1rem">
        {role}
      </Text>

      {/* Department */}
      <Text color="gray.600" fontWeight="500" fontSize="1.1rem">
        {department}
      </Text>

      {/* Clock In */}
      <Box>
        <ClockIn
          isUnlocked={isUnlocked}
          attendance={localAttendance}
          onRefresh={refreshAttendance}
          awayStatus={
            attendance.status === "ABSENT" || attendance.status === "CONGÉ"
              ? attendance.status
              : null
          }
        />
      </Box>

      {/* Clock Out */}
      <Box
        width="90px"
        minWidth="90px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        {localAttendance?.clockOut ? (
          <Tooltip
            label={errorMessage}
            bg="red.600"
            color="white"
            hasArrow
            placement="top"
            isOpen={!!errorMessage}
          >
            <Editable
              position="relative"
              right="1rem"
              bottom="0.5rem"
              value={draftClockOut ?? ""}
              onChange={setDraftClockOut}
              submitOnBlur={false}
              selectAllOnFocus
              width="80px"
              onSubmit={handleEditClockOut}
              isDisabled={isUnlocked ? false : true}
            >
              <EditablePreview
                color="purple.700"
                fontSize="18px"
                fontWeight="500"
                px={2}
                borderRadius="6px"
                transition="0.2s"
                cursor={isUnlocked ? "pointer" : "default"}
                _hover={{
                  bg: "rgba(255,255,255,0.05)",

                  cursor: isUnlocked ? "pointer" : "default",
                }}
              />
              <EditableInput
                color="brown"
                fontSize="18px"
                width="80px"
                onFocus={() => {
                  setErrorMessage("");
                  setDraftClockOut(formatTime(clockOutValue));
                }}
                onBlur={() => {
                  if (!formatTime(draftClockOut)) {
                    setErrorMessage("Heure invalide");
                  }
                }}
              />{" "}
            </Editable>
          </Tooltip>
        ) : clockOutMode === "editing" || clockOutMode === "submitting" ? (
          <Tooltip
            label={errorMessage}
            bg="red.600"
            color="white"
            hasArrow
            placement="top"
            isOpen={!!errorMessage}
          >
            <Editable
              value={draftClockOut ?? "----"}
              onChange={setDraftClockOut}
              onSubmit={handleSubmitClockOut}
              submitOnBlur={false}
              selectAllOnFocus
              width="80px"
              position="relative"
              bottom="0.5rem"
            >
              <EditablePreview
                color="red.500"
                fontSize="18px"
                px={2}
                width="80px"
                animation={
                  clockOutMode === "submitting" ? "none" : "pulse 1.7s infinite"
                }
                sx={{
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <EditableInput
                color="brown"
                fontSize="18px"
                width="80px"
                onFocus={() => {
                  setErrorMessage("");
                  setDraftClockOut(formatTime(draftClockOut));
                }}
                onBlur={() => {
                  if (!formatTime(draftClockOut)) {
                    setErrorMessage("Heure invalide");
                  }
                }}
              />{" "}
            </Editable>
          </Tooltip>
        ) : localAttendance?.status === "ABSENT" ||
          localAttendance?.status === "CONGÉ" ? (
          <Badge
            mb="1.1rem"
            fontSize="0.9rem"
            bg={attendance.status === "CONGÉ" ? "#3182CE" : "#E53E3E"}
            color="gray.200"
          >
            {attendance.status}
          </Badge>
        ) : (
          <Badge mb="1rem" bg="#ECFDF5" color="#047857" fontSize="0.85rem">
            En cours
          </Badge>
        )}
      </Box>

      {/* Action buttons */}
      {isUnlocked ? (
        <Box position="relative" right="1rem" mb="1rem">
          {!localAttendance?.clockOut &&
          localAttendance?.status !== "ABSENT" &&
          localAttendance?.status !== "CONGÉ" ? (
            <Button
              bg="transparent"
              _hover={{
                bg: "transparent",
              }}
              color={clockOutMode === "editing" ? "red.300" : "yellow.600"}
              onClick={handleToggleClockOut}
            >
              <GiClockwork size="1.8rem" />
            </Button>
          ) : (
            <Button
              bg="transparent"
              _hover={{
                bg: "transparent",
              }}
              color="red.600"
              onClick={onDelete}
            >
              <FaWindowClose size="1.1rem" />
            </Button>
          )}
        </Box>
      ) : (
        <Box mb="1.2rem">
          <FaLock size="1.3rem" color="#D4A017" />
        </Box>
      )}
    </Grid>
  );
};

export default memo(EmployeeAttendanceCard);
