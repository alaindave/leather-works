import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Grid,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import axios from "axios";
import { memo, useMemo, useState } from "react";
import { GiClockwork } from "react-icons/gi";
import { FaWindowClose } from "react-icons/fa";
import type Attendance from "../../shared/types/Attendance";

interface Props {
  attendance: Attendance;
  onDelete: () => void;
  gridTemplate: string;
}

type ClockOutMode = "idle" | "editing" | "submitting" | "completed";

const formatTime = (date?: string | Date | null) => {
  if (!date) return "--:--";

  return `${String(new Date(date).getHours()).padStart(2, "0")}:${String(
    new Date(date).getMinutes()
  ).padStart(2, "0")}`;
};

function formatLateMinutes(lateMinutes: number): string {
  if (lateMinutes < 60) {
    return `${lateMinutes} min`;
  }

  const hours = Math.floor(lateMinutes / 60);
  const minutes = lateMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${minutes} min`;
}

const EmployeeAttendanceCard = ({
  attendance,
  onDelete,
  gridTemplate,
}: Props) => {
  const {
    _id,
    employee: { firstName, lastName, employeeID, role, department },
  } = attendance;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [localAttendance, setLocalAttendance] = useState(attendance);

  const [clockOutMode, setClockOutMode] = useState<ClockOutMode>("idle");

  const formattedClockIn = useMemo(
    () => formatTime(localAttendance.clockIn),
    [localAttendance.clockIn]
  );

  const [clockInValue, setClockInValue] = useState(formattedClockIn);

  const formattedClockOut = useMemo(
    () => formatTime(localAttendance.clockOut),
    [localAttendance.clockOut]
  );

  const [clockOutValue, setClockOutValue] = useState(formattedClockOut);

  // =========================
  // Edit Clock In
  // =========================
  const handleEditClockIn = async (newTime: string) => {
    const [hours, minutes] = newTime.split(":").map(Number);
    const clockInDate = new Date(localAttendance.clockIn);
    clockInDate.setHours(hours, minutes, 0, 0);
    try {
      const response = await axios.put(`${API_URL}/attendances/${_id}`, {
        clockIn: clockInDate.toISOString(),
      });
      setLocalAttendance(response.data);
    } catch (error) {
      console.error("Error editing clock in:", error);
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
    try {
      setClockOutMode("submitting");
      const [hours, minutes] = clockOutValue.split(":").map(Number);
      const clockOutDate = new Date();
      clockOutDate.setHours(hours, minutes, 0, 0);

      // Optimistic update
      setLocalAttendance((prev) => ({
        ...prev,
        clockOut: clockOutDate,
      }));

      const response = await axios.put<Attendance>(
        `${API_URL}/attendances/${_id}`,
        {
          clockOut: clockOutDate,
        }
      );

      setLocalAttendance(response.data);
      setClockOutMode("completed");
    } catch (error) {
      console.error("Error clocking out:", error);
      setClockOutMode("editing");
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
      <Text color="gray.200" fontSize="18px">
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

      {localAttendance.lateMinutes > 0 ? (
        <VStack position="relative" top="1.3rem" right="1.2rem">
          <Editable
            position="relative"
            bottom="8px"
            value={clockInValue}
            onChange={setClockInValue}
            submitOnBlur={false}
            width="80px"
            selectAllOnFocus
            onSubmit={handleEditClockIn}
          >
            <EditablePreview
              color="red.300"
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
          <Text
            color="#ffffff"
            fontSize="0.75rem"
            position="relative"
            left="0.3rem"
            bottom="1.6rem"
          >
            {" "}
            {formatLateMinutes(localAttendance.lateMinutes)}{" "}
          </Text>
        </VStack>
      ) : (
        <Editable
          position="relative"
          bottom="8px"
          value={clockInValue}
          onChange={setClockInValue}
          submitOnBlur={false}
          width="80px"
          selectAllOnFocus
          onSubmit={handleEditClockIn}
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

          <EditableInput color="white" fontSize="18px" width="80px" />
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
        {localAttendance.clockOut ? (
          <Editable
            position="relative"
            bottom="8px"
            value={clockOutValue}
            onChange={setClockOutValue}
            submitOnBlur={false}
            selectAllOnFocus
            width="80px"
            onSubmit={async (newTime) => {
              try {
                const [hours, minutes] = newTime.split(":").map(Number);
                const updatedClockOut = new Date(localAttendance.clockOut!);
                updatedClockOut.setHours(hours, minutes, 0, 0);

                // Optimistic UI update
                setLocalAttendance((prev) => ({
                  ...prev,
                  clockOut: updatedClockOut,
                }));

                const response = await axios.put<Attendance>(
                  `${API_URL}/attendances/${_id}`,
                  {
                    clockOut: updatedClockOut,
                  }
                );

                setLocalAttendance(response.data);
              } catch (error) {
                console.error("Error editing clock out:", error);
              }
            }}
          >
            <EditablePreview
              color="yellow.500"
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
            value={clockOutValue}
            onChange={setClockOutValue}
            onSubmit={handleSubmitClockOut}
            submitOnBlur={false}
            selectAllOnFocus
            width="80px"
            position="relative"
            bottom="8px"
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
        {!localAttendance.clockOut && (
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
          color="#ff4d4d"
          onClick={onDelete}
        >
          <FaWindowClose size="1.1rem" />
        </Button>
      </HStack>
    </Grid>
  );
};

export default memo(EmployeeAttendanceCard);
