import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import { FcHighPriority } from "react-icons/fc";
import { FcMediumPriority } from "react-icons/fc";
import { MdTask } from "react-icons/md";

interface Props {
  onFilterClicked: (filter: string) => void;
}

const TaskStatusFilter = ({ onFilterClicked }: Props) => {
  const [filter, setFilter] = useState("");

  return (
    <Menu>
      <MenuButton
        bg="#FFFFFF"
        width="300px"
        as={Button}
        leftIcon={<FaSlidersH color="black" />}
        border="1px solid #E2E8F0"
        boxShadow="0 2px 10px rgba(15,23,42,.06)"
        _hover={{ bg: "transparent" }}
      >
        <Text color="gray.800" position="relative" top="8px">
          {filter || "Trier par statut"}
        </Text>
      </MenuButton>
      <MenuList
        backgroundColor="#ffffff"
        borderColor="rgba(255,196,0,0.18)"
        borderRadius="18px"
        position="relative"
        // left="17rem"
        // bottom="9.5rem"
        overflowY="auto"
        _hover={{ color: "yellow" }}
      >
        <MenuItem
          color="gray.800"
          fontSize="1rem"
          backgroundColor="#ffffff"
          _hover={{
            color: "#4F46E5",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("");
            setFilter("Toutes les taches");
          }}
        >
          <Box>
            <MdTask size="20px" />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            {" "}
            Toutes les taches
          </Text>
        </MenuItem>
        <MenuItem
          color="gray.800"
          fontSize="1rem"
          backgroundColor="#ffffff"
          _hover={{
            color: "#4F46E5",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("RESOLVED");
            setFilter("Resolue");
          }}
        >
          <Box>
            <FcHighPriority />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            Resolue
          </Text>
        </MenuItem>
        <MenuItem
          color="gray.800"
          fontSize="1rem"
          backgroundColor="#ffffff"
          _hover={{
            color: "#4F46E5",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("OPEN");
            setFilter("Ouverte");
          }}
        >
          <Box>
            <FcMediumPriority />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            Ouverte
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default TaskStatusFilter;
