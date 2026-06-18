import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  StackDivider,
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
import { Announcement } from "../../shared/types/Announcement";
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
  const [announcement, setAnnouncement] = useState("");
  const [liveAnnouncement, setLiveAnnouncement] = useState<Announcement | null>(
    null
  );
  const [oldAnnouncements, setOldAnnouncements] = useState<Announcement[]>([]);
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
        return axios.get<Announcement[]>(`${API_URL}/announcements`);
      })

      .then((res) => {
        console.log("Retrieved old announcements: ", res.data);
        setOldAnnouncements(res.data);
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

  // useEffect to fetch live announcements from manager
  useEffect(() => {
    const unsubscribe = window.electron.tasks.onNew((data) => {
      setLiveAnnouncement(data);
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
    console.log("Announcement to be sent to Main: ", announcement);
    try {
      const sendAnnouncement =
        await window.electron.announcements.createAnnouncement({
          message: announcement,
          createdBy: `${adminUser?.firstName} ${adminUser?.lastName}`,
        });
      console.log("Announcement post results from Main: ", sendAnnouncement);
    } catch (error) {
      console.error("An error occured while creating announcement: ", error);
    }
  };

  return (
    <Flex
      direction="column"
      ml="0.3rem"
      mt="0.63rem"
      mr="0.3rem"
      w="100%"
      h="98vh"
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
        <Box position="relative" bottom="1.2rem">
          <Text fontSize="1.6rem" fontWeight="700" color="#1F2937">
            Tableau de bord
          </Text>
          <Text
            fontSize="1rem"
            fontWeight="600"
            color="#1F2937"
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
          bottom="1rem"
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
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="12px"
          boxShadow="0 2px 8px rgba(1,0,1,1)"
          bg="#FFFFFF"
          p={5}
          display="flex"
          flexDir="column"
        >
          <Flex align="center" gap={2} mb={3}>
            <Text
              color="#1F2937"
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
            bg="#091735"
            border="1px solid rgba(255,255,255,0.1)"
            _hover={{ borderColor: "yellow.300" }}
            _focus={{
              borderColor: "yellow.400",
              boxShadow: "0 0 0 1px #F4C20D",
            }}
            color="#ffffff"
            fontSize="1.3rem"
            fontWeight="700"
            fontFamily="system-ui"
            _placeholder={{
              color: "#6B7280",
            }}
          />
        </Box>

        {/* ANNOUNCEMENTS */}
        {adminUser?.role === "manager" ? (
          <Box
            bg="#F8F9FB"
            border="1px solid"
            borderColor="#D1D9E0"
            borderRadius="12px"
            boxShadow="0 2px 8px rgba(1,0,1,1)"
            p={5}
            display="flex"
            flexDir="column"
          >
            <Flex align="center" gap={2} mb={3}>
              <Text
                fontSize="1.3rem"
                fontWeight="600"
                position="relative"
                top="0.4rem"
                color="#1F2937"
              >
                Envoyer une annonce
              </Text>
            </Flex>

            <Textarea
              flex="1"
              placeholder="Faites vos annonces ici..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              resize="none"
              bg="#091735"
              border="1px solid rgba(255,255,255,0.1)"
              color="#ffffff"
              fontSize="1.2rem"
              fontWeight="600"
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
            bg="#FFFFFF"
            border="1px solid #B8C2CC"
            borderRadius="10px"
            p={5}
          >
            <Flex align="center" gap={2} mb={3}>
              <Icon as={TfiAnnouncement} color="yellow.500" fontSize="1.8rem" />
              <Text
                color="#1F2937"
                fontSize="1.3rem"
                fontWeight="600"
                position="relative"
                top="0.3rem"
                left="0.5rem "
                _hover={{ borderColor: "yellow.300" }}
                _focus={{
                  borderColor: "yellow.400",
                  boxShadow: "0 0 0 1px #F4C20D",
                }}
              >
                Messages de la direction
              </Text>
            </Flex>

            <Text color="#ffffff" fontSize="1.2rem">
              {liveAnnouncement?.message || oldAnnouncements[0]?.message}
            </Text>
          </Box>
        )}
      </Grid>
    </Flex>
  );
};

export default EmployeeAdminPage;
