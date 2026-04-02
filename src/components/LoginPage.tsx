import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

const LoginPage = () => {
  return (
    <>
      <FormControl mb="200px">
        <FormLabel>Addresse courriel</FormLabel>
        <Input width="300px" placeholder="Addresse courriel" />
        <FormLabel>Mot de passe</FormLabel>
        <Input width="300px" placeholder="Mot de passe" />
      </FormControl>

      <Button pos="relative" bottom="150px">
        Se connecter
      </Button>
    </>
  );
};

export default LoginPage;
