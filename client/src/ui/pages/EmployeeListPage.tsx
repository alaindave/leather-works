import {
  Box,
  Flex,
  List,
  ListItem,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import type Employee from "../../../types/Employee";
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
    <VStack
      spacing={0}
      align="stretch"
      marginTop="48px"
      marginLeft="4px"
      ml="3px"
      width="83vw"
    >
      <Box position="relative" bg="#03143B" height="200px" borderRadius="20px">
        <Box marginBottom="20px">
          <Text
            color="#ffffff"
            fontSize="27px"
            fontWeight="700"
            marginLeft="15px"
            marginTop="10px"
          >
            Employés
          </Text>

          <Text
            color="#ffffff"
            fontSize="15px"
            fontWeight="500"
            position="relative"
            bottom="20px"
            marginLeft="15px"
          >
            Gérez les informations de vos employés
          </Text>
        </Box>

        <Box position="absolute" top="1px" right="1px">
          <AddEmployee onAddEmployee={handleAddEmployee} />
        </Box>

        <Box position="absolute" left="1px" bottom="1px">
          <EmployeeFilterMenu onFilterClicked={handleFilterClicked} />
        </Box>

        <Box position="absolute" right="1px" bottom="1px">
          <SearchBar onSearch={handleOnSearch} />
        </Box>
      </Box>

      <Box height="75vh" overflowY="scroll" borderRadius="20px">
        {loading ? (
          <VStack spacing={0} mt="2px">
            {[...Array(6)].map((_, index) => (
              <Flex
                key={index}
                w="100%"
                bg="#0A1F57"
                borderBottom="1px solid"
                borderColor="#1E355A"
                p={4}
                alignItems="center"
                gap={4}
              >
                <SkeletonCircle size="14" fadeDuration={0.4} />

                <Box flex="1">
                  <Skeleton
                    height="18px"
                    width="220px"
                    mb={3}
                    borderRadius="6px"
                    startColor="#132C68"
                    endColor="#1E3A7A"
                  />

                  <SkeletonText
                    noOfLines={2}
                    spacing="3"
                    skeletonHeight="12px"
                    startColor="#132C68"
                    endColor="#1E3A7A"
                  />
                </Box>
              </Flex>
            ))}
          </VStack>
        ) : (
          <List mt="2px" mb={0} position="relative" right="11px">
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
                  borderBottom="1px solid"
                  borderColor="#1E355A"
                  bg="#0A1F57"
                  mb={0}
                >
                  <EmployeeCard key={employee.employeeID} employee={employee} />
                </ListItem>
              ))}
          </List>
        )}
      </Box>

      <Box bg="#03143B" height="70px" mb="2px"></Box>
    </VStack>
  );
};

export default EmployeeListPage;
