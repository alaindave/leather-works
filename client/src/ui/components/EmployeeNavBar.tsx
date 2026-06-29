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
import SyncButton from "./SyncButton";
// @ts-ignore
import "../styles/App.css";
import Logo from "./Logo";
import useAdminUser from "../../store/authStore";
import { ErrorBoundary } from "react-error-boundary";
import PageErrorFallback from "../pages/PageErrorFallback";

const EmployeeNavBar = () => {
  const adminUser = useAdminUser((store) => store.adminUser);
  const setLogOut = useAdminUser((store) => store.logout);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    console.log("Log out initiated...");
    try {
      const logout = await window.electron.auth.logout();
      console.log("Result from main process log out request:", logout);
      if (logout) {
        setLogOut();
        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("An error occured while logging out:", error);
    }
  };

  return (
    <Flex
      position="relative"
      direction="column"
      mt="0.5rem"
      padding="8px"
      height="94vh"
      width="19.3rem"
      bg="#FFFFFF"
      borderRight="1px solid"
      borderColor="#D1D9E0"
      boxShadow="2px 0 8px rgba(0,0,0,0.04)"
      borderRadius="0"
      justify="space-between"
    >
      <Flex position="relative" left="0.4rem">
        <Box padding="10px" position="relative" bottom="0.8rem" right="0.5rem">
          <Logo text="Gestion de personnel" />
        </Box>

        <Box position="relative" left="0.4rem" top="0.7rem">
          <SyncButton />
        </Box>
      </Flex>
      <Box position="relative" left="1rem">
        <List>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              {" "}
              <FaHome size="1.7rem" />
              <NavLink className="nav-button" end to="/employees_admin">
                Tableau de bord
              </NavLink>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              <IoPeopleSharp size="1.5rem" />
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink
                  to="/employees_admin/employees_list"
                  className="nav-button"
                >
                  Employés
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              <FaRegClock size="1.5rem" />
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink
                  className="nav-button"
                  to="/employees_admin/attendances"
                >
                  Présence
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              <FaRegCalendarAlt size="1.5rem" />
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink className="nav-button" to="/employees_admin/leaves">
                  Congés
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>

          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.4rem">
              <FaFileSignature size="1.5rem" />
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink className="nav-button" to="/admin">
                  Fiches de paye
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.4rem">
              <IoStatsChartSharp size="1.5rem" />
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink className="nav-button" to="/admin">
                  Rapports
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.4rem">
              <FaFileSignature size="1.5rem" />
              <ErrorBoundary FallbackComponent={PageErrorFallback}>
                <NavLink className="nav-button" to="/admin">
                  Parametres
                </NavLink>
              </ErrorBoundary>
            </HStack>
          </ListItem>
        </List>
      </Box>
      {/* Admin user  */}
      <Flex
        borderWidth="2.5px"
        borderColor="gray.900"
        borderRadius="0.1rem"
        position="absolute"
        left="0.001rem"
        bottom="0.001rem"
        height="3.9rem"
        width="19.4rem"
        right="7px"
        justify="space-evenly"
      >
        <Flex
          height="40px"
          width="40px"
          borderWidth="2px"
          borderRadius="20px"
          bg="#ffffff"
          borderColor="blue"
          position="relative"
          top="0.4rem"
          justifyContent="center"
          alignItems="center"
          ml="0.2rem"
        >
          <MdPersonOutline
            color={adminUser?.role === "manager" ? "blue" : "#0078D4"}
            size="2rem"
          />
        </Flex>
        <Box position="relative" left="0.5rem" bottom="1rem">
          <Text
            color="gray.800"
            fontSize="1rem"
            fontWeight={700}
            position="relative"
            top="1rem"
            padding="2px"
          >
            {adminUser?.firstName} {adminUser?.lastName}
          </Text>
          <Text color="gray.700" fontWeight="500">
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
            <MenuList bg="#08162b" position="relative" right="200px">
              <MenuItem
                bg="#08162b"
                _hover={{
                  background: "transparent",
                  color: "#F2B705",
                }}
              >
                <FaUserAlt color="#C7D2FE" />

                <Text
                  _hover={{
                    bg: "transparent",
                    color: "#f2b705",
                  }}
                  position="relative"
                  left="12px"
                  top="8px"
                  color="#ffffff"
                >
                  Mon profil
                </Text>
              </MenuItem>
              <MenuItem
                bg="#08162b"
                _hover={{
                  background: "transparent",
                  color: "#F2B705",
                }}
              >
                <IoSettings color="#C7D2FE" />
                <Text
                  _hover={{
                    bg: "transparent",
                    color: "#f2b705",
                  }}
                  position="relative"
                  left="12px"
                  top="8px"
                  color="#ffffff"
                >
                  Parametres
                </Text>
              </MenuItem>
              <MenuItem
                bg="transparent"
                color="#f2b705"
                borderRadius="12px"
                _hover={{
                  bg: "transparent",
                }}
                onClick={handleLogOut}
              >
                <FaSignOutAlt color="#C7D2FE" />
                <Text
                  _hover={{
                    bg: "transparent",
                    color: "#f2b705",
                  }}
                  position="relative"
                  left="12px"
                  top="8px"
                  color="#ffffff"
                >
                  Deconnection
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Flex
        position="relative"
        top="4rem"
        right="0.15rem"
        width="100vw"
        height="6vh"
        bg="gray.200"
        justify="space-between"
      >
        <Text ml="1rem" mt="0.6rem" fontSize="1rem" color="gray.600">
          Afritan-Gestion de personnel
        </Text>
        <HStack mr="2rem" mt="0.6rem" fontSize="1rem" color="gray.600">
          <Text>Version 1.0.0</Text>
          <Divider
            orientation="vertical"
            h="1.3rem"
            borderColor="gray.500"
            borderWidth="1px"
            position="relative"
            bottom="0.3rem"
          />
          <HStack>
            <Box
              color="green.400"
              position="relative"
              left="0.4rem"
              bottom="0.4rem"
            >
              <GoDotFill size="1.3rem" />
            </Box>
            <Text>Connecté</Text>
          </HStack>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default EmployeeNavBar;
