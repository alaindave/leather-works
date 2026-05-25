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
      bgGradient="radial(#47370b, #061962)"
      // overflowY="hidden"
      // overflowX="hidden"
    >
      <Box marginTop="3.2rem" marginLeft="8px">
        <Logo text="Gestion de stock et de personnel" />
      </Box>
      <HStack spacing="45px" position="relative" top="150px" left="300px">
        <Card
          backgroundColor="#08162b"
          height="380px"
          width="380px"
          borderWidth="0.5px"
          borderColor="#c9990a"
          borderRadius="20px"
        >
          <VStack>
            <Box
              position="relative"
              top="40px"
              borderWidth="1px"
              padding="20px"
              borderRadius="60px"
              borderColor="#c9990a"
            >
              <BsFillPeopleFill color="#c9990a" size="80px" />
            </Box>
            <Box position="relative" top="55px" left="13px">
              <Text color="#ffffff" fontSize="24px" fontWeight="700">
                Module personnel
              </Text>
              <Text color="#ffffff" position="relative" bottom="18px">
                Gérez vos employés,présences,
              </Text>
              <Text
                color="#ffffff"
                position="relative"
                left="10px"
                bottom="30px"
              >
                congés et fiches de paye
              </Text>
            </Box>
            <Link to="/employees_admin">
              <Button
                color="#41340b"
                background="#c9990a"
                fontSize="20px"
                padding="25px"
                position="absolute"
                left="62px"
                bottom="14px"
                borderRadius="15px"
                width="280px"
                _hover={{ color: "#41340b" }}
              >
                <Text position="relative" top="7px" marginRight="20px">
                  Acceder au module
                </Text>
                <FaRegArrowAltCircleRight />
              </Button>
            </Link>
          </VStack>
        </Card>
        <Card
          height="380px"
          width="380px"
          backgroundColor="#08162b"
          borderWidth="0.5px"
          borderColor="#0d6efd"
          borderRadius="20px"
        >
          <VStack>
            <Box
              position="relative"
              top="40px"
              borderWidth="1px"
              padding="20px"
              borderRadius="60px"
              borderColor="#0d6efd"
            >
              <BsBoxSeamFill color="#0d6efd" size="80px" />
            </Box>
            <Box position="relative" top="55px" left="35px">
              <Text color="#ffffff" fontSize="24px" fontWeight="700">
                Module stock
              </Text>
              <Text
                color="#ffffff"
                position="relative"
                right="20px"
                bottom="18px"
              >
                Gérez vos produits,entrées,
              </Text>
              <Text
                color="#ffffff"
                position="relative"
                right="20px"
                bottom="30px"
              >
                sorties,stock et inventaires
              </Text>
            </Box>
            <Link to="/admin">
              <Button
                color="#41340b"
                background="#0d6efd"
                fontSize="21px"
                padding="25px"
                textColor="#ffffff"
                position="absolute"
                left="65px"
                bottom="14px"
                borderRadius="15px"
                width="280px"
                _hover={{ color: "#41340b", textColor: "#ffffff" }}
              >
                <Text position="relative" top="7px" marginRight="20px">
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
