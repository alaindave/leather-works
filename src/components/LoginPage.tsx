import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <>
      <FormControl mb="200px">
        <FormLabel>Addresse courriel</FormLabel>
        <Input
          marginBottom="30px"
          width="300px"
          placeholder="Addresse courriel"
        />
        <FormLabel>Mot de passe</FormLabel>
        <Input width="300px" placeholder="Mot de passe" />
      </FormControl>

      <Button pos="relative" bottom="160px">
        <Link to="/admin">Se connecter</Link>
      </Button>
    </>
  );
};

export default LoginPage;
