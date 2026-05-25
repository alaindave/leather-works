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
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import type Attendance from "../../shared/types/Attendance";
import EmployeeAttendanceCard from "../components/EmployeeAttendanceCard";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";

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
    background="linear-gradient(90deg, #0A1F57 25%, #132C68 37%, #0A1F57 63%)"
    backgroundSize="400% 100%"
    animation="shimmer 1.4s ease infinite"
  />
);

const EmployeeAttendancePage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const gridTemplate = `
    1.5fr 1.4fr 1.3fr 1.3fr 115px 115px 115px
  `;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    axios
      .get<Attendance[]>(`${API_URL}/attendances`)
      .then((res) => {
        setAttendances(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => clearInterval(interval);
  }, []);

  const handleOnSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleFilterClicked = (filter: string) => {
    setFilter(filter);
  };

  const handleDeleteClick = (attendance: Attendance) => {
    onOpen();
    setAttendance(attendance);
  };

  const handleDelete = async () => {
    axios
      .delete(`${API_URL}/attendances/${attendance?._id}`)
      .then(() => {
        setAttendances(
          attendances.filter((att) => att._id !== attendance?._id)
        );
        onClose();
      })
      .catch((error) => console.error(error));
  };

  const handleAttendanceExport = async () => {
    const attendance_csv = attendances
      .map(
        (a) =>
          `${a.employee.firstName} ${a.employee.lastName},${a.employee.employeeID},${a.clockIn},${a.date}`
      )
      .join("\n");

    try {
      const result = await window.electron.file.save(attendance_csv);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading)
    return (
      <>
        <Box as="style">{shimmerKeyframes}</Box>
        <VStack spacing={0} align="stretch" ml="3px">
          {/* HEADER */}
          <Box
            position="relative"
            top="50px"
            bg="#03143B"
            height="200px"
            borderRadius="20px"
            p={4}
          >
            <Shimmer width="220px" height="28px" />
            <Box mt={2}>
              <Shimmer width="320px" height="16px" />
            </Box>

            <Box position="absolute" top="10px" right="10px">
              <Shimmer width="140px" height="38px" />
            </Box>

            <Box position="absolute" left="10px" bottom="10px">
              <Shimmer width="180px" height="38px" />
            </Box>

            <Box position="absolute" right="10px" bottom="10px">
              <Shimmer width="250px" height="38px" />
            </Box>
          </Box>

          {/* TABLE HEADER */}
          <Grid
            templateColumns={gridTemplate}
            bg="#08162b"
            mt="52px"
            height="70px"
            ml="5px"
            alignItems="center"
            px={6}
          >
            {[...Array(7)].map((_, i) => (
              <Shimmer key={i} width="90px" height="18px" />
            ))}
          </Grid>

          {/* ROWS */}
          <Box height="90vh" width="80vw" overflow="hidden">
            {[...Array(6)].map((_, i) => (
              <Grid
                key={i}
                templateColumns={gridTemplate}
                bg="#0A1F57"
                borderBottom="1px solid #1E355A"
                alignItems="center"
                px={6}
                py={4}
              >
                <Shimmer width="160px" />
                <Shimmer width="90px" />
                <Shimmer width="120px" />
                <Shimmer width="120px" />
                <Shimmer width="90px" />
                <Shimmer width="90px" />

                <HStack spacing={3}>
                  <Shimmer width="30px" height="30px" />
                  <Shimmer width="30px" height="30px" />
                </HStack>
              </Grid>
            ))}
          </Box>

          {/* FOOTER */}
          <Flex
            bg="#08162b"
            height="120px"
            borderRadius="16px"
            justify="space-between"
            align="center"
            px={4}
          >
            <Shimmer width="260px" height="20px" />
            <Shimmer width="120px" height="20px" />
          </Flex>
        </VStack>
      </>
    );

  /* ================= NORMAL UI ================= */

  if (attendances?.length > 0 && attendance?.employee !== null)
    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay
            backdropFilter="auto"
            backdropBlur="30px"
            bgGradient="radial(circle,#47370b, #061962)"
          >
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
                  {attendance?.employee.firstName}{" "}
                </span>
                <span style={{ color: "#F2B705", fontWeight: "bold" }}>
                  {" "}
                  {attendance?.employee.lastName}{" "}
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
        <VStack spacing={0} align="stretch" ml="3px">
          {/* HEADER */}
          <Box
            position="relative"
            top="50px"
            bg="#03143B"
            height="200px"
            borderRadius="20px"
          >
            <HStack>
              <Box marginBottom="20px">
                <Text
                  color="#ffffff"
                  fontSize="27px"
                  fontWeight="700"
                  marginLeft="15px"
                  marginTop="10px"
                >
                  Présence
                </Text>
                <Text
                  color="#ffffff"
                  fontSize="15px"
                  fontWeight="500"
                  position="relative"
                  bottom="20px"
                  marginLeft="15px"
                >
                  Gérez la liste de présence
                </Text>
              </Box>

              <Button
                bg="#F2B705"
                onClick={handleAttendanceExport}
                position="absolute"
                top="10px"
                right="10px"
              >
                <HiOutlineDownload />
                Exporter
              </Button>
            </HStack>

            <Box position="absolute" left="1px" bottom="1px">
              <EmployeeFilterMenu onFilterClicked={handleFilterClicked} />
            </Box>

            <Box position="absolute" right="1px" bottom="1px">
              <SearchBar onSearch={handleOnSearch} />
            </Box>
          </Box>

          {/* TABLE HEADER */}
          <Grid
            templateColumns={gridTemplate}
            px={10}
            bg="gray.400"
            fontWeight="600"
            background="#08162b"
            overflowX="auto"
            mt="52px"
            height="70px"
            marginLeft="5px"
          >
            <Text
              color="#d6b65c"
              fontSize="18px"
              marginTop="12px"
              position="relative"
              right="28px"
            >
              Employé
            </Text>
            <Text
              color="#d6b65c"
              fontSize="18px"
              marginTop="12px"
              position="relative"
            >
              ID
            </Text>
            <Text
              fontSize="18px"
              color="#d6b65c"
              marginTop="12px"
              position="relative"
            >
              Poste
            </Text>
            <Text
              fontSize="18px"
              color="#d6b65c"
              marginTop="12px"
              position="relative"
            >
              Departement
            </Text>
            <Text
              fontSize="18px"
              color="#d6b65c"
              marginTop="12px"
              position="relative"
              left="18px"
            >
              Arrivée
            </Text>
            <Text
              fontSize="18px"
              color="#d6b65c"
              marginTop="12px"
              position="relative"
              left="22px"
            >
              Départ
            </Text>
            <Text
              fontSize="18px"
              color="#d6b65c"
              marginTop="12px"
              position="relative"
              left="22px"
            >
              Actions
            </Text>
          </Grid>

          {/* ROWS */}
          <Box
            mt={0.5}
            mb={0.8}
            height="90vh"
            width="80vw"
            overflowX="auto"
            overflowY="auto"
          >
            {attendances
              .filter(
                (attendance) =>
                  !filter || attendance.employee.department === filter
              )
              .filter((attendance) =>
                `${attendance.employee.firstName} ${
                  attendance.employee.lastName
                } ${" "} ${" "}`
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              )
              .map((attendance) => (
                <EmployeeAttendanceCard
                  key={attendance._id}
                  attendance={attendance}
                  gridTemplate={gridTemplate}
                  onDelete={() => handleDeleteClick(attendance)}
                />
              ))}
          </Box>

          {/* FOOTER */}
          <Flex
            bg="#08162b"
            mb="3px"
            height="120px"
            borderRadius="16px"
            justify="space-between"
          >
            <Text
              color="#F2B705"
              fontSize="1.5rem"
              fontFamily="monospace"
              fontWeight="600"
              position="relative"
              top="22px"
              marginLeft="12px"
            >
              Présence du {new Date().toLocaleDateString("fr-FR")}
            </Text>
            <Box
              color="#F2B705"
              fontSize="24px"
              fontWeight="600"
              position="relative"
              top="25px"
              marginRight="12px"
            >
              {String(time.getHours()).padStart(2, "0")}:
              {String(time.getMinutes()).padStart(2, "0")}:
              {String(time.getSeconds()).padStart(2, "0")}
            </Box>
          </Flex>
        </VStack>
      </>
    );
  // no attendance to show
  else
    return (
      <Text
        fontSize="35px"
        fontStyle="revert"
        fontWeight="600"
        color="gray.200"
        position="relative"
        top="350px"
        left="200px"
      >
        Pas de présence enregistrée aujourd'hui.
      </Text>
    );
};

export default EmployeeAttendancePage;
