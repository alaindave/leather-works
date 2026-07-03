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
import { useEffect, useState } from "react";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
import type Attendance from "../../shared/types/Attendance";
import type Employee from "../../shared/types/Employee";
import type Leave from "../../shared/types/Leave";
import useAdminUser from "../../store/auth.store";
import EmployeeDashboard from "../components/EmployeeDashboard";
import TaskSubmissionModal from "../components/TaskSubmissionModal";
import AdminUser from "../../shared/types/AdminUser";
import TaskCard from "../components/TaskCard";
import QuickActions from "../components/QuickActions";
import TaskDetailsDrawer from "../components/TaskDetailsDrawer";
import Task from "../../shared/types/Task";
import useTaskStore from "../../store/task.store";
import { FaSyncAlt } from "react-icons/fa";

const EmployeeAdminPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);
  const [time, setTime] = useState<Date>(new Date());
  const user = useAdminUser((store) => store.adminUser);
  const saveNotes = useAdminUser((store) => store.saveNotes);
  // const loadTasks = useTaskStore((store) => store.loadTasks);
  const loadTopTasks = useTaskStore((store) => store.loadTopTasks);
  const deleteTask = useTaskStore((store) => store.deleteTask);
  const tasks = useTaskStore((store) => store.tasks);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(user.notes);

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

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const lateCount = attendances.filter(
    (attendance) => attendance.status === "retard"
  );

  //useEffect for initial data fetch and live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10000);

    window.electron.employees
      .getAll()
      .then((employees) => {
        setEmployees(employees);
        return window.electron.attendance.getByDate(
          new Date().toISOString().split("T")[0]
        );
      })
      .then((attendance) => {
        setAttendances(attendance);
        return window.electron.leave.getOngoingLeaves();
      })
      .then((leaves) => {
        setLeaves(leaves);
        return window.electron.adminUsers.getAll();
      })
      .then((adminUsers) => {
        console.log("Retrieved admin users: ", adminUsers);
        setAdminUsersList(adminUsers);
        return loadTopTasks(user._id);
      })
      .catch((error) => {
        console.error("An error occured while retrieving data:", error);
      });

    return () => clearInterval(interval);
  }, [loading]);

  //useEffect for personal notes saving
  useEffect(() => {
    if (!notes?.trim()) return;
    if (notes === user.notes) return;

    const timeout = setTimeout(() => {
      handleNotesSubmission();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [notes]);

  //useEffect to fetch live tasks
  // useEffect(() => {
  //   const unsubscribe = window.electron.tasks.onNew((task) => {
  //     setTasks([...tasks, task]);
  //     console.log("Live tasks: ", task);
  //   });

  //   return () => unsubscribe();
  // }, []);

  //Handle task create

  const handleTaskCreate = () => {
    console.log("Task create clicked");
    onCreateOpen();
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    onDetailsOpen();
  };

  const handleTaskDelete = async (_id: string) => {
    console.log("ID to delete,", _id);
    try {
      const deletedTask = await deleteTask(_id);
      console.log("Deleted task: ", deletedTask);
    } catch (e) {
      console.error("An error occured while deleting the task.", e);
    }
  };

  //refresh tasks
  const handleTaskRefresh = async () => {
    try {
      await loadTopTasks(user._id);
    } catch (error) {
      console.log("An error occured while refreshing tasks:", error);
    }
  };

  //Submit personal notes
  const handleNotesSubmission = () => {
    window.electron.offlineUsers
      .saveNotes(user._id, notes)
      .then((res) => {
        console.log("Notes successfully saved: ", res);
        setNotes(notes);
        saveNotes(notes);
      })
      .catch((error) =>
        console.error("An error occured while saving notes: ", error)
      );
  };

  return (
    <Flex
      direction="column"
      ml="0.3rem"
      mt="0.5rem"
      mr="0.3rem"
      w="100%"
      minH="94vh"
      bg="#F8F9FB"
      border="1px solid"
      borderColor="#D1D9E0"
      overflow="hidden"
      p={{ base: 3, md: 6 }}
    >
      {/* HEADER */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        flexDir={{ base: "column", md: "row" }}
        gap={3}
      >
        <Box position="relative" bottom="1rem">
          <HStack>
            <Text
              fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.4rem)"
              fontWeight="700"
              color="#1F2937"
            >
              Tableau de bord
            </Text>
            <Button
              bg="transparent"
              isLoading={loading}
              color="gray.800"
              _hover={{ bg: "transparent" }}
              fontSize="1rem"
              position="relative"
              bottom="0.5rem"
              right="1rem"
              onClick={() => setLoading(true)}
            >
              <FaSyncAlt />
            </Button>
          </HStack>
          <Text
            fontSize="clamp(1rem, 1vw + 0.8rem, 1.1rem)"
            color="gray.700"
            position="relative"
            bottom="1.4rem"
          >
            Vue d'ensemble de votre gestion de personnel
          </Text>
        </Box>

        {/* DATE / TIME */}
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

      {/* DASHBOARD */}
      <Box>
        <EmployeeDashboard
          employeeCount={employees.length}
          attendanceCount={attendances.length}
          leaveCount={leaves.length}
          lateCount={lateCount.length}
        />
      </Box>

      {/* MAIN GRID */}
      <Grid
        templateColumns={{ base: "1fr", xl: "1.2fr 1fr" }}
        gap={6}
        flex="1"
        minH={0}
        overflow="hidden"
        mt={4}
      >
        {/* NOTES */}
        <Box
          border="1px solid"
          borderColor="#D1D9E0"
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
            _hover={{ borderColor: "yellow.300" }}
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
            right="0.5rem"
            colorScheme="blue"
            width="5rem"
            height="3rem"
          >
            Rappel
          </Button>
        </Box>
        <Box display="flex" flexDir="column" overflowY="auto" minH={0}>
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
            onClose={onDetailsClose}
            onRefresh={handleTaskRefresh}
          />

          {tasks.map((task) => (
            <Box key={task._id} mt={6} ml={{ base: 0, xl: 8 }}>
              <TaskCard
                task={task}
                onTaskClick={handleTaskClick}
                onTaskDelete={handleTaskDelete}
              />
            </Box>
          ))}
        </Box>
      </Grid>
      <Box mb={7}>
        <QuickActions onTaskCreate={handleTaskCreate} />
      </Box>
    </Flex>
  );
};

export default EmployeeAdminPage;
