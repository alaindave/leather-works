import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  Button,
  background,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import { FaFileSignature, FaRegClock } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { MdPersonOutline } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// @ts-ignore
import "../styles/App.css";
import Logo from "./Logo";
import useAdminUser from "../../store/authStore";

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
      marginTop="10px"
      marginLeft="2px"
      padding="8px"
      height="98vh"
      width="17.5rem"
      bg="#FFFFFF"
      borderRight="1px solid"
      borderColor="#D1D9E0"
      boxShadow="2px 0 8px rgba(0,0,0,0.04)"
      borderRadius="0"
    >
      <Box borderBottom="1px solid" borderColor="#D1D9E0" pb="0.1rem" mb={4}>
        <Logo text="Gestion de personnel" />
      </Box>
      <Box position="relative" top="2rem">
        <List>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              {" "}
              <FaHome size="1.5rem" color="#0078D4" />
              <NavLink className="nav-button" end to="/employees_admin">
                Tableau de bord
              </NavLink>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              <IoPeopleSharp size="1.5rem" color="#0078D4" />
              <NavLink
                className="nav-button"
                to="/employees_admin/employees_list"
              >
                Employés
              </NavLink>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              <FaRegClock size="1.5rem" color="#0078D4" />
              <NavLink className="nav-button" to="/employees_admin/attendances">
                Présence
              </NavLink>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="1.5rem">
              <FaRegCalendarAlt size="1.5rem" color="#0078D4" />
              <NavLink className="nav-button" to="/employees_admin/leaves">
                Congés
              </NavLink>
            </HStack>
          </ListItem>

          <ListItem marginBottom="40px">
            <HStack position="relative" right="30px">
              <FaFileSignature size="1.5rem" color="#0078D4" />
              <NavLink className="nav-button" to="/admin">
                Fiches de paye
              </NavLink>
            </HStack>
          </ListItem>
        </List>
      </Box>
      {/* Admin user  */}
      <Flex
        borderWidth="0.2px"
        borderColor="gray"
        borderRadius="15px"
        position="absolute"
        left="0.1rem"
        bottom="0.1rem"
        height="60px"
        width="277px"
        right="7px"
        justify="space-evenly"
      >
        <Flex
          height="40px"
          width="40px"
          borderWidth="0.5px"
          borderRadius="20px"
          bg="#E5F1FB"
          borderColor="#0078D4"
          position="relative"
          top="8px"
          justifyContent="center"
          alignItems="center"
        >
          <MdPersonOutline
            color={adminUser?.role === "manager" ? "yellow" : "#0078D4"}
            size="22px"
          />
        </Flex>
        <Box position="relative" left="0.5rem" bottom="1rem">
          <Text
            color="#1F2937"
            fontWeight={700}
            position="relative"
            top="1rem"
            padding="2px"
          >
            {adminUser?.firstName} {adminUser?.lastName}
          </Text>
          <Text color="#1F2937">{adminUser?.email}</Text>
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
    </Flex>
  );
};

export default EmployeeNavBar;
