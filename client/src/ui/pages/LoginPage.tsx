import {
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaUnlockAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { z } from "zod";

import useAdminUser from "../../store/authStore";
import logo from "../assets/afritan_logo.png";
import SignUp from "../components/SignUp";
import "../styles/App.css";

const schema = z.object({
  email: z.string(),
  password: z.string(),
});

type AuthData = z.infer<typeof schema>;

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const setLogIn = useAdminUser((store) => store.login);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { register, handleSubmit } = useForm<AuthData>({
    resolver: zodResolver(schema),
  });

  const handleLogin = async (data: AuthData) => {
    setIsLoggingIn(true);

    try {
      const adminUser = await window.electron.auth.login({
        email: data.email,
        password: data.password,
      });

      if (adminUser) {
        const offlineUser = await window.electron.offlineUsers.save({
          _id: adminUser._id,
          email: adminUser.email,
          password: data.password,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: adminUser.role,
        });

        console.log("Offline user successfully saved: ", offlineUser);

        setLogIn(
          adminUser._id,
          adminUser.firstName,
          adminUser.lastName,
          adminUser.email,
          adminUser.role
        );

        navigate("/admin", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Email et/ou mot de passe incorrect.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleChange = () => {
    setErrorMessage("");
  };

  return (
    <Flex justify="center" align="center" minH="100vh" px={6}>
      <Box
        bg="white"
        border="1px solid"
        borderColor="#D1D5DB"
        borderRadius="18px"
        boxShadow="0 6px 20px rgba(0,0,0,0.12)"
        w="460px"
        p={10}
      >
        <form
          noValidate
          onSubmit={handleSubmit(handleLogin)}
          onChange={handleChange}
        >
          <VStack spacing={6} align="stretch">
            <Image
              src={logo}
              h="90px"
              boxSize="7.3rem"
              objectFit="contain"
              mx="auto"
            />

            <Text
              textAlign="center"
              fontSize="1.6rem"
              fontWeight="700"
              color="#1F2937"
            >
              Connexion
            </Text>

            <FormControl>
              <InputGroup>
                <InputLeftElement pointerEvents="none" h="52px">
                  <IoIosMail size="20px" color="#5B6472" />
                </InputLeftElement>

                <Input
                  type="email"
                  placeholder="Email"
                  h="52px"
                  pl="42px"
                  bg="#F9FAFB"
                  border="1px solid"
                  borderColor="#B8C2CC"
                  color="#1F2937"
                  _placeholder={{
                    color: "#6B7280",
                  }}
                  _hover={{
                    borderColor: "#0078D4",
                  }}
                  _focus={{
                    borderColor: "#0078D4",
                    boxShadow: "0 0 0 1px #0078D4",
                  }}
                  {...register("email")}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement pointerEvents="none" h="52px">
                  <FaUnlockAlt size="16px" color="#5B6472" />
                </InputLeftElement>

                <Input
                  type="password"
                  placeholder="Mot de passe"
                  h="52px"
                  pl="42px"
                  bg="#F9FAFB"
                  border="1px solid"
                  borderColor="#B8C2CC"
                  color="#1F2937"
                  _placeholder={{
                    color: "#6B7280",
                  }}
                  _hover={{
                    borderColor: "#B8C2CC",
                  }}
                  _focus={{
                    borderColor: "#0078D4",
                    boxShadow: "0 0 0 1px #0078D4",
                  }}
                  {...register("password")}
                />
              </InputGroup>

              {errorMessage && (
                <Text
                  color="#D13438"
                  fontSize="1rem"
                  fontWeight="500"
                  position="relative"
                  left="4rem"
                  top="1rem"
                >
                  {errorMessage}
                </Text>
              )}
            </FormControl>

            <Button
              type="submit"
              h="56px"
              bg="#0078D4"
              mt="1rem"
              color="white"
              fontSize="1.2rem"
              fontWeight="600"
              leftIcon={<CiLock size={22} />}
              isLoading={isLoggingIn}
              loadingText="Connexion..."
              isDisabled={isLoggingIn}
              _hover={{
                bg: "#106EBE",
              }}
              _active={{
                bg: "#005A9E",
              }}
            >
              Se connecter
            </Button>

            <Text
              position="relative"
              top="0.5rem"
              fontSize="1.1rem"
              textAlign="center"
              color="#1F2937"
            >
              ou
            </Text>

            <Flex justify="center">
              <SignUp />
            </Flex>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
