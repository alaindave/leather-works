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
        <Input
          marginBottom="20px"
          borderColor="#244b9e"
          borderWidth="2px"
          position="relative"
          right="50px"
          top="30px"
          height="50px"
          width="400px"
          placeholder="Email"
          _placeholder={{ opacity: 1, color: "#93a4d1" }}
          textColor="#93a4d1"
        />
        <Input
          marginBottom="20px"
          borderColor="#244b9e"
          borderWidth="2px"
          position="relative"
          right="50px"
          top="50px"
          height="50px"
          width="400px"
          placeholder="Mot de passe"
          _placeholder={{ opacity: 1, color: "#93a4d1" }}
          textColor="#93a4d1"
        />
      </FormControl>

      <Button
        position="relative"
        right="50px"
        bgGradient="linear(to-r, #3b82f6, #1d4ed8)"
        borderRadius="18px"
        border="none"
        color=" #fff"
        font-size="1.15rem"
        font-weight=" 700"
        size="lg"
        width="100%"
        height="64px"
        _hover={{ bg: "#2563eb" }}
      >
        <Link to="/admin">Se connecter</Link>
      </Button>
    </Box>
  );
};

export default LoginPage;
