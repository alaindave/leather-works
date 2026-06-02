import {
  Box,
  Flex,
  List,
  ListItem,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type Employee from "../../shared/types/Employee";
import AddEmployee from "../components/AddEmployee";
import EmployeeCard from "../components/EmployeeCard";
import SearchBar from "../components/SearchBar";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    <Flex
      direction="column"
      w="100%"
      h="100vh"
      bg="transparent"
      px={{ base: 2, md: 4 }}
      py={4}
    >
      {/* HEADER */}
      <Flex
        direction="column"
        bg="#03143B"
        height="10rem"
        borderRadius={{ base: "12px", md: "20px" }}
        p={{ base: 3, md: 5 }}
      >
        <Flex>
          <Box position="relative" bottom="0.8rem">
            <Text
              color="white"
              fontSize={{ base: "20px", md: "27px" }}
              fontWeight="700"
            >
              Employés
            </Text>
            <Text
              color="whiteAlpha.800"
              fontSize={{ base: "13px", md: "15px" }}
              position="relative"
              bottom="1rem"
            >
              Gérez les informations de vos employés
            </Text>
          </Box>
          <Spacer />

          <Box position="relative" left="0.5rem" bottom="0.6rem">
            <AddEmployee onAddEmployee={handleAddEmployee} />
          </Box>
        </Flex>

        {/* ACTION ROW  */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={3}
        >
          <Flex wrap="wrap" gap={2} mt="0.3rem">
            <EmployeeFilterMenu onFilterClicked={handleFilterClicked} />
          </Flex>

          <Flex
            wrap="wrap"
            gap={2}
            justify={{ base: "stretch", md: "flex-end" }}
          >
            <SearchBar onSearch={handleOnSearch} />
          </Flex>
        </Flex>
      </Flex>

      {/* LIST AREA */}
      <Flex
        mt={4}
        flex="1"
        overflow="hidden"
        borderRadius={{ base: "12px", md: "20px" }}
        bg="transparent"
      >
        <Box w="100%" h="100%" overflowY="auto" borderRadius="inherit">
          {loading ? (
            <VStack spacing={0}>
              {[...Array(6)].map((_, index) => (
                <Flex
                  key={index}
                  w="100%"
                  bg="#0A1F57"
                  borderBottom="1px solid #1E355A"
                  p={4}
                  align="center"
                  gap={4}
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
            <List spacing={0} position="relative" right="1.5rem">
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
                    bg="#0A1F57"
                    borderBottom="1px solid #1E355A"
                  >
                    <EmployeeCard employee={employee} />
                  </ListItem>
                ))}
            </List>
          )}
        </Box>
      </Flex>

      {/* FOOTER SPACER  */}
      <Box h="50px" bg="#03143B" borderRadius="10px"></Box>
    </Flex>
  );
};

export default EmployeeListPage;
