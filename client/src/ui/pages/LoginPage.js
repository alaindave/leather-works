import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Flex, FormControl, Image, Input, InputGroup, InputLeftElement, Text, VStack, } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import logo from "../assets/afritan_logo.png";
import { IoIosMail } from "react-icons/io";
import { FaUnlockAlt } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import SignUp from "../components/SignUp";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import "../styles/App.css";
import { useState } from "react";
import useAdminUser from "../../store/authStore";
const schema = z.object({
    email: z.string(),
    password: z.string(),
});
const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const setLogIn = useAdminUser((store) => store.login);
    const { register, handleSubmit } = useForm({
        resolver: zodResolver(schema),
    });
    const handleLogin = async (data) => {
        console.log("Log in initiated...", data);
        const credentials = { email: data.email, password: data.password };
        try {
            const adminUser = await window.electron.auth.login(credentials);
            console.log("Result from main process login request:", adminUser);
            if (adminUser) {
                setLogIn(adminUser._id, adminUser.firstName, adminUser.lastName, adminUser.email, adminUser.role);
                navigate("/admin", {
                    replace: true,
                });
            }
        }
        catch (error) {
            console.error("An error occured while logging in:", error);
            setErrorMessage("Email et/ou mot de passe incorrect.");
        }
    };
    const handleChange = () => {
        setErrorMessage("");
    };
    return (_jsx(Flex, { borderColor: "#244b9e", background: "rgba(3, 8, 21, 0.95)", borderWidth: " 1px", borderRadius: "20px", marginBottom: "10px", marginLeft: "30px", paddingLeft: "100px", paddingTop: "60px", width: "500px", height: "660px", direction: "column", children: _jsx(FormControl, { mb: "160px", children: _jsxs("form", { noValidate: true, onSubmit: handleSubmit(handleLogin), onChange: handleChange, children: [_jsx(Image, { src: logo, position: "relative", left: "100px", bottom: "30px" }), _jsxs(InputGroup, { position: "relative", right: "50px", top: "30px", children: [_jsx(InputLeftElement, { pointerEvents: "none", children: _jsx(Box, { position: "relative", top: "6px", children: _jsx(IoIosMail, { color: "#ffffff", size: "22px" }) }) }), _jsx(VStack, { children: _jsx(Input, { type: "email", textIndent: "15px", marginBottom: "20px", borderColor: "#244b9e", borderWidth: "2px", height: "50px", width: "400px", placeholder: "Email", _placeholder: {
                                        opacity: 1,
                                        color: "#93a4d1",
                                        position: "relative",
                                        left: "8px",
                                    }, textColor: "#ffffff", ...register("email") }) })] }), _jsxs(InputGroup, { children: [_jsx(InputLeftElement, { pointerEvents: "none", children: _jsx(Box, { position: "relative", top: "53px", right: "50px", children: _jsx(FaUnlockAlt, { color: "#ffffff", size: "18px" }) }) }), _jsxs(VStack, { children: [_jsx(Input, { type: "password", textIndent: "15px", marginBottom: "20px", borderColor: "#244b9e", borderWidth: "2px", position: "relative", right: "50px", top: "50px", height: "50px", width: "400px", placeholder: "Mot de passe", _placeholder: {
                                            opacity: 1,
                                            color: "#93a4d1",
                                            position: "relative",
                                            left: "8px",
                                        }, textColor: "#ffffff", ...register("password") }), _jsx(Box, { position: "relative", top: "30px", right: "40px", width: "280px", children: _jsx(Text, { position: "absolute", className: "text-danger", children: errorMessage }) })] })] }), _jsxs(Button, { position: "relative", top: "90px", right: "50px", type: "submit", bgGradient: "linear(to-r, #3b82f6, #1d4ed8)", borderRadius: "18px", border: "none", color: "#ffffff", fontSize: "1.3rem", fontWeight: "700", size: "lg", width: "100%", height: "64px", _hover: { bg: "#2563eb" }, children: [_jsx(Box, { position: "relative", right: "30px", children: _jsx(CiLock, { size: "25px" }) }), _jsx(Text, { position: "relative", right: "10px", top: "10px", children: "Se connecter" })] }), _jsx(Text, { position: "relative", top: "135px", left: "120px", color: "gray.400", fontSize: "20px", children: "ou" }), _jsx(Box, { position: "relative", top: "155px", left: "58px", children: _jsx(SignUp, {}) })] }) }) }));
};
export default LoginPage;
