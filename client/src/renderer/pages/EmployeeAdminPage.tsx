import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { IoReloadOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
import { FaSyncAlt } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

import type Attendance from "../../common/types/Attendance";
import type Employee from "../../common/types/Employee";
import type Leave from "../../common/types/Leave";
import type AdminUser from "../../common/types/AdminUser";
import type Task from "../../common/types/Task";

import useAdminUser from "../../store/auth.store";
import useTaskStore from "../../store/task.store";
import useSyncStore from "../../store/sync.store";

import EmployeeDashboard from "../components/EmployeeDashboard";
import TaskSubmissionModal from "../components/tasks/TaskSubmissionModal";
import TaskCard from "../components/tasks/TaskCard";
import TaskDetailsDrawer from "../components/tasks/TaskDetailsDrawer";
import QuickActions from "../components/QuickActions";
import ReminderModal from "../components/ReminderModal";

const EmployeeAdminPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const [time, setTime] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const user = useAdminUser((store) => store.adminUser);
  const [notes, setNotes] = useState(user.notes);

  const saveNotes = useAdminUser((store) => store.saveNotes);
  const loadTopTasks = useTaskStore((store) => store.loadTopTasks);
  const deleteTask = useTaskStore((store) => store.deleteTask);
  const tasks = useTaskStore((store) => store.tasks);
  const syncVersion = useSyncStore((store) => store.syncVersion);
  const previousSyncVersion = useRef(syncVersion);

  // ---------------------------------------------------------
  // DISCLOSURES
  // ---------------------------------------------------------

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  const {
    isOpen: isReminderOpen,
    onOpen: onReminderOpen,
    onClose: onReminderClose,
  } = useDisclosure();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // ---------------------------------------------------------
  // ATTENDANCE COUNTS
  // ---------------------------------------------------------

  const lateCount = attendances.filter(
    (attendance) => attendance.status === "RETARD"
  );

  const dailyAttendance = attendances.filter(
    (attendance) =>
      attendance.status === "PONCTUEL" || attendance.status === "RETARD"
  );

  // ---------------------------------------------------------
  // LOAD DASHBOARD DATA
  // ---------------------------------------------------------

  const loadData = async () => {
    try {
      setLoading(true);

      const employees = await window.electron.employees.getAll();

      setEmployees(employees);

      console.log("FETCHED SYNCED EMPLOYEES:", employees);

      const today = new Date().toISOString().split("T")[0];

      const attendances = await window.electron.attendance.getByDate(today);

      setAttendances(attendances);

      console.log("FETCHED ATTENDANCES:", attendances);

      const leaves = await window.electron.leave.getOngoingLeaves(today);

      setLeaves(leaves);

      console.log("FETCHED ONGOING LEAVES:", leaves);

      const admin_users = await window.electron.adminUsers.getAll();

      setAdminUsersList(admin_users);

      console.log("FETCHED ADMIN USERS:", admin_users);
    } catch (error) {
      console.error("ERROR LOADING DASHBOARD DATA:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // LOAD TOP TASKS
  // ---------------------------------------------------------

  const loadTasks = async () => {
    if (!user?._id) {
      console.warn("CANNOT LOAD TASKS: NO ADMIN USER");
      return;
    }

    try {
      console.log("LOADING TOP TASKS FOR USER:", user._id);
      await loadTopTasks(user._id);
      console.log("TOP TASKS LOADED SUCCESSFULLY");
    } catch (error) {
      console.error("AN ERROR OCCURRED WHILE FETCHING TASKS:", error);
    }
  };

  // ---------------------------------------------------------
  // INITIAL PAGE LOAD
  // Runs once when the dashboard is mounted.
  // ---------------------------------------------------------

  useEffect(() => {
    console.log("EMPLOYEE ADMIN PAGE: INITIAL LOAD");
    loadData();

    const interval = setInterval(() => {
      setTime(new Date());
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (previousSyncVersion.current === syncVersion) {
      return;
    }
    previousSyncVersion.current = syncVersion;
    console.log("SYNC VERSION CHANGED:", syncVersion);
    console.log("SYNC COMPLETED: RELOADING DASHBOARD DATA AND TASKS");
    loadData();
    loadTasks();
  }, [syncVersion]);

  // ---------------------------------------------------------
  // PERSONAL NOTES AUTOSAVE
  // ---------------------------------------------------------

  useEffect(() => {
    if (!notes?.trim()) {
      return;
    }

    if (notes === user.notes) {
      return;
    }

    const timeout = setTimeout(() => {
      handleNotesSubmission();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [notes]);

  const handleTaskRefresh = async () => {
    try {
      console.log("MANUALLY REFRESHING TASKS...");

      await loadTasks();
    } catch (error) {
      console.error("AN ERROR OCCURRED WHILE REFRESHING TASKS:", error);
    }
  };

  const handleTaskCreate = () => {
    console.log("TASK CREATE CLICKED");

    onCreateOpen();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    onDetailsOpen();
  };

  const handleTaskClosed = () => {
    setSelectedTask(null);
    onDetailsClose();
  };

  const handleTaskDelete = async (_id: string) => {
    console.log("ID TO DELETE:", _id);

    try {
      const deletedTask = await deleteTask(_id);

      console.log("DELETED TASK:", deletedTask);
    } catch (error) {
      console.error("AN ERROR OCCURRED WHILE DELETING TASK:", error);
    }
  };

  const handleNotesSubmission = () => {
    window.electron.offlineUsers
      .saveNotes(user._id, notes)
      .then((res) => {
        console.log("NOTES SUCCESSFULLY SAVED:", res);

        setNotes(notes);
        saveNotes(notes);
      })
      .catch((error) =>
        console.error("AN ERROR OCCURRED WHILE SAVING NOTES:", error)
      );
  };

  const handleOpenReminder = () => {
    if (!notes?.trim()) {
      return;
    }

    onReminderOpen();
  };

  return (
    <Flex
      direction="column"
      ml="0.01rem"
      w="100%"
      minH="94vh"
      bg="#ffffff"
      border="1px solid"
      borderColor="#D1D9E0"
      overflow="hidden"
      p={{ base: 3, md: 6 }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <Flex
        justify="space-between"
        align={{
          base: "flex-start",
          md: "center",
        }}
        flexDir={{
          base: "column",
          md: "row",
        }}
        gap={3}
      >
        <Box position="relative" bottom="0.7rem">
          <HStack>
            <Text
              fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.4rem)"
              fontWeight="700"
              color="#1F2937"
            >
              Tableau de bord
            </Text>
          </HStack>

          <Text
            fontSize="clamp(1rem, 1vw + 0.8rem, 1.1rem)"
            color="gray.500"
            position="relative"
            bottom="1.4rem"
          >
            Vue d'ensemble de votre gestion de personnel
          </Text>
        </Box>

        {/* ===================================================
            MANUAL TASK REFRESH
        ==================================================== */}

        <Button
          position="relative"
          bottom="2rem"
          colorScheme="blue"
          onClick={loadTasks}
        >
          <Box>
            <IoReloadOutline />
          </Box>

          <Text ml="0.5rem" mt="1rem">
            Taches
          </Text>
        </Button>

        {/* ===================================================
            DATE / TIME
        ==================================================== */}

        <Flex
          bg="#F8F9FB"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="8px"
          boxShadow="0 2px 8px rgba(0,0,0,0.5)"
          overflow="hidden"
          align="center"
          flexWrap="wrap"
          position="relative"
          bottom="1.8rem"
        >
          <Flex px={3} py={2} align="center" gap={2}>
            <CiCalendarDate color="#0078D4" size={22} />

            <Text
              color="gray.900"
              fontSize="md"
              position="relative"
              top="0.5rem"
            >
              {new Date().toLocaleDateString("fr-FR")}
            </Text>
          </Flex>

          <Flex px={3} py={2} align="center" gap={2}>
            <CiClock2 color="#0078D4" size={22} />

            <Text
              color="gray.900"
              fontSize="md"
              position="relative"
              top="0.5rem"
            >
              {String(time.getHours()).padStart(2, "0")}:
              {String(time.getMinutes()).padStart(2, "0")}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* =====================================================
          DASHBOARD
      ====================================================== */}

      <Box>
        <EmployeeDashboard
          employeeCount={employees.length}
          attendanceCount={dailyAttendance.length}
          leaveCount={leaves.length}
          lateCount={lateCount.length}
        />
      </Box>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <Grid
        templateColumns={{
          base: "1fr",
          xl: "1.2fr 1fr",
        }}
        gap={6}
        flex="1"
        minH={0}
        overflow="hidden"
        mt={4}
      >
        {/* ===================================================
            NOTES
        ==================================================== */}

        <Box
          border="1px solid"
          borderColor="gray.500"
          borderRadius="12px"
          bg="#FFFFFF"
          p={5}
          display="flex"
          flexDir="column"
          flex={1}
          minH="18rem"
          maxH="23rem"
          mt={4}
          overflowY="auto"
          position="relative"
          left={tasks.length === 0 ? "15rem" : "0.5rem"}
        >
          <Flex align="center" gap={2} mb={3}>
            <Text
              color="#1F2937"
              fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.3rem)"
              fontWeight="600"
              position="relative"
              top="0.4rem"
            >
              Notes
            </Text>
          </Flex>

          <Textarea
            placeholder={
              "Bienvenue sur LeatherWorks.\nÉcrivez vos notes ici..."
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            bg="#091735"
            border="1px solid rgba(255,255,255,0.1)"
            _hover={{
              borderColor: "yellow.300",
            }}
            _focus={{
              borderColor: "yellow.400",
              boxShadow: "0 0 0 1px #F4C20D",
            }}
            flex="1"
            resize="none"
            color="#ffffff"
            fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.3rem)"
            fontWeight="700"
            fontFamily="system-ui"
            _placeholder={{
              color: "#6B7280",
            }}
          />

          <Button
            position="absolute"
            right="1.3rem"
            colorScheme="blue"
            width="6rem"
            height="3rem"
            onClick={handleOpenReminder}
            isDisabled={!notes.trim()}
          >
            <Box mr="0.4rem">
              <FaBell />
            </Box>
            Rappel
          </Button>
        </Box>

        {/* ===================================================
            TASKS
        ==================================================== */}

        <Box
          maxH="42vh"
          display="flex"
          flexDir="column"
          overflowY="auto"
          minH={0}
        >
          <TaskSubmissionModal
            isOpen={isCreateOpen}
            onClose={onCreateClose}
            onRefresh={handleTaskRefresh}
            adminUsersList={adminUsersList}
            author={user!}
          />

          <TaskDetailsDrawer
            task={selectedTask}
            isOpen={isDetailsOpen}
            onClose={handleTaskClosed}
            onRefresh={handleTaskRefresh}
          />

          {tasks.map((task) => (
            <Box
              key={task._id}
              mt={6}
              ml={{
                base: 0,
                xl: 8,
              }}
            >
              <TaskCard
                task={task}
                onTaskClick={handleTaskClick}
                onTaskDelete={handleTaskDelete}
              />
            </Box>
          ))}
        </Box>
      </Grid>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <Box mb={8}>
        <QuickActions onTaskCreate={handleTaskCreate} />
      </Box>

      {/* =====================================================
          REMINDER
      ====================================================== */}

      <ReminderModal
        isReminderOpen={isReminderOpen}
        onReminderClose={onReminderClose}
        notes={notes}
      />
    </Flex>
  );
};

export default EmployeeAdminPage;
