import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Spacer,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import EmployeeAttendanceCard from "../components/EmployeeAttendanceCard";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
import SearchBar from "../components/SearchBar";
import DateDropdown from "../components/DateDropdown";
import AttendanceWithEmployee from "../../shared/types/AttendanceWithEmployee";
import { FaSyncAlt } from "react-icons/fa";

/* ================= SHIMMER ================= */
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;

const Shimmer = ({ width = "100%", height = "18px" }) => (
  <Box
    borderRadius="6px"
    height={height}
    width={width}
    bg="gray.300"
    animation="shimmer 1.4s ease infinite"
  />
);

const EmployeeAttendancePage = () => {
  const [attendances, setAttendances] = useState<AttendanceWithEmployee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceWithEmployee | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const gridTemplate = `
  1.6fr 1.5fr 1.3fr 1.3fr 1fr 1fr 0.8fr
`;
  /* ================= CLOCK ================= */
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* Initial data fetch*/
  useEffect(() => {
    setLoading(true);
    console.log("Selected date:", selectedDate);
    window.electron.attendance
      .getByDate(selectedDate)
      .then((attendances: AttendanceWithEmployee[]) => {
        console.log(`Fetched attendances for ${selectedDate}`, attendances);
        setAttendances(attendances);
      })
      .catch((error) => {
        console.error(
          `An error occurred while fetching for ${selectedDate}`,
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDate]);

  //Attendance sync and refresh
  const handleAttendanceSync = async () => {
    try {
      setLoading(true);
      const result = await window.electron.sync();
      if (result.success) {
        console.log("Sync completed");
        const attendances = await window.electron.attendance.getByDate(
          selectedDate
        );
        console.log(`Fetched attendances for ${selectedDate}`, attendances);
        setAttendances(attendances);
      } else {
        console.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (attendance?._id)
        await window.electron.attendance.delete(attendance?._id);
      setAttendances((prev) =>
        prev.filter((att) => att._id !== attendance?._id)
      );
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    const csv = attendances
      .map(
        (a) =>
          `${a.firstName} ${a.lastName},${a.matricule},${a.clockIn},${a.date}`
      )
      .join("\n");

    await window.electron.file.save(csv);
  };

  //Get attendances without leaves
  // const attendancesWithoutLeaves = attendances?.filter(
  //   (a) => a.status != "CONGÉ" && a.status != "ABSENT"
  // );

  return (
    <Flex direction="column" ml="0.02rem" width="100vw" h="95.1vh" bg="#F8FAFC">
      {/* ================= ALERT DIALOG ================= */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        returnFocusOnClose={false}
      >
        <AlertDialogOverlay backdropFilter="auto" backdropBlur="0.5rem">
          <AlertDialogContent
            bg="#08162b"
            color="#ffffff"
            position="relative"
            top="180px"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer de la liste de présence
            </AlertDialogHeader>

            <AlertDialogBody>
              Etes vous sur de vouloir supprimer{" "}
              <span style={{ color: "#F2B705", fontWeight: "bold" }}>
                {" "}
                {attendance?.firstName}{" "}
              </span>
              <span style={{ color: "#F2B705", fontWeight: "bold" }}>
                {" "}
                {attendance?.lastName}{" "}
              </span>
              de la liste de présence?
            </AlertDialogBody>

            <AlertDialogFooter>
              <HStack position="relative" right="2rem">
                <Button
                  borderRadius="10px"
                  borderColor="black"
                  bg="#F2B705"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="black"
                  mr={3}
                  onClick={handleDelete}
                >
                  <HStack>
                    <Box>
                      <MdAutoDelete size="1.2rem" />
                    </Box>
                    <Text marginTop="0.9rem" fontSize="1rem">
                      {" "}
                      Supprimer
                    </Text>
                  </HStack>
                </Button>
                <Button
                  ref={cancelRef}
                  borderColor="#ffffff"
                  borderRadius="10px"
                  bg="#08162b"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="#1a000d"
                  mr={3}
                  onClick={onClose}
                >
                  <HStack>
                    <Box>
                      <RxCrossCircled color="#ffffff" size="1.2rem" />
                    </Box>
                    <Text color="#ffffff" marginTop="0.9rem" fontSize="1rem">
                      Annuler
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* ================= HEADER ================= */}
      <Flex direction="column" bg="#F8F9FB" height="10rem" width="80vw">
        <Flex>
          <Box>
            <HStack>
              <Text
                color="#1F2937"
                fontSize="clamp(1.3rem, 1vw + 0.8rem, 1.4rem)"
                fontWeight="700"
                ml="0.5rem"
                mt="0.7rem"
              >
                Présences
              </Text>
              <Button
                bg="transparent"
                isLoading={loading}
                color="gray.800"
                _hover={{ bg: "transparent" }}
                fontSize="1rem"
                position="relative"
                bottom="0.2rem"
                right="1rem"
                onClick={handleAttendanceSync}
              >
                <FaSyncAlt />
              </Button>
            </HStack>
            <Text
              fontWeight="500"
              left="0.45rem"
              fontSize="clamp(1rem, 1vw + 0.8rem, 1.1rem)"
              color="gray.500"
              position="relative"
              bottom="1.4rem"
            >
              Gérez la liste de présence
            </Text>
          </Box>

          <Spacer />

          <Button
            bg="#4F46E5"
            color="#ffffff"
            onClick={handleExport}
            mt="0.5rem"
            mr="1.3rem"
          >
            <HiOutlineDownload /> Exporter
          </Button>
        </Flex>

        <Flex>
          <Box ml="0.5rem">
            <EmployeeFilterMenu onFilterClicked={setFilter} />
          </Box>

          <Spacer />
          <Box>
            <SearchBar onSearch={setSearchText} />
          </Box>
        </Flex>
      </Flex>

      {/* ================= TABLE HEADER  ================= */}
      <Grid
        templateColumns={gridTemplate}
        px={10}
        fontWeight="600"
        bg="#F8F9FB"
        borderWidth="0.3px"
        border="1px solid #E2E8F0"
        boxShadow="0 2px 10px rgba(15,23,42,.06)"
        height="4.7rem"
        width="80vw"
        overflowY="hidden"
        overflowX="hidden"
        mt="1rem"
        ml="0.5rem"
      >
        <Text color="gray.800" fontSize="1.1rem" mt="0.7rem">
          Employé
        </Text>
        <Text color="gray.800" fontSize="1.1rem" mt="0.7rem">
          ID
        </Text>
        <Text color="gray.800" fontSize="1.1rem" mt="0.7rem">
          Poste
        </Text>
        <Text color="gray.800" fontSize="1.1rem" mt="0.7rem">
          Departement
        </Text>
        <Text color="gray.800" fontSize="1.1rem" mt="0.7rem">
          Arrivée
        </Text>
        <Text color="gray.800" fontSize="1.1rem" mt="0.7rem">
          Départ
        </Text>
        <Text color="gray.800" fontSize="1.1rem" mt="0.7rem">
          Actions
        </Text>
      </Grid>

      {/* ================= BODY ================= */}
      <Box height="90vh" overflowY="auto" overflowX="hidden">
        {loading ? (
          <>
            <Box as="style">{shimmerKeyframes}</Box>
            <VStack spacing={3}>
              {[...Array(6)].map((_, i) => (
                <Shimmer key={i} height="40px" />
              ))}
            </VStack>
          </>
        ) : attendances.length === 0 ? (
          <Text
            position="relative"
            top="12rem"
            left="20rem"
            color="gray.700"
            fontSize="2.1rem"
            fontWeight="500"
          >
            Pas de présence enregistrée
          </Text>
        ) : (
          attendances
            // .filter((a) => a.status !== "ABSENT" && a.status !== "CONGÉ")
            .filter((a) => !filter || a.department === filter)
            .filter((a) =>
              `${a.firstName} ${a.lastName}`
                .toLowerCase()
                .includes(searchText.toLowerCase())
            )
            .map((attendance) => (
              <EmployeeAttendanceCard
                key={attendance._id}
                attendance={attendance}
                gridTemplate={gridTemplate}
                onDelete={() => {
                  setAttendance(attendance);
                  onOpen();
                }}
                isUnlocked={unlocked}
                toggleOff={() => setUnlocked(false)}
              />
            ))
        )}
      </Box>

      {/* ================= FOOTER  ================= */}
      <Flex
        bg="linear-gradient(
        135deg,
        rgba(255,255,255,0.08),
        rgba(255,255,255,0.03)
      )"
        boxShadow="0 2px 8px rgba(0,0,0,0.5)"
        mr="0.15rem"
        height="6rem"
        justify="space-between"
        width="82vw"
      >
        <Box
          mt="0.6rem"
          ml="1rem"
          fontSize="1.2rem"
          fontFamily="monospace"
          fontWeight="600"
        >
          <DateDropdown onChange={setSelectedDate} />
        </Box>

        <Box mt="0.8rem">
          <Switch
            colorScheme="blue"
            size="lg"
            isChecked={unlocked}
            onChange={(e) => setUnlocked(e.target.checked)}
          />
        </Box>

        <Box
          color="gray.800"
          fontSize="24px"
          fontWeight="600"
          mt="0.6rem"
          mr="2rem"
        >
          {String(time.getHours()).padStart(2, "0")}:
          {String(time.getMinutes()).padStart(2, "0")}:
          {String(time.getSeconds()).padStart(2, "0")}
        </Box>
      </Flex>
    </Flex>
  );
};

export default EmployeeAttendancePage;
