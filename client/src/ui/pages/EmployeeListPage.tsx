import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type Employee from "../../shared/types/Employee";
import AddEmployee from "../components/AddEmployee";
import useAdminUser from "../../store/authStore";
import EmployeeCard from "../components/EmployeeCard";
import SearchBar from "../components/SearchBar";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
import { FaAddressBook } from "react-icons/fa6";
import NotAuthorized from "../components/NotAuthorized";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const adminUser = useAdminUser((store) => store.adminUser);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const toast = useToast();

  useEffect(() => {
    axios
      .get<Employee[]>(`${API_URL}/employees`)
      .then((res) => {
        setEmployees(res.data);
        console.log("Employees received: ", res.data);
      })
      .catch((error) => {
        console.error("Error while fetching employees: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
  };

  const handleOnSearch = (searchText: string) => {
    setSearchText(searchText);
  };

  const handleFilterClicked = (filter: string) => {
    setFilter(filter);
  };

  return (
    <Flex direction="column" h="100vh" bg="transparent">
      {/* HEADER */}
      <Flex
        direction="column"
        w="79.3vw"
        bg="#F8F9FB"
        height="10rem"
        mt="0.7rem"
        ml="0.3rem"
      >
        <Flex>
          <Box>
            <Text
              color="#1F2937"
              fontSize="1.6rem"
              fontWeight="700"
              ml="0.4rem"
              mt="0.2rem"
            >
              Employés
            </Text>
            <Text
              color="gray.900"
              fontSize="1rem"
              fontWeight="500"
              position="relative"
              left="0.5rem"
              bottom="1.3rem"
            >
              Gérez les informations de vos employés
            </Text>
          </Box>
          <Spacer />
          {adminUser?.role === "manager" ? (
            <Box mt="0.1rem" mr="0.2rem">
              <AddEmployee onAddEmployee={handleAddEmployee} />
            </Box>
          ) : (
            <Box position="relative" bottom="1.2rem">
              <NotAuthorized
                buttonText="Ajouter un employé"
                buttonColor="red"
                icon={FaAddressBook}
                placement="left"
                width="13rem"
              />
            </Box>
          )}
        </Flex>

        {/* ACTION ROW  */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={3}
        >
          <Flex wrap="wrap" gap={2} mt="1.35rem" ml="0.1rem">
            <EmployeeFilterMenu onFilterClicked={handleFilterClicked} />
          </Flex>

          <Flex
            wrap="wrap"
            justify={{ base: "stretch", md: "flex-end" }}
            mt="1.1rem"
            mr="0.1rem"
          >
            <SearchBar onSearch={handleOnSearch} />
          </Flex>
        </Flex>
      </Flex>

      {/* LIST AREA */}
      <Flex flex="1" overflow="hidden" bg="transparent" mt="0.3rem" ml="0.3rem">
        <Box w="100%" h="100%" overflowY="auto" borderRadius="inherit">
          {loading ? (
            <VStack spacing={0}>
              {[...Array(6)].map((_, index) => (
                <Flex
                  key={index}
                  w="100%"
                  bg="#ffffff"
                  borderBottom="1px solid #1E355A"
                  p={4}
                  align="center"
                  gap={4}
                  mb={1}
                >
                  <SkeletonCircle size="12" />

                  <Box flex="1">
                    <Skeleton
                      height="16px"
                      width="60%"
                      mb={3}
                      borderRadius="6px"
                      startColor="#132C68"
                      endColor="#1E3A7A"
                    />

                    <SkeletonText
                      noOfLines={2}
                      spacing="3"
                      skeletonHeight="10px"
                      startColor="#132C68"
                      endColor="#1E3A7A"
                    />
                  </Box>
                </Flex>
              ))}
            </VStack>
          ) : (
            <List position="relative" bottom="0.2rem" right="2rem">
              {employees
                .filter((employee) => !filter || employee.department === filter)
                .filter((employee) =>
                  `${employee.firstName} ${employee.lastName}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                )
                .map((employee) => (
                  <ListItem
                    key={employee._id}
                    bg="#ffffff"
                    borderBottom="1px solid #1E355A"
                    margin="0.1rem"
                  >
                    <EmployeeCard employee={employee} />
                  </ListItem>
                ))}
            </List>
          )}
        </Box>
      </Flex>

      {/* FOOTER SPACER  */}
      <Box h="50px" bg="black" borderRadius="10px"></Box>
    </Flex>
  );
};

export default EmployeeListPage;
