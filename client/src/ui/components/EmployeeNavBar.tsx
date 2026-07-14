import {
  Box,
  Flex,
  HStack,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Button,
  List,
  ListItem,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import { FaFileSignature, FaRegClock } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { MdPersonOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import "../styles/App.css";
import Logo from "./Logo";
import useAdminUser from "../../store/auth.store";
import { ErrorBoundary } from "react-error-boundary";
import PageErrorFallback from "../pages/PageErrorFallback";
import { checkOnline } from "../services/connectivity_check.service";
import { useEffect, useState } from "react";

const EmployeeNavBar = () => {
  const adminUser = useAdminUser((store) => store.adminUser);
  const setLogOut = useAdminUser((store) => store.logout);
  const navigate = useNavigate();
  const [online, setOnline] = useState<boolean>(false);

  useEffect(() => {
    async function check() {
      const result = await checkOnline();
      setOnline(result);
    }

    check();
  }, []);
  const sidebarWidth = useBreakpointValue({
    base: "15rem",
    md: "17rem",
    lg: "18rem",
  });

  const handleLogOut = async () => {
    try {
      const logout = await window.electron.auth.logout();
      if (logout) {
        setLogOut();
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("An error occured while logging out:", error);
    }
  };

  // const isOnline = async () => {
  //   const online = await checkOnline();
  //   return online;
  // };

  return (
    <Flex
      position="relative"
      direction="column"
      height="95.1vh"
      width={sidebarWidth}
      bg="#F8F9FB"
      borderRight="1px solid"
      borderColor="#D1D9E0"
      boxShadow="2px 0 8px rgba(0,0,0,0.04)"
      borderRadius="0"
      justify="space-between"
    >
      <Flex position="relative" left="0.4rem">
        <Box padding="10px">
          <Logo text="Gestion de personnel" />
        </Box>
      </Flex>

      <Box position="relative" left="1rem">
        <List>
          <ListItem marginBottom="10px">
            <HStack position="relative" right="1.5rem">
              <NavLink className="nav-button" end to="/employees_admin">
                <HStack>
                  <Box ml="1rem">
                    <FaHome size="1.4rem" />
                  </Box>
                  <Text mt="1rem" fontSize="1.3rem">
                    Tableau de bord
                  </Text>
                </HStack>
              </NavLink>
            </HStack>
          </ListItem>

          <ListItem marginBottom="10px">
            <HStack position="relative" right="1.5rem">
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink
                  to="/employees_admin/employees_list"
                  className="nav-button"
                >
                  <HStack>
                    <Box ml="1rem">
                      <IoPeopleSharp size="1.4rem" />
                    </Box>
                    <Text mt="1rem" fontSize="1.3rem">
                      Employés
                    </Text>
                  </HStack>
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>

          <ListItem marginBottom="10px">
            <HStack position="relative" right="1.5rem">
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink
                  className="nav-button"
                  to="/employees_admin/attendances"
                >
                  <HStack>
                    <Box ml="1rem">
                      <FaRegClock size="1.4rem" />
                    </Box>
                    <Text mt="1rem" fontSize="1.3rem">
                      Présence
                    </Text>
                  </HStack>
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>

          <ListItem marginBottom="10px">
            <HStack position="relative" right="1.5rem">
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink className="nav-button" to="/employees_admin/leaves">
                  <HStack>
                    <Box ml="1rem">
                      <FaRegCalendarAlt size="1.4rem" />
                    </Box>
                    <Text mt="1rem" fontSize="1.3rem">
                      Congés
                    </Text>
                  </HStack>
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>

          <ListItem marginBottom="10px">
            <HStack position="relative" right="1.4rem">
              <NavLink className="nav-button" to="/admin">
                <HStack>
                  <Box ml="1rem">
                    <FaFileSignature size="1.4rem" />
                  </Box>
                  <Text mt="1rem" fontSize="1.3rem">
                    Fiches de paye
                  </Text>
                </HStack>
              </NavLink>
            </HStack>
          </ListItem>

          <ListItem marginBottom="10px">
            <HStack position="relative" right="1.4rem">
              <NavLink className="nav-button" to="/admin">
                <HStack>
                  <Box ml="1rem">
                    <IoStatsChartSharp size="1.4rem" />
                  </Box>
                  <Text mt="1rem" fontSize="1.3rem">
                    Rapports
                  </Text>
                </HStack>
              </NavLink>
            </HStack>
          </ListItem>

          <ListItem marginBottom="20px">
            <HStack position="relative" right="1.4rem">
              <NavLink className="nav-button" to="/admin">
                <HStack>
                  <Box ml="1rem">
                    <FaFileSignature size="1.4rem" />
                  </Box>
                  <Text mt="1rem" fontSize="1.3rem">
                    Taches
                  </Text>
                </HStack>
              </NavLink>
            </HStack>
          </ListItem>
        </List>
      </Box>

      {/* ADMIN USER AREA */}
      <Flex
        position="absolute"
        bottom="0.4rem"
        border="1px solid #E2E8F0"
        bg="gray.100"
        boxShadow="0 2px 10px rgba(15,23,42,.06)"
        borderRadius="0.5rem"
        height="3.9rem"
        width={sidebarWidth}
        justify="space-evenly"
      >
        <Flex
          height="40px"
          width="40px"
          borderWidth="2px"
          borderRadius="20px"
          bg="#ffffff"
          borderColor="blue"
          justifyContent="center"
          alignItems="center"
          ml="0.2rem"
          mt="0.5rem"
        >
          <MdPersonOutline color="blue" size="2rem" />
        </Flex>

        <Box>
          <Text
            mt="0.2rem"
            color="gray.800"
            fontSize="1rem"
            fontWeight={700}
            padding="2px"
          >
            {adminUser?.firstName} {adminUser?.lastName}
          </Text>
          <Text
            position="relative"
            bottom="1.1rem"
            color="gray.600"
            fontWeight="500"
          >
            {adminUser?.email}
          </Text>
        </Box>

        <Box position="relative" bottom="7px" width="20px">
          <Menu>
            <MenuButton
              position="relative"
              right="20px"
              background="transparent"
              color="#374151"
              _hover={{ bg: "transparent" }}
              as={Button}
              rightIcon={<IoIosArrowDown size="18px" />}
            />
            <MenuList bg="gray.500" position="relative" right="200px">
              <MenuItem bg="gray.500" _hover={{ bg: "#e68a00" }}>
                <FaUserAlt color="#ffffff" />
                <Text color="#ffffff" mt="0.8rem" ml="0.8rem">
                  Mon profil
                </Text>
              </MenuItem>

              <MenuItem bg="gray.500" _hover={{ bg: "#e68a00" }}>
                <IoSettings color="#ffffff" />
                <Text color="#ffffff" mt="0.8rem" ml="0.8rem">
                  Parametres
                </Text>
              </MenuItem>

              <MenuItem
                bg="gray.500"
                _hover={{ bg: "#e68a00" }}
                onClick={handleLogOut}
              >
                <FaSignOutAlt color="#ffffff" />
                <Text color="#ffffff" mt="0.8rem" ml="0.8rem">
                  Deconnection
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      {/*Lower bar*/}
      <Flex
        position="relative"
        top="3rem"
        width="100vw"
        height="6.5vh"
        bg="gray.200"
        justify="space-between"
      >
        <Text ml="1rem" mt="0.4rem" fontSize="1rem" color="gray.800">
          Afritan-Gestion de personnel
        </Text>

        <HStack mt="0.3rem" mr="2rem" fontSize="1rem" color="gray.600">
          <Text color="gray.800">Version 1.0.0</Text>
          <Divider orientation="vertical" h="1.3rem" borderColor="gray.500" />
          <HStack>
            <Box
              color="green.600"
              position="relative"
              left="0.4rem"
              bottom="0.4rem"
            >
              <GoDotFill size="1.3rem" />
            </Box>
            <Text color="gray.800">{online ? "Connecté" : "Deconnecté"}</Text>
          </HStack>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default EmployeeNavBar;
