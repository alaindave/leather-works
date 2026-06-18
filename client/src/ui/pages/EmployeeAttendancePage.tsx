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
import { AttendanceWithEmployee } from "../../shared/AttendanceWithEmployee";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const gridTemplate = `
  1.5fr 1.5fr 1.3fr 1.3fr 1fr 1fr 1fr
`;

  /* ================= CLOCK ================= */
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  /* ================= FETCH ================= */
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

  return (
    <Flex direction="column" ml="0.2rem" mr="0.5rem">
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
      <Flex direction="column" mt="0.7rem" bg="#F8F9FB" height="10rem">
        <Flex>
          <Box>
            <Text
              color="#1F2937"
              fontSize="1.6rem"
              fontWeight="700"
              ml="0.5rem"
              mt="0.5rem"
            >
              Présences
            </Text>
            <Text
              color="#1F2937"
              fontSize="1rem"
              fontWeight="500"
              position="relative"
              bottom="1.5rem"
              ml="0.5rem"
            >
              Gérez la liste de présence
            </Text>
          </Box>

          <Spacer />

          <Button bg="#F2B705" onClick={handleExport} mt="0.5rem" mr="0.5rem">
            <HiOutlineDownload /> Exporter
          </Button>
        </Flex>

        <Flex>
          <Box mt="0.3rem">
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
        mt="0.3rem"
        mb="0.3rem"
        height="4.7rem"
        ml="0.1rem"
        width="79vw"
        overflowY="hidden"
        overflowX="hidden"
      >
        <Text color="gray.600" fontSize="1.1rem" mt="0.7rem">
          Employé
        </Text>
        <Text color="gray.600" fontSize="1.1rem" mt="0.7rem">
          ID
        </Text>
        <Text color="gray.600" fontSize="1.1rem" mt="0.7rem">
          Poste
        </Text>
        <Text color="gray.600" fontSize="1.1rem" mt="0.7rem">
          Departement
        </Text>
        <Text color="gray.600" fontSize="1.1rem" mt="0.7rem">
          Arrivée
        </Text>
        <Text color="gray.600" fontSize="1.1rem" mt="0.7rem">
          Départ
        </Text>
        <Text color="gray.600" fontSize="1.1rem" mt="0.7rem">
          Actions
        </Text>
      </Grid>

      {/* ================= BODY ================= */}
      <Box height="90vh" width="79vw" overflowY="auto" overflowX="hidden">
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
            top="15rem"
            left="20rem"
            color="#ffffff"
            fontSize="2.1rem"
            fontWeight="500"
          >
            Pas de présence enregistrée
          </Text>
        ) : (
          attendances
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
              />
            ))
        )}
      </Box>

      {/* ================= FOOTER  ================= */}
      <Flex bg="gray.300" mb="0.4rem" height="6rem" justify="space-between">
        <Box
          mt="1rem"
          ml="1rem"
          fontSize="1.2rem"
          fontFamily="monospace"
          fontWeight="600"
        >
          <DateDropdown onChange={setSelectedDate} />
        </Box>

        <Box
          color="gray.800"
          fontSize="24px"
          fontWeight="600"
          mt="1rem"
          mr="1.3rem"
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
