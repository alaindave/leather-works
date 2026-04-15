import { Box, Button, FormControl, Image, Input } from "@chakra-ui/react";
import { Link } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import "../styles/App.css";

const LoginPage = () => {
  return (
    <Box className="login_box">
      <FormControl mb="160px">
        <Image src={logo} position="relative" right="75px" bottom="30px" />
        {/* <FormLabel>Addresse courriel</FormLabel> */}
        <Input
          marginBottom="20px"
          position="relative"
          right="50px"
          top="30px"
          width="400px"
          placeholder="Addresse courriel"
          _placeholder={{ opacity: 1, color: "#320c01" }}
        />
        {/* <FormLabel>Mot de passe</FormLabel> */}
        <Input
          marginBottom="20px"
          position="relative"
          right="50px"
          top="50px"
          width="400px"
          placeholder="Mot de passe"
          _placeholder={{ opacity: 1, color: "#320c01" }}
          textColor="#320c01"
        />
      </FormControl>

      <Button pos="relative" bottom="30px" width="300px" color="#320c01">
        <Link to="/admin">Se connecter</Link>
      </Button>
    </Box>
  );
};

export default LoginPage;
