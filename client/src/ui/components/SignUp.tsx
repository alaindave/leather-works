import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, type FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAdminUser from "../../store/authStore";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { MdAlternateEmail } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { MdPerson2 } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { RiLockPasswordFill } from "react-icons/ri";
import logo from "../assets/afritan_logo.png";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const schema = z
  .object({
    firstName: z.string().min(3, { message: "Minimum de 3 caractères requis" }),
    lastName: z.string().min(3, { message: "Minimum de 3 caractères requis" }),
    email: z.string().email("Addresse email non valide."),
    password: z
      .string()
      .min(6, { message: "Minimum de 8 caractères requis" })
      .regex(/[a-z]/, "Incluez au moins une lettre minuscule.")
      .regex(/[A-Z]/, "Incluez au moins une lettre majuscule.")
      .regex(/[0-9]/, "Incluez au moins un chiffre."),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mots de passe non identiques.",
        path: ["confirmPassword"],
      });
    }
  });

type UserData = z.infer<typeof schema>;

const SignUp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const setAuth = useAdminUser((store) => store.login);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FieldValues) => {
    setIsLoggingIn(true);
    setErrorMessage("");
    console.log("Form submitted:", data);

    try {
      const res = await axios.post(`${API_URL}/adminUsers`, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      console.log("User successfully created: ", res.data);
      setAuth(
        res.data._id,
        res.data.firstName,
        res.data.lastName,
        res.data.email,
        res.data.roles
      );
      navigate("/admin");
    } catch (error) {
      console.error("An error occured while signing up", error);
      setErrorMessage("Une erreur est survenue. Veuillez contacter ADB Tech.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <Button
        background="rgba(3, 8, 21, 0.95)"
        color="#F2B705"
        size="md"
        onClick={onOpen}
        _hover={{
          background: "rgba(3, 8, 21, 0.95)",
          color: "#F2B705",
          transform: "scale(1.05)",
        }}
      >
        <Text fontSize="17px">Créer un compte</Text>
      </Button>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="auto" backdropBlur="30px" />
        <ModalContent bg="#08162b">
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader color="#ffffff">
              <HStack position="relative" left="130px">
                <Box position="relative" right="20px">
                  <Image src={logo} boxSize="65px" borderRadius="20px" />
                </Box>
                <VStack position="relative" top="10px" left="18px">
                  <Text position="relative" top="8px" fontSize="1.5rem">
                    {" "}
                    Créer un compte admin
                  </Text>
                  <Text
                    color="#C7D2FE"
                    fontSize="15px"
                    position="relative"
                    right="15px"
                    bottom="20px"
                  >
                    Remplissez le formulaire
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="#ffffff" />
            <ModalBody>
              <FormControl>
                <VStack
                  spacing="12px"
                  marginBottom="10px"
                  position="relative"
                  bottom="15px"
                >
                  {/* Last name input */}
                  <Box>
                    <HStack>
                      <Box marginBottom="10px">
                        <MdPerson2 color="#F2B705" size="1.3rem" />
                      </Box>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Nom
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>

                    <Input
                      color="#e6ebfe"
                      width="310px"
                      type="text"
                      {...register("lastName")}
                      marginBottom="3px"
                    />
                    <Box position="relative" width="250px" marginBottom="12px">
                      <Text
                        position="absolute"
                        className="text-danger"
                        fontSize="sm"
                      >
                        {errors.lastName?.message}
                      </Text>
                    </Box>
                  </Box>
                  {/* First name input */}
                  <Box>
                    <HStack>
                      <Box marginBottom="10px">
                        <MdPerson2 color="#F2B705" size="1.3rem" />
                      </Box>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Prenom
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      color="#e6ebfe"
                      width="310px"
                      type="text"
                      {...register("firstName")}
                      marginBottom="3px"
                    />
                    <Box position="relative" width="250px" marginBottom="12px">
                      <Text
                        position="absolute"
                        className="text-danger"
                        fontSize="sm"
                      >
                        {errors.firstName?.message}
                      </Text>
                    </Box>
                  </Box>
                  {/* Email input */}
                  <Box>
                    <HStack>
                      <Box marginBottom="10px">
                        <MdAlternateEmail color="#F2B705" size="1.3rem" />
                      </Box>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Email
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      color="#e6ebfe"
                      width="310px"
                      type="email"
                      {...register("email")}
                      marginBottom="3px"
                    />
                    <Box position="relative" width="250px" marginBottom="15px">
                      <Text
                        position="absolute"
                        className="text-danger"
                        fontSize="sm"
                      >
                        {errors.email?.message}
                      </Text>
                    </Box>
                  </Box>
                  {/* Password input */}
                  <Box>
                    <HStack>
                      <Box marginBottom="10px">
                        <RiLockPasswordFill color="#F2B705" size="1.3rem" />
                      </Box>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Mot de passe
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      color="#e6ebfe"
                      width="310px"
                      type="password"
                      placeholder="Min. 8 car. avec 1 chiffre et 1 lettre maj"
                      _placeholder={{ opacity: 1, color: "#e6ebfe" }}
                      {...register("password")}
                      marginBottom="3px"
                    />
                    <Box position="relative" width="250px" marginBottom="15px">
                      <Text
                        position="absolute"
                        className="text-danger"
                        fontSize="sm"
                      >
                        {errors.password?.message}
                      </Text>
                    </Box>
                  </Box>
                  {/* Confirm Password input */}
                  <Box>
                    <HStack>
                      <Box marginBottom="10px">
                        <RiLockPasswordFill color="#F2B705" size="1.3rem" />
                      </Box>
                      <FormLabel color="#C7D2FE" marginBottom="10px">
                        Confirmez le mot de passe
                        <span style={{ color: "#F2B705", fontSize: "1rem" }}>
                          *
                        </span>
                      </FormLabel>
                    </HStack>
                    <Input
                      color="#e6ebfe"
                      width="310px"
                      type="password"
                      placeholder="Min. 8 car. avec 1 chiffre et 1 lettre maj"
                      _placeholder={{ opacity: 1, color: "#e6ebfe" }}
                      {...register("confirmPassword")}
                      marginBottom="3px"
                    />
                    <Box position="relative" width="250px" marginBottom="12px">
                      <Text
                        position="absolute"
                        className="text-danger"
                        fontSize="sm"
                      >
                        {errors.confirmPassword?.message}
                      </Text>
                    </Box>
                  </Box>
                  <Text fontSize="1rem" color="red.300">
                    {errorMessage}
                  </Text>
                </VStack>
              </FormControl>
            </ModalBody>

            <ModalFooter bg="#08162b">
              <HStack position="relative" bottom="10px" right="14rem">
                <Button
                  borderColor="#ffffff"
                  borderRadius="10px"
                  bg="#08162b"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="#1a000d"
                  mr={3}
                  onClick={onClose}
                >
                  <HStack>
                    <Box>
                      <RxCrossCircled color="#ffffff" size="18px" />
                    </Box>
                    <Text
                      color="#ffffff"
                      position="relative"
                      top="8px"
                      fontSize="1rem"
                    >
                      Annuler
                    </Text>
                  </HStack>
                </Button>

                <Button
                  type="submit"
                  borderRadius="10px"
                  borderColor="black"
                  bg="#F2B705"
                  borderWidth="0.5px"
                  colorScheme=" #320b01"
                  color="black"
                  mr={3}
                  isLoading={isLoggingIn}
                  loadingText="Connexion..."
                  spinnerPlacement="start"
                  isDisabled={isLoggingIn}
                >
                  <HStack>
                    <Box>
                      <FaSave />
                    </Box>
                    <Text position="relative" top="8px" fontSize="1rem">
                      {" "}
                      Se connecter
                    </Text>
                  </HStack>
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignUp;
