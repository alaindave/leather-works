import {
  Box,
  Button,
  Flex,
  HStack,
  List,
  ListItem,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaAddressBook } from "react-icons/fa6";
import type Employee from "../../shared/types/Employee";
import useAdminUser from "../../store/auth.store";
import AddEmployee from "../components/AddEmployee";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
import NotAuthorized from "../components/NotAuthorized";
import SearchBar from "../components/SearchBar";
import { FaSyncAlt } from "react-icons/fa";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const adminUser = useAdminUser((store) => store.adminUser);

  //Initial data fetch
  useEffect(() => {
    window.electron.employees
      .getAll()
      .then((employees) => {
        setEmployees(employees);
        console.log("Employees fetched: ", employees);
      })
      .catch((error) =>
        console.error(
          "An error occured while fetching employees from sqlite DB",
          error
        )
      )
      .finally(() => {
        setLoading(false);
      });
  }, []);
  //Employee sync and refresh
  const handleEmployeeSync = async () => {
    try {
      setLoading(true);
      const result = await window.electron.sync();
      if (result.success) {
        console.log("Sync completed");
        const employees = await window.electron.employees.getAll();
        setEmployees(employees);
        console.log("Fetched synced employees:", employees);
      } else {
        console.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
        w="79vw"
        bg="#F8F9FB"
        height="10rem"
        mt="0.5rem"
        ml="0.2rem"
      >
        <Flex>
          <Box>
            <HStack>
              <Text
                color="#1F2937"
                fontSize="1.6rem"
                fontWeight="700"
                mt="0.4rem"
                ml="0.4rem"
              >
                Employés
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
                onClick={handleEmployeeSync}
              >
                <FaSyncAlt />
              </Button>
            </HStack>
            <Text
              fontWeight="500"
              left="0.45rem"
              fontSize="clamp(1rem, 1vw + 0.8rem, 1.1rem)"
              color="gray.700"
              position="relative"
              bottom="1.4rem"
            >
              Gérez les informations de vos employés
            </Text>
          </Box>
          <Spacer />
          {adminUser?.role === "manager" ? (
            <Box mt="0.75rem" mr="0.5rem">
              <AddEmployee onAddEmployee={handleAddEmployee} />
            </Box>
          ) : (
            <Box mt="0.1rem" mr="1rem">
              <NotAuthorized
                buttonText="Ajouter un employé"
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
          <Flex wrap="wrap" gap={2} mt="1.1rem">
            <EmployeeFilterMenu onFilterClicked={handleFilterClicked} />
          </Flex>

          <Flex
            position="relative"
            left="1.1rem"
            wrap="wrap"
            mt="0.8rem"
            mr="1.2rem"
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
            <List position="relative" bottom="0.2rem" right="2.2rem">
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
      <Box
        h="2.5rem"
        bg="black"
        borderRadius="12px"
        ml="0.2rem"
        mb="0.5rem"
      ></Box>
    </Flex>
  );
};

export default EmployeeListPage;
