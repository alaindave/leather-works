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
} from "@chakra-ui/react";
import { memo, useMemo, useState } from "react";
import { GiClockwork } from "react-icons/gi";
import { FaWindowClose } from "react-icons/fa";
import ClockInNotesPopover from "../components/ClockInNotesPopover";
import { AttendanceWithEmployee } from "../../shared/AttendanceWithEmployee";

interface Props {
  attendance: AttendanceWithEmployee | undefined;
  onDelete: () => void;
  gridTemplate: string;
}

type ClockOutMode = "idle" | "editing" | "submitting" | "completed";

// const formatTime = (date?: string | Date | null) => {
//   if (!date) return "--:--";

//   return `${String(new Date(date).getHours()).padStart(2, "0")}:${String(
//     new Date(date).getMinutes()
//   ).padStart(2, "0")}`;
// };

const formatTime = (input?: string | Date | null) => {
  if (!input) return null;

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
      return null;
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
      return null;
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
};

const EmployeeAttendanceCard = ({
  attendance,
  onDelete,
  gridTemplate,
}: Props) => {
  if (!attendance) return null;
  const { _id, firstName, lastName, employeeID, role, department } = attendance;
  const [localAttendance, setLocalAttendance] = useState<
    AttendanceWithEmployee | undefined
  >(attendance);
  const [errorMessage, setErrorMessage] = useState("");
  const [clockOutMode, setClockOutMode] = useState<ClockOutMode>("idle");

  const formattedClockIn = useMemo(() => {
    return formatTime(localAttendance?.clockIn);
  }, [localAttendance?.clockIn]);

  const [clockInValue, setClockInValue] = useState(formattedClockIn);

  const formattedClockOut = useMemo(() => {
    return formatTime(localAttendance?.clockOut);
  }, [localAttendance?.clockOut]);

  const [clockOutValue, setClockOutValue] = useState(formattedClockOut);

  // =========================
  // Edit Clock In
  // =========================
  const handleEditClockIn = async (): Promise<boolean> => {
    const formattedClockIn = formatTime(clockInValue);
    if (!formattedClockIn) {
      setErrorMessage("Heure invalide");
      return false;
    }
    setClockInValue(formattedClockIn);
    const [hours, minutes] = formattedClockIn.split(":").map(Number);
    const clockInDate = new Date(localAttendance?.clockIn!);
    clockInDate.setHours(hours, minutes, 0, 0);
    console.log("New time to update: ", clockInDate);
    try {
      const updatedAttendance = await window.electron.attendance.updateClockIn(
        _id,
        clockInDate.toISOString()
      );
      setLocalAttendance(updatedAttendance);
      return true;
    } catch (error) {
      console.error("Error editing clock in:", error);
      return false;
    }
  };

  // =========================
  // Toggle Clock Out
  // =========================

  const handleToggleClockOut = () => {
    if (clockOutMode === "editing") {
      setClockOutValue("");
      setClockOutMode("idle");
      return;
    }
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    setClockOutValue(currentTime);
    setClockOutMode("editing");
  };

  // =========================
  // Submit Clock Out
  // =========================

  const handleSubmitClockOut = async () => {
    const formattedClockOut = formatTime(clockOutValue);
    if (!formattedClockOut) return;
    try {
      setClockOutMode("submitting");
      const [hours, minutes] = formattedClockOut.split(":").map(Number);
      const clockOutDate = new Date();
      clockOutDate.setHours(hours, minutes, 0, 0);

      // Optimistic update
      setLocalAttendance((prev) => {
        if (!prev) return undefined;

        return {
          ...prev,
          clockOut: clockOutDate.toISOString(),
        };
      });
      const attendance: AttendanceWithEmployee | undefined =
        await window.electron.attendance.clockOut(
          _id,
          clockOutDate.toISOString()
        );

      setLocalAttendance(attendance);
      setClockOutMode("completed");
    } catch (error) {
      console.error("Error clocking out:", error);
      setClockOutMode("editing");
    }
  };

  const handleEditClockOut = async () => {
    const formattedClockOut = formatTime(clockOutValue);
    if (!formattedClockOut) return;
    try {
      const [hours, minutes] = formattedClockOut.split(":").map(Number);
      const updatedClockOut = new Date(localAttendance?.clockOut!);
      updatedClockOut.setHours(hours, minutes, 0, 0);
      // Optimistic UI update
      setLocalAttendance((prev) => {
        if (!prev) return undefined;
        return {
          ...prev,
          clockOut: updatedClockOut.toISOString(),
        };
      });

      const updatedAttendance = await window.electron.attendance.updateClockOut(
        _id,
        updatedClockOut.toISOString()
      );

      setLocalAttendance(updatedAttendance);
    } catch (error) {
      console.error("Error editing clock out:", error);
    }
  };

  return (
    <Grid
      templateColumns={gridTemplate}
      alignItems="center"
      px={4}
      py={5}
      bg="#0E1E47"
      borderRadius="18px"
      border="1px solid #22345F"
      w="78.5vw"
      height="6.3rem"
    >
      {/* Employee Name */}
      <Text
        color="gray.200"
        fontSize="18px"
        whiteSpace="normal"
        wordBreak="break-word"
        maxW="140px"
      >
        {firstName} {lastName}
      </Text>

      {/* Employee ID */}
      <Text color="gray.200" fontSize="18px">
        {employeeID}
      </Text>

      {/* Role */}
      <Text color="gray.200" fontSize="18px">
        {role}
      </Text>

      {/* Department */}
      <Text color="gray.200" fontSize="1.1rem">
        {department}
      </Text>

      {/* Clock In */}

      {(localAttendance?.lateMinutes ?? 0) > 0 ? (
        <Box ml="0.3rem">
          <ClockInNotesPopover
            clockInTime={clockInValue!}
            lateMinutes={localAttendance?.lateMinutes ?? 0}
            notes={localAttendance?.lateNotes}
            onTimeEdit={handleEditClockIn}
          />
        </Box>
      ) : (
        <Editable
          position="relative"
          right="0.5rem"
          bottom="0.5rem"
          value={clockInValue!}
          onChange={setClockInValue}
          submitOnBlur={false}
          width="80px"
          selectAllOnFocus
          onSubmit={handleEditClockIn}
        >
          <Tooltip
            label={errorMessage}
            bg="red.600"
            color="white"
            hasArrow
            placement="top"
            isOpen={!!errorMessage}
          >
            <EditablePreview
              color="#63E6BE"
              fontSize="18px"
              fontWeight="500"
              px={2}
              borderRadius="6px"
              transition="0.2s"
              _hover={{
                bg: "rgba(255,255,255,0.05)",
                cursor: "pointer",
              }}
            />
          </Tooltip>

          <EditableInput
            color="white"
            fontSize="1.1rem"
            width="80px"
            onFocus={() => {
              setErrorMessage("");
              setClockInValue(formatTime(localAttendance?.clockIn));
            }}
          />
        </Editable>
      )}

      {/* Clock Out */}
      <Box
        width="90px"
        minWidth="90px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
      >
        {localAttendance?.clockOut ? (
          <Editable
            position="relative"
            right="0.5rem"
            bottom="0.5rem"
            value={clockOutValue ?? "--:--"}
            onChange={setClockOutValue}
            submitOnBlur={false}
            selectAllOnFocus
            width="80px"
            onSubmit={handleEditClockOut}
          >
            <EditablePreview
              color="#B197FC"
              fontSize="18px"
              fontWeight="500"
              px={2}
              borderRadius="6px"
              transition="0.2s"
              _hover={{
                bg: "rgba(255,255,255,0.05)",
                cursor: "pointer",
              }}
            />

            <EditableInput color="white" fontSize="18px" width="80px" />
          </Editable>
        ) : clockOutMode === "editing" || clockOutMode === "submitting" ? (
          <Editable
            value={clockOutValue ?? "--:--"}
            onChange={setClockOutValue}
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

            <EditableInput color="white" fontSize="18px" width="80px" />
          </Editable>
        ) : (
          <Text color="gray.400" width="80px" fontSize="18px" px={2}>
            --:--
          </Text>
        )}
      </Box>

      {/* Actions */}
      <HStack spacing={1} position="relative" bottom="0.5rem" right="0.6rem">
        {!localAttendance?.clockOut && (
          <Button
            bg="transparent"
            _hover={{
              bg: "transparent",
            }}
            color={clockOutMode === "editing" ? "red.300" : "#F2B705"}
            onClick={handleToggleClockOut}
          >
            <GiClockwork size="1.8rem" />
          </Button>
        )}

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
      </HStack>
    </Grid>
  );
};

export default memo(EmployeeAttendanceCard);
