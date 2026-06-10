import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import { BsBoxSeamFill } from "react-icons/bs";

// @ts-ignore
import Logo from "../components/Logo";

const AdminPage = () => {
  return (
    <Flex
      direction="column"
      height="100vh"
      width="100vw"
      bg="linear-gradient(180deg, #F8F9FB 0%, #EEF2F7 100%)"
    >
      <Box marginTop="2.2rem" marginLeft="8px">
        <Logo text="Gestion de stock et de personnel" />
      </Box>
      <HStack
        spacing="40px"
        justify="center"
        align="center"
        flex="1"
        position="relative"
        bottom="2rem"
      >
        {" "}
        <Card
          bg="#FFFFFF"
          height="380px"
          width="380px"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="12px"
          boxShadow="0 4px 12px rgba(0,0,0,0.08)"
          transition="all 0.2s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <VStack>
            <Box
              position="relative"
              top="40px"
              borderWidth="2px"
              padding="20px"
              borderRadius="60px"
              borderColor="#0078D4"
            >
              <BsFillPeopleFill color="#0078D4" size="72px" />
            </Box>
            <Box position="relative" top="3rem" left="1.1rem">
              <Text color="#1F2937" fontSize="1.5rem" fontWeight="600">
                Module personnel
              </Text>
              <Text color="#6B7280" fontSize="1.2rem">
                Gérez vos employés, présences,
              </Text>
              <Text
                color="#6B7280"
                fontSize="1.2rem"
                position="relative"
                left="0.5rem"
                bottom="1rem"
              >
                congés et fiches de paye
              </Text>
            </Box>
            <Link to="/employees_admin">
              <Button
                bg="#0078D4"
                color="white"
                fontSize="16px"
                fontWeight="600"
                height="52px"
                width="280px"
                position="relative"
                top="1.5rem"
                borderRadius="6px"
                _hover={{
                  bg: "#106EBE",
                }}
                _active={{
                  bg: "#005A9E",
                }}
              >
                <Text
                  position="relative"
                  top="7px"
                  marginRight="20px"
                  fontSize="1.1rem"
                >
                  Acceder au module
                </Text>
                <FaRegArrowAltCircleRight />
              </Button>
            </Link>
          </VStack>
        </Card>
        <Card
          bg="#FFFFFF"
          height="380px"
          width="380px"
          border="1px solid"
          borderColor="#D1D9E0"
          borderRadius="12px"
          boxShadow="0 4px 12px rgba(0,0,0,0.08)"
          transition="all 0.2s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <VStack>
            <Box
              position="relative"
              top="40px"
              borderWidth="1px"
              padding="20px"
              borderRadius="60px"
              borderColor="#107C10"
            >
              <BsBoxSeamFill color="#107C10" size="72px" />{" "}
            </Box>
            <Box position="relative" top="3.3rem" left="35px">
              <Text color="#1F2937" fontSize="24px" fontWeight="600">
                Module stock
              </Text>
              <Text
                color="#6B7280"
                fontSize="1.2rem"
                position="relative"
                right="20px"
                bottom="0.5rem"
              >
                Gérez vos produits,entrées,
              </Text>
              <Text
                color="#6B7280"
                fontSize="1.2rem"
                position="relative"
                right="1rem"
                bottom="1.3rem"
              >
                sorties,stock et inventaires
              </Text>
            </Box>
            <Link to="/admin">
              <Button
                bg="#107C10"
                color="white"
                fontSize="16px"
                fontWeight="600"
                height="52px"
                width="280px"
                position="relative"
                top="1.5rem"
                borderRadius="6px"
                _hover={{
                  bg: "#0E6E0E",
                }}
              >
                <Text
                  position="relative"
                  top="7px"
                  marginRight="20px"
                  fontSize="1.1rem"
                >
                  Acceder au module
                </Text>{" "}
                <FaRegArrowAltCircleRight />
              </Button>
            </Link>
          </VStack>
        </Card>
      </HStack>
    </Flex>
  );
};

export default AdminPage;
