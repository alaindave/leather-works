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
      border="none"
      marginTop="10px"
      marginLeft="2px"
      borderRadius="20px"
      padding="8px"
      background="#03143B"
      height="97vh"
      width="17.5rem"
    >
      <Box padding="10px" position="relative" right="13px">
        <Logo text="Gestion de personnel" />
      </Box>
      <Box className="nav-list">
        <List>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="30px">
              <FaHome size="1.8rem" color="#C7D2FE" />
              <NavLink className="nav-button" end to="/employees_admin">
                Tableau de bord
              </NavLink>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="30px">
              <IoPeopleSharp size="1.8rem" color="#C7D2FE" />
              <NavLink
                className="nav-button"
                to="/employees_admin/employees_list"
              >
                Employés
              </NavLink>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="30px">
              <FaRegClock size="1.8rem" color="#C7D2FE" />
              <NavLink className="nav-button" to="/employees_admin/attendances">
                Présence
              </NavLink>
            </HStack>
          </ListItem>
          <ListItem marginBottom="40px">
            <HStack position="relative" right="30px">
              <FaRegCalendarAlt size="1.8rem" color="#C7D2FE" />
              <NavLink className="nav-button" to="/employees_admin/leaves">
                Congés
              </NavLink>
            </HStack>
          </ListItem>

          <ListItem marginBottom="40px">
            <HStack position="relative" right="30px">
              <FaFileSignature size="1.8rem" color="#C7D2FE" />
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
          bg="#0b1e3a"
          borderColor="#A9B4C2"
          position="relative"
          top="8px"
          justifyContent="center"
          alignItems="center"
        >
          <MdPersonOutline
            color={adminUser?.role === "manager" ? "yellow" : "#ffffff"}
            size="25px"
          />
        </Flex>
        <Box position="relative" left="8px" bottom="16px">
          <Text
            color="#ffffff"
            fontWeight={700}
            position="relative"
            top="17px"
            padding="2px"
          >
            {adminUser?.firstName} {adminUser?.lastName}
          </Text>
          <Text color="#A9B4C2">{adminUser?.email}</Text>
        </Box>
        <Box position="relative" bottom="7px" width="20px">
          <Menu>
            <MenuButton
              position="relative"
              right="20px"
              background="transparent"
              color="#ffffff"
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
