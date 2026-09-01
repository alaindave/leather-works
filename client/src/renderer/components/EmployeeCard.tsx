import {
  Badge,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Icon,
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
import { useEffect, useState } from "react";
import "../styles/App.css";
import AddClockInNotesPopover from "./AddClockInNotesPopover";
import defaultAvatar from "../assets/default-avatar.jpeg";
import AbsenceNotesPopover from "./AbsenceNotesPopover";
import Leave from "../../common/types/Leave";
import { useErrorToast } from "../hooks/useErrorToast";

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
  const showErrorMessage = useErrorToast();

  // Fetch attendance
  useEffect(() => {
    loadData();
  }, []);

  // Fetch employee photo
  useEffect(() => {
    async function load() {
      if (!employee.photo_path) {
        setPhotoUrl("");
        return;
      }

      try {
        const base64 = await window.electron.employees.getPhotoUrl(
          employee.photo_path
        );

        setPhotoUrl(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        console.error("FAILED TO LOAD EMPLOYEE PHOTO:", error);
        setPhotoUrl("");
      }
    }

    load();
  }, [employee.photo_path]);

  const loadData = () => {
    setLoadingAttendance(true);

    window.electron.attendance
      .getAttendanceRecord(employee._id, formattedDate)
      .then((attendance) => {
        setAttendance(attendance);

        console.log(`ATTENDANCE FETCHED FOR: ${formattedDate}`, attendance);
      })
      .catch((error) => {
        console.error("AN ERROR OCCURED WHILE FETCHING ATTENDANCE:", error);
      })
      .finally(() => {
        setLoadingAttendance(false);
      });
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
    ).padStart(2, "0")}`;

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
        setIsClockingIn(false);
      })
      .catch((error: Error) => {
        console.error(error);
      });
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
      console.error("AN ERROR OCCURED WHILE SAVING NOTES:", error);

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
            position: "top-left",
          });

          return;
        }

        const remainingLeave = employee.remainingLeave ?? 0;
        const leaveDays = 1;

        if (remainingLeave < leaveDays) {
          toast({
            title: "Solde de congé insuffisant",
            description: "L'employé ne dispose plus de jours de congé.",
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "top-left",
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
          notes: "Absence convertie en congé.",
          status: "APPROUVÉ",
        };

        const savedLeave = await window.electron.leave.create(leave);

        console.log("LEAVE SUCCESSFULLY SAVED:", savedLeave);

        toast({
          title: "Demande de congé",
          description: "Congé enregistré avec succès.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-left",
        });

        const updatedEmployee = await window.electron.employees.update(
          employee._id,
          {
            remainingLeave: remainingLeave - leaveDays,
          }
        );

        console.log("EMPLOYEE LEAVE BALANCE UPDATED:", updatedEmployee);

        const results = await window.electron.attendance.createAbsenceLeave(
          employee._id,
          "CONGÉ",
          formattedDate
        );

        console.log("ATTENDANCE RESULTS", results);

        loadData();
      } catch (error) {
        showErrorMessage(
          "Échec d'enregistrement de congé",
          error,
          "Impossible d'enregistrer le congé."
        );
      }

      return;
    }

    if (action === "ABSENT") {
      try {
        const results = await window.electron.attendance.createAbsenceLeave(
          employee._id,
          "ABSENT",
          formattedDate
        );

        console.log("ATTENDANCE RESULTS", results);

        loadData();
      } catch (error) {
        console.error("AN ERROR OCCURED WHILE SUBMITTING ATTENDANCE", error);
      }
    }
  };

  return (
    <Flex
      width="100%"
      minWidth={0}
      minHeight={{ base: "auto", sm: "5.2rem" }}
      bg="#ffffff"
      px={{ base: "0.5rem", sm: "0.75rem", md: "1rem" }}
      py={{ base: "0.65rem", sm: "0.45rem" }}
      position="relative"
      overflow="hidden"
      align="center"
      gap={{ base: "0.6rem", sm: "0.8rem", md: "1rem" }}
    >
      {/* =====================================================
          EMPLOYEE PHOTO
      ====================================================== */}

      <Box flexShrink={0} width={{ base: "48px", sm: "56px", md: "64px" }}>
        <Link
          to={{
            pathname: `/employees_admin/employees_list/${employee._id}`,
          }}
          state={{ photo_url }}
        >
          <Image
            src={photo_url || defaultAvatar}
            width={{ base: "48px", sm: "56px", md: "64px" }}
            height={{ base: "48px", sm: "56px", md: "64px" }}
            borderRadius="full"
            objectFit="cover"
          />
        </Link>
      </Box>

      {/* =====================================================
          EMPLOYEE INFORMATION
      ====================================================== */}

      <Box
        minWidth={0}
        flex={{ base: "1 1 180px", md: "1 1 280px" }}
        overflow="hidden"
      >
        <Text
          color="gray.900"
          fontWeight="600"
          fontSize={{
            base: "0.95rem",
            sm: "1.05rem",
            md: "1.2rem",
            lg: "1.35rem",
          }}
          lineHeight="1.25"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {employee.firstName} {employee.lastName}
        </Text>

        <Flex
          align="center"
          gap={{ base: "0.3rem", sm: "0.45rem" }}
          mt="0.25rem"
          minWidth={0}
        >
          <Text
            color="gray.700"
            fontSize={{
              base: "0.72rem",
              sm: "0.8rem",
              md: "0.9rem",
            }}
            fontWeight="500"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxWidth={{
              base: "80px",
              sm: "130px",
              md: "180px",
              lg: "220px",
            }}
          >
            {employee.role}
          </Text>

          <Box
            color="green.500"
            fontSize={{ base: "9px", sm: "11px", md: "13px" }}
            flexShrink={0}
          >
            <GoDotFill />
          </Box>

          <Text
            color="gray.800"
            fontSize={{
              base: "0.72rem",
              sm: "0.8rem",
              md: "0.9rem",
            }}
            fontWeight="500"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxWidth={{
              base: "90px",
              sm: "140px",
              md: "200px",
              lg: "240px",
            }}
          >
            {employee.department}
          </Text>
        </Flex>
      </Box>

      {/* =====================================================
          ATTENDANCE STATUS
      ====================================================== */}

      <Flex
        flexShrink={0}
        width={{
          base: "auto",
          sm: "110px",
          md: "135px",
          lg: "150px",
        }}
        justify="center"
        align="center"
      >
        {!loadingAttendance && attendance?.status === "CONGÉ" && (
          <Badge
            bg="#3182CE"
            color="gray.200"
            fontSize={{
              base: "0.65rem",
              sm: "0.75rem",
              md: "0.85rem",
            }}
            px={{ base: "0.4rem", sm: "0.55rem" }}
            py="0.25rem"
            borderRadius="md"
            whiteSpace="nowrap"
          >
            En Congé
          </Badge>
        )}

        {!loadingAttendance && attendance?.status === "ABSENT" && (
          <AbsenceNotesPopover
            existingNotes={attendance?.notes}
            onSubmit={saveNotes}
            employeeId={employee._id}
            attendanceId={attendance._id}
          />
        )}

        {!loadingAttendance && attendance?.status === "PONCTUEL" && (
          <Badge
            bg="#38A169"
            color="gray.200"
            fontSize={{
              base: "0.65rem",
              sm: "0.75rem",
              md: "0.85rem",
            }}
            px={{ base: "0.4rem", sm: "0.55rem" }}
            py="0.25rem"
            borderRadius="md"
            whiteSpace="nowrap"
          >
            À l'heure
          </Badge>
        )}

        {!loadingAttendance && attendance?.status === "RETARD" && (
          <AddClockInNotesPopover
            existingNotes={attendance?.notes}
            onSubmit={saveNotes}
          />
        )}
      </Flex>

      {/* =====================================================
          CLOCK IN
      ====================================================== */}

      <Flex
        flexShrink={0}
        align="center"
        justify="center"
        minWidth={{
          base: "55px",
          sm: "80px",
          md: "100px",
        }}
        gap={{ base: "0.25rem", sm: "0.5rem" }}
      >
        {!attendance && displayClock && (
          <Button
            color="#c89704"
            backgroundColor="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            onClick={handleToggleClockInEdit}
            minWidth="auto"
            width={{ base: "34px", sm: "40px" }}
            height={{ base: "34px", sm: "40px" }}
            p="0"
            flexShrink={0}
          >
            <GiClockwork size="1.7rem" />
          </Button>
        )}

        <Box
          width={{
            base: "45px",
            sm: "60px",
            md: "70px",
          }}
          minWidth={0}
        >
          {showEditable && (
            <Editable
              visibility={showEditable ? "visible" : "hidden"}
              pointerEvents={showEditable ? "auto" : "none"}
              defaultValue={_clockIn}
              onChange={(clockIn) => setClockIn(clockIn)}
              submitOnBlur={false}
              onSubmit={handleClockInSubmit}
              width="100%"
            >
              <EditablePreview
                color="red.600"
                fontSize={{
                  base: "0.8rem",
                  sm: "0.95rem",
                  md: "1.1rem",
                }}
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

              <EditableInput
                color="gray.700"
                fontSize={{
                  base: "0.8rem",
                  sm: "0.95rem",
                  md: "1rem",
                }}
              />
            </Editable>
          )}
        </Box>
      </Flex>

      {/* =====================================================
          OPTIONS MENU
      ====================================================== */}

      <Box
        flexShrink={0}
        width={{ base: "30px", sm: "36px", md: "40px" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Menu placement="left">
          <MenuButton
            as={IconButton}
            icon={
              <Icon
                as={BsThreeDotsVertical}
                boxSize={{ base: "1.1rem", sm: "1.2rem", md: "1.4rem" }}
              />
            }
            variant="ghost"
            size="md"
            aria-label="Options"
            flexShrink={0}
            isDisabled={!!attendance}
          />

          <Portal>
            <MenuList zIndex={9999} minW="140px">
              <MenuItem
                onClick={() => handleMenuAction("CONGÉ")}
                _hover={{
                  bg: "blue",
                  color: "#ffffff",
                }}
              >
                Congé
              </MenuItem>

              <MenuItem
                onClick={() => handleMenuAction("ABSENT")}
                _hover={{
                  bg: "brown",
                  color: "#ffffff",
                }}
              >
                Absence
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Box>
    </Flex>
  );
};

export default EmployeeCard;
