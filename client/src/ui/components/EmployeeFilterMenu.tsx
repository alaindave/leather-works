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
import { FaChevronCircleDown } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { GiOfficeChair } from "react-icons/gi";
import { GiFactory } from "react-icons/gi";
import { MdOutlineHandyman } from "react-icons/md";
import { FaWarehouse } from "react-icons/fa6";
import { GiGuards } from "react-icons/gi";

interface Props {
  onFilterClicked: (department: string) => void;
}

const EmployeeFilterMenu = ({ onFilterClicked }: Props) => {
  const [filter, setFilter] = useState("");

  return (
    <Menu>
      <MenuButton
        bg="#FFFFFF"
        width="300px"
        as={Button}
        rightIcon={<FaChevronCircleDown color="black" />}
        borderWidth="0.5px"
        borderRadius="5px"
        borderColor="gray.600"
        _hover={{ bg: "transparent" }}
      >
        <Text color="gray.800" position="relative" top="8px">
          {filter || "Trier par département"}
        </Text>
      </MenuButton>
      <MenuList
        backgroundColor="#07182F"
        borderColor="rgba(255,196,0,0.18)"
        borderRadius="18px"
        position="relative"
        left="19rem"
        bottom="1rem"
        maxH="165px"
        overflowY="auto"
        _hover={{ color: "yellow" }}
      >
        <MenuItem
          color="#DBE7FF"
          backgroundColor="#07182F"
          _hover={{
            color: "#FFC400",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("");
            setFilter("Tous les employés");
          }}
        >
          <Box>
            <BsPeopleFill size="20px" />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            {" "}
            Tous les employés
          </Text>
        </MenuItem>
        <MenuItem
          color="#DBE7FF"
          backgroundColor="#07182F"
          _hover={{
            color: "#FFC400",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("Administration");
            setFilter("Administration");
          }}
        >
          <Box>
            <GiOfficeChair />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            Administration
          </Text>
        </MenuItem>
        <MenuItem
          color="#DBE7FF"
          backgroundColor="#07182F"
          _hover={{
            color: "#FFC400",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("Usine");
            setFilter("Usine");
          }}
        >
          <Box>
            <GiFactory />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            Usine
          </Text>
        </MenuItem>
        <MenuItem
          color="#DBE7FF"
          backgroundColor="#07182F"
          _hover={{
            color: "#FFC400",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("Atelier");
            setFilter("Atelier");
          }}
        >
          <Box>
            <MdOutlineHandyman />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            {" "}
            Atelier
          </Text>
        </MenuItem>
        <MenuItem
          color="#DBE7FF"
          backgroundColor="#07182F"
          _hover={{
            color: "#FFC400",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("Magasin");
            setFilter("Magasin");
          }}
        >
          <Box>
            <FaWarehouse />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            Magasin
          </Text>
        </MenuItem>
        <MenuItem
          color="#DBE7FF"
          backgroundColor="#07182F"
          _hover={{
            color: "#FFC400",
            backgroundColor: "rgba(255,196,0,0.14)",
          }}
          onClick={() => {
            onFilterClicked("Sentinelle");
            setFilter("Sentinelle");
          }}
        >
          <Box>
            <GiGuards />
          </Box>
          <Text marginTop="15px" marginLeft="10px">
            Sentinelle
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default EmployeeFilterMenu;
