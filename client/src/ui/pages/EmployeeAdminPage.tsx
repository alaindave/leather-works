import {
  Box,
  Button,
  Flex,
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
import AdminUser from "../AdminUser";
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
        return axios.get<Attendance[]>(`${API_URL}/attendances`);
      })
      .then((res) => {
        setAttendances(res.data);
        return axios.get<Leave[]>(`${API_URL}/leaves`);
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

  //useEffect to fetch live announcements from manager
  useEffect(() => {
    const unsubscribe = window.electron.announcements.onNew((data) => {
      setLiveAnnouncement(data);
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

  console.log("Live announcement value: ", liveAnnouncement?.message);

  return (
    <Flex
      position="relative"
      direction="column"
      justify="space-between"
      background="#03143B"
      border="1px solid rgba(255,255,255,0.12)"
      boxShadow="
      0 8px 32px rgba(0,0,0,0.35),
      inset 0 1px 1px rgba(255,255,255,0.08)
    "
      borderRadius="24px"
      height="94.3vh"
      width="90vw"
      marginTop="50px"
      marginLeft="4px"
    >
      <HStack>
        <Box>
          <Text
            color="#ffffff"
            fontSize="27px"
            fontWeight="700"
            marginLeft="15px"
            marginTop="10px"
          >
            Tableau de bord
          </Text>
          <Text
            color="#ffffff"
            fontSize="15px"
            fontWeight="500"
            position="relative"
            bottom="20px"
            marginLeft="15px"
          >
            Vue d'ensemble de votre gestion de personnel
          </Text>
        </Box>

        <HStack
          position="absolute"
          top="5px"
          right="5px"
          height="50px"
          borderWidth="0.3px"
          borderColor="gray.100"
          borderRadius="5px"
          divider={<StackDivider borderColor="gray.200" />}
        >
          <HStack width="130px">
            <Box marginLeft="6px">
              <CiCalendarDate color="#F2B705" size="25px" />
            </Box>
            <Box color="#ffffff">{new Date().toLocaleDateString("fr-FR")}</Box>
          </HStack>
          <HStack width="120px">
            <Box>
              <CiClock2 color="#F2B705" size="25px" />
            </Box>
            <Box color="#ffffff" marginLeft="18px">
              {String(time?.getHours()).padStart(2, "0")}:
              {String(time?.getMinutes()).padStart(2, "0")}
            </Box>
          </HStack>
        </HStack>
      </HStack>
      <Box marginLeft="5px" position="relative" bottom="40px">
        <EmployeeDashboard
          employeeCount={employees.length}
          attendanceCount={attendances.length}
          leaveCount={leaves.length}
          lateCount={lateCount.length}
        />
      </Box>
      {/* Personal notes text area */}
      <HStack>
        <Box
          position="relative"
          left="5px"
          bottom="80px"
          width="36vw"
          p={6}
          borderRadius="24px"
          bg="#091735"
          backdropFilter="blur(18px)"
          border="1px solid rgba(255,255,255,0.08)"
        >
          <HStack mb={4} spacing={3}>
            <Icon as={FaRegNoteSticky} color="yellow.400" boxSize={6} />
            <Text
              color="white"
              fontSize="xl"
              fontWeight="600"
              position="relative"
              top="8px"
            >
              Notes personnelles
            </Text>
          </HStack>
          <Textarea
            placeholder="Écrivez vos notes ici..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            height="280px"
            width="32vw"
            resize="none"
            bg="#091735"
            border="1px solid"
            borderColor="whiteAlpha.100"
            color="gray.200"
            fontWeight="400"
            fontSize="1.2rem"
            fontFamily="monospace"
            _placeholder={{
              color: "gray.500",
            }}
            _hover={{
              borderColor: "yellow.400",
            }}
            _focus={{
              borderColor: "yellow.400",
              boxShadow: "0 0 0 1px #F4C20D",
              bg: "rgba(255,255,255,0.05)",
            }}
          />
          {/* Show text area if admin is a manager */}
        </Box>
        {adminUser?.role === "manager" ? (
          <Box
            height="403px"
            width="38vw"
            position="relative"
            left="50px"
            bottom="77px"
            borderWidth="0.5px"
            borderRadius="24px"
            bg="#091735"
            backdropFilter="blur(18px)"
            border="1px solid rgba(255,255,255,0.08)"
          >
            <HStack
              mb={4}
              spacing={3}
              position="relative"
              left="20px"
              top="12px"
            >
              <Icon
                ml="8px"
                as={TfiAnnouncement}
                color="yellow.300"
                boxSize={6}
              />
              <Text
                position="relative"
                left="8px"
                top="3px"
                mt="12px"
                color="white"
                fontSize="xl"
                fontWeight="600"
              >
                Envoyer une annonce
              </Text>
            </HStack>
            <Box
              position="relative"
              left="25px"
              bg="#091735"
              height="280px"
              width="35vw"
              border="1px solid rgba(255,255,255,0.08)"
            >
              <Textarea
                placeholder="Faites vos annonces ici..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                height="280px"
                width="35vw"
                resize="none"
                bg="#091735"
                border="1px solid"
                borderColor="whiteAlpha.100"
                color="gray.200"
                fontWeight="400"
                fontSize="1.2rem"
                fontFamily="monospace"
                _placeholder={{
                  color: "gray.500",
                }}
                _hover={{
                  borderColor: "yellow.400",
                }}
                _focus={{
                  borderColor: "yellow.400",
                  boxShadow: "0 0 0 1px #F4C20D",
                  bg: "rgba(255,255,255,0.05)",
                }}
              />
            </Box>
            <Button
              position="absolute"
              right="0.5px"
              bottom="0.5px"
              borderRadius="10px"
              borderColor="black"
              bg="#F2B705"
              borderWidth="0.5px"
              colorScheme=" #320b01"
              color="black"
              mr={3}
              onClick={handleAnnouncementSend}
            >
              <HStack>
                <Box>
                  <FaSave />
                </Box>
                <Text position="relative" top="8px" fontSize="1rem">
                  {" "}
                  Envoyer
                </Text>
              </HStack>
            </Button>
          </Box>
        ) : (
          <Box
            height="400px"
            width="38vw"
            position="relative"
            left="50px"
            bottom="77px"
            borderWidth="0.5px"
            borderRadius="24px"
            bg="#091735"
            backdropFilter="blur(18px)"
            border="1px solid rgba(255,255,255,0.08)"
          >
            <HStack mb={4} spacing={3}>
              <Icon
                ml="8px"
                as={TfiAnnouncement}
                color="yellow.300"
                boxSize={8}
              />
              <Text
                position="relative"
                left="25px"
                top="8px"
                mt="12px"
                color="white"
                fontSize="xl"
                fontWeight="600"
              >
                Messages de la direction
              </Text>
            </HStack>
            <Box
              position="relative"
              left="25px"
              bg="#091735"
              height="280px"
              width="35vw"
              border="1px solid rgba(255,255,255,0.08)"
            >
              <Text color="gray.200" fontSize="1.2rem" fontWeight="500">
                {liveAnnouncement?.message || oldAnnouncements[0]?.message}
              </Text>
            </Box>
          </Box>
        )}
      </HStack>
    </Flex>
  );
};

export default EmployeeAdminPage;
