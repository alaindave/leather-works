import {
  Badge,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useToast,
} from "@chakra-ui/react";
import { GiClockwork } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import type Attendance from "../../common/types/Attendance";
import type Employee from "../../common/types/Employee";
// @ts-ignore
import { useEffect, useState } from "react";
import "../styles/App.css";
import AddClockInNotesPopover from "./AddClockInNotesPopover";
import defaultAvatar from "../assets/default-avatar.jpeg";
import AbsenceNotesPopover from "./AbsenceNotesPopover";
import Leave from "../../common/types/Leave";

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

const date = new Date();

const formatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const formattedDate = formatter.format(date);

const EmployeeCard = ({ employee }: Props) => {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [_clockIn, setClockIn] = useState("");
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [displayClock, setDisplayClock] = useState(true);
  const [showEditable, setShowEditable] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [photo_url, setPhotoUrl] = useState("");
  const toast = useToast();

  //Fetch attendance
  useEffect(() => {
    loadData();
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

  const loadData = () => {
    window.electron.attendance
      .getAttendanceRecord(employee._id, formattedDate)
      .then((attendance) => {
        setAttendance(attendance);
        console.log(
          `ATTENDANCE FETCHED FOR:${formattedDate}
          `
        );
        console.log(attendance);
      })
      .catch((error) => {
        console.error("AN ERROR OCCURED WHILE FETCHING ATTENDANCE: ", error);
      })
      .finally(() => setLoadingAttendance(false));
  };

  const handleToggleClockInEdit = () => {
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
      return;
    }
    const [hours, minutes] = formatted.split(":").map(Number);
    const clockIn = new Date();
    clockIn.setHours(hours, minutes, 0, 0);
    console.log(
      "CLOCK IN AND DATE TO SUBMIT",
      clockIn.toISOString().split("T")[0],
      clockIn.toISOString()
    );
    await window.electron.attendance
      .create({
        employeeId: employee._id,
        date: clockIn.toISOString().split("T")[0],
        clockIn: clockIn.toISOString(),
      })
      .then((attendance) => {
        console.log("Attendance creation success:", attendance);
        setAttendance(attendance);
        setDisplayClock(false);
        setShowEditable(false);
      })
      .catch((error: Error) => console.error(error));
  };

  const saveNotes = async (notes: string | undefined): Promise<boolean> => {
    if (!notes) {
      loadData();
      return true;
    }
    try {
      if (!attendance?._id) {
        throw new Error("ATTENDANCE RECORD NOT FOUND");
      }
      const updatedAttendance = await window.electron.attendance.update(
        attendance._id,
        new Date().toISOString(),
        { notes }
      );
      setAttendance(updatedAttendance);
      loadData();
      return true;
    } catch (error) {
      console.error("AN ERROR OCCURED WHILE SAVING NOTES: ", error);
      return false;
    }
  };

  const handleMenuAction = async (action: "CONGÉ" | "ABSENT") => {
    if (action === "CONGÉ") {
      try {
        if (!employee) {
          toast({
            title: "Employé introuvable",
            description:
              "Impossible de trouver l'employé pour vérifier son solde de congé.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          return;
        }
        const remainingLeave = employee.remainingLeave ?? 0;
        const leaveDays = 1;

        if (remainingLeave < leaveDays) {
          toast({
            title: "Solde de congé insuffisant",
            description: "L'employé ne dispose d'aucun jour de congé restant.",
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          return;
        }

        const today = new Date();
        const date = today.toISOString().split("T")[0];

        const leave: Partial<Leave> = {
          employeeId: employee._id,
          startDate: date,
          endDate: date,
          subject: "Absence approuvée",
          notes: "Employé absent.Congé approuvé",
          status: "APPROUVÉ",
        };

        // Create leave
        const savedLeave = await window.electron.leave.create(leave);
        console.log("LEAVE SUCCESSFULLY SAVED:", savedLeave);

        toast({
          title: "Demande de congé ",
          description: "Congé enregistré  avec succès.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });

        // Deduct one leave day
        const updatedEmployee = await window.electron.employees.update(
          employee._id,
          {
            remainingLeave: remainingLeave - leaveDays,
          }
        );

        console.log("EMPLOYEE LEAVE BALANCE UPDATED:", updatedEmployee);

        // Create leave absence
        const results = await window.electron.attendance.createAbsenceLeave(
          employee._id,
          "CONGÉ"
        );
        console.log("ATTENDANCE RESULTS", results);
        loadData();
      } catch (e) {
        console.error("AN ERROR OCCURED WHILE SUBMITTING LEAVE ATTENDANCE", e);
      }
      return;
    }

    if (action === "ABSENT") {
      try {
        const results = await window.electron.attendance.createAbsenceLeave(
          employee._id,
          "ABSENT"
        );
        console.log("ATTENDANCE RESULTS", results);
        loadData();
      } catch (e) {
        console.error("AN ERROR OCCURED WHILE SUBMITTING ATTENDANCE", e);
      }
    }
  };

  return (
    <Flex
      w="70rem"
      bg="#ffffff"
      height="5.2rem"
      mr="2rem"
      padding="0.3rem"
      position="relative"
      overflowX="hidden"
      overflowY="hidden"
      justify="space-between"
    >
      {/* Employee info */}
      <Flex width="50rem" justify="space-between">
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
            mt="0.15rem"
            ml="1rem"
          />
        </Link>
        <Box ml="1rem" mt="0.3rem">
          <Text
            color="gray.900"
            fontWeight="600"
            fontSize="23px"
            fontFamily="revert-layer"
          >
            {employee.firstName} {employee.lastName}
          </Text>

          <HStack width="25rem" position="relative" bottom="0.95rem">
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
        {/* Attendance status */}
        <Box>
          {!loadingAttendance && attendance?.status === "CONGÉ" ? (
            <Badge
              mt="2rem"
              bg="#3182CE"
              color="gray.200"
              fontSize="14px"
              height="22px"
            >
              En Congé
            </Badge>
          ) : !loadingAttendance && attendance?.status === "ABSENT" ? (
            <Box mt="1.5rem">
              <AbsenceNotesPopover
                existingNotes={attendance?.notes}
                onSubmit={saveNotes}
                employeeId={employee._id}
                attendanceId={attendance._id}
              />
            </Box>
          ) : null}

          {!loadingAttendance && attendance?.status === "PONCTUEL" ? (
            <Badge mt="2rem" bg="#38A169" color="gray.200" fontSize="14px">
              A l'heure
            </Badge>
          ) : !loadingAttendance && attendance?.status === "RETARD" ? (
            <Box mt="1.5rem">
              <AddClockInNotesPopover
                existingNotes={attendance?.notes}
                onSubmit={saveNotes}
              />
            </Box>
          ) : null}
        </Box>

        {/* Clock In button and Editable */}
        <HStack position="relative" right="3rem">
          {!attendance && displayClock ? (
            <Button
              color="#c89704"
              backgroundColor="transparent"
              _hover={{ bg: "transparent" }}
              onClick={handleToggleClockInEdit}
            >
              <GiClockwork className="fa-3x" size="2rem" />
            </Button>
          ) : null}
          <Box ml="1.2rem" width="4rem">
            {showEditable && (
              <Editable
                visibility={showEditable ? "visible" : "hidden"}
                pointerEvents={showEditable ? "auto" : "none"}
                defaultValue={_clockIn}
                onChange={(clockIn) => setClockIn(clockIn)}
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
        <Box position="absolute" top="1.2rem" right="7rem">
          <Menu placement="left">
            <MenuButton
              as={IconButton}
              icon={<BsThreeDotsVertical size="1.5rem" />}
              variant="ghost"
              size="md"
              aria-label="Options"
              flexShrink={0}
              isDisabled={attendance ? true : false}
            />

            <Portal>
              <MenuList zIndex={9999} minW="140px">
                <MenuItem
                  onClick={() => handleMenuAction("CONGÉ")}
                  _hover={{ bg: "blue", color: "#ffffff" }}
                >
                  Congé
                </MenuItem>

                <MenuItem
                  onClick={() => handleMenuAction("ABSENT")}
                  _hover={{ bg: "brown", color: "#ffffff" }}
                >
                  Absence
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Box>
      </Flex>
    </Flex>
  );
};

export default EmployeeCard;
