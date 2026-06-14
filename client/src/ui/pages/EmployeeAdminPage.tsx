import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
import { FaSave } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import { TfiAnnouncement } from "react-icons/tfi";
import useAdminUser from "../../store/authStore";
import { Task } from "../../shared/types/Task";
import type Attendance from "../../shared/types/Attendance";
import type Employee from "../../shared/types/Employee";
import type Leave from "../../shared/types/Leave";
import AdminUser from "../../shared/types/AdminUser";
import EmployeeDashboard from "../components/EmployeeDashboard";

const EmployeeAdminPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [time, setTime] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [task, setTask] = useState("");
  const [liveTask, setLiveTask] = useState<Task | null>(null);
  const [oldTasks, setOldTasks] = useState<Task[]>([]);
  const adminUser = useAdminUser((store) => store.adminUser);

  const lateCount = attendances.filter(
    (attendance) => attendance.status === "retard"
  );

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  //useEffect for initial data fetch and live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10000);

    axios
      .get<Employee[]>(`${API_URL}/employees`)
      .then((res) => {
        setEmployees(res.data);
        return axios.get<Attendance[]>(`${API_URL}/attendances`, {
          params: { date: new Date().toISOString().split("T")[0] },
        });
      })
      .then((res) => {
        setAttendances(res.data);
        return axios.get<Leave[]>(`${API_URL}/leaves/ongoing`);
      })
      .then((res) => {
        setLeaves(res.data);
        return axios.get<AdminUser>(`${API_URL}/adminUsers/${adminUser?._id}`);
      })
      .then((res) => {
        console.log("Retrieved admin user: ", res.data);
        setNotes(res.data.notes);
        return axios.get<Task[]>(`${API_URL}/tasks`);
      })

      .then((res) => {
        console.log("Retrieved old tasks: ", res.data);
        setOldTasks(res.data);
      })

      .catch((error) => {
        console.error("An error occured while retrieving data:", error);
      });

    return () => clearInterval(interval);
  }, []);

  //useEffect for personal notes saving
  useEffect(() => {
    if (!notes?.trim()) return;

    const timeout = setTimeout(() => {
      handleNotesSubmission();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [notes]);

  //useEffect to fetch live tasks from manager
  useEffect(() => {
    const unsubscribe = window.electron.tasks.onNew((data) => {
      setLiveTask(data);
      console.log("Live announcement fetched: ", data.message);
    });

    return () => unsubscribe();
  }, []);

  //Submit personal notes
  const handleNotesSubmission = () => {
    console.log("Notes to submit:", notes);
    axios
      .put(`${API_URL}/adminUsers/${adminUser?._id}`, {
        notes,
      })
      .then((res) => console.log("Notes successfully saved: ", res.data))
      .catch((error) =>
        console.error("An error occured while saving notes: ", error)
      );
  };

  //Send announcements from manager
  const handleAnnouncementSend = async () => {
    console.log("Announcement to be sent to Main: ", task);
    try {
      const sendTask = await window.electron.tasks.createTask({
        author: `${adminUser?.firstName} ${adminUser?.lastName}`,
        message: task,
      });
      console.log("Task post results from Main: ", sendTask);
    } catch (error) {
      console.error("An error occured while creating task: ", error);
    }
  };

  return (
    <Flex
      direction="column"
      ml="0.3rem"
      mt="0.5rem"
      mr="0.3rem"
      w="100%"
      h="98vh"
      bg="#03143B"
      border="1px solid rgba(255,255,255,0.12)"
      boxShadow="0 8px 32px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.08)"
      borderRadius={{ base: "0", md: "24px" }}
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
        <Box>
          <Text
            fontSize={{ base: "20px", md: "27px" }}
            fontWeight="700"
            color="white"
          >
            Tableau de bord
          </Text>
          <Text
            fontSize={{ base: "13px", md: "15px" }}
            color="whiteAlpha.800"
            position="relative"
            bottom="1rem"
          >
            Vue d'ensemble de votre gestion de personnel
          </Text>
        </Box>

        {/* DATE / TIME */}
        <Flex
          border="1px solid rgba(255,255,255,0.12)"
          borderRadius="10px"
          overflow="hidden"
          align="center"
          flexWrap="wrap"
          position="relative"
          bottom="1rem"
        >
          <Flex px={3} py={2} align="center" gap={2}>
            <CiCalendarDate color="#F2B705" size={22} />
            <Text
              color="gray.200"
              fontSize="md"
              position="relative"
              top="0.5rem"
            >
              {new Date().toLocaleDateString("fr-FR")}
            </Text>
          </Flex>

          <Flex px={3} py={2} align="center" gap={2}>
            <CiClock2 color="#F2B705" size={22} />
            <Text
              color="gray.200"
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
      <Box mt={4}>
        <EmployeeDashboard
          employeeCount={employees.length}
          attendanceCount={attendances.length}
          leaveCount={leaves.length}
          lateCount={lateCount.length}
        />
      </Box>

      {/* MAIN GRID */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={6}
        mt={6}
        flex="1"
        overflow="auto"
      >
        {/* NOTES */}
        <Box
          bg="#091735"
          border="1px solid rgba(255,255,255,0.08)"
          borderRadius="20px"
          p={5}
          display="flex"
          flexDir="column"
        >
          <Flex align="center" gap={2} mb={3}>
            <Icon as={FaRegNoteSticky} color="yellow.400" fontSize="lg" />
            <Text
              color="white"
              fontSize="1.3rem"
              fontWeight="600"
              position="relative"
              top="0.4rem"
            >
              Notes personnelles
            </Text>
          </Flex>

          <Textarea
            flex="1"
            placeholder="Écrivez vos notes ici..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            resize="none"
            bg="#091735"
            border="1px solid rgba(255,255,255,0.1)"
            color="#ffffff"
            fontSize="1.3rem"
            fontFamily="revert-layer"
            _focus={{
              borderColor: "yellow.400",
              boxShadow: "0 0 0 1px #F4C20D",
            }}
            _hover={{ borderColor: "yellow.300" }}
          />
        </Box>

        {/* ANNOUNCEMENTS */}
        {adminUser?.role === "manager" ? (
          <Box
            bg="#091735"
            border="1px solid rgba(255,255,255,0.08)"
            borderRadius="20px"
            p={5}
            display="flex"
            flexDir="column"
          >
            <Flex align="center" gap={2} mb={3}>
              <Icon as={TfiAnnouncement} color="yellow.300" />
              <Text
                color="gray.200"
                fontSize="1.2rem"
                fontWeight="600"
                position="relative"
                top="0.4rem"
              >
                Envoyer une annonce
              </Text>
            </Flex>

            <Textarea
              flex="1"
              placeholder="Faites vos annonces ici..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              resize="none"
              bg="#091735"
              border="1px solid rgba(255,255,255,0.1)"
              color="#ffffff"
              fontSize="1.3rem"
              fontFamily="revert-layer"
              _placeholder={{ fontSize: "1rem" }}
              _hover={{ borderColor: "yellow.300" }}
              _focus={{
                borderColor: "yellow.400",
                boxShadow: "0 0 0 1px #F4C20D",
              }}
            />

            <Button
              mt={4}
              alignSelf="flex-end"
              bg="#F2B705"
              color="black"
              onClick={handleAnnouncementSend}
            >
              <FaSave style={{ marginRight: 8 }} />
              Envoyer
            </Button>
          </Box>
        ) : (
          <Box
            bg="#091735"
            border="1px solid rgba(255,255,255,0.08)"
            borderRadius="20px"
            p={5}
          >
            <Flex align="center" gap={2} mb={3}>
              <Icon as={TfiAnnouncement} color="yellow.300" fontSize="lg" />
              <Text
                color="white"
                fontSize="1.3rem"
                fontWeight="600"
                position="relative"
                top="0.5rem"
              >
                Messages de la direction
              </Text>
            </Flex>

            <Text color="#ffffff" fontSize="1.2rem">
              {liveTask?.message || oldTasks[0]?.message}
            </Text>
          </Box>
        )}
      </Grid>
    </Flex>
  );
};

export default EmployeeAdminPage;
