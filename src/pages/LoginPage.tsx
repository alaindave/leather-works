import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "../css/App.css";
import logo from "../assets/afritan-logo.png";

const LoginPage = () => {
  return (
    <Box className="login_box">
      <FormControl mb="160px">
        <Image src={logo} position="relative" right="75px" bottom="30px" />
        <FormLabel>Addresse courriel</FormLabel>
        <Input
          marginBottom="20px"
          width="300px"
          placeholder="Addresse courriel"
        />
        <FormLabel>Mot de passe</FormLabel>
        <Input marginBottom="20px" width="300px" placeholder="Mot de passe" />
      </FormControl>

      <Button pos="relative" bottom="160px">
        <Link to="/admin">Se connecter</Link>
      </Button>
    </Box>
  );
};

export default LoginPage;
