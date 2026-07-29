import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Flex, FormControl, Image, Input, InputGroup, InputLeftElement, Text, VStack, } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiLock } from "react-icons/ci";
import { FaUnlockAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { z } from "zod";
import useAdminUser from "../../store/auth.store";
import logo from "../assets/afritan_logo.png";
import SignUp from "../components/SignUp";
import "../styles/App.css";
import { checkOnline } from "../services/connectivity_check.service";
const schema = z.object({
    email: z.string(),
    password: z.string(),
});
const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const setLogIn = useAdminUser((store) => store.login);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { register, handleSubmit } = useForm({
        resolver: zodResolver(schema),
    });
    const handleLogin = async (credentials) => {
        setIsLoggingIn(true);
        try {
            const online = await checkOnline();
            console.log("Am I online?", online);
            if (!online) {
                //Offline login
                const offlineUser = await window.electron.offlineUsers.login({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (!offlineUser) {
                    throw new Error("OFFLINE LOGIN FAILED");
                }
                console.log("OFFLINE LOGIN SUCCESS: ", offlineUser);
                setLogIn(offlineUser._id, offlineUser.firstName, offlineUser.lastName, offlineUser.email, offlineUser.role, offlineUser.notes);
                navigate("/admin", { replace: true });
                return;
            }
            //Online login
            const adminUser = await window.electron.auth.login(credentials);
            console.log("ADMIN USER:", adminUser);
            if (adminUser) {
                const offlineUser = await window.electron.offlineUsers.save({
                    _id: adminUser._id,
                    email: adminUser.email,
                    password: credentials.password,
                    firstName: adminUser.firstName,
                    lastName: adminUser.lastName,
                    role: adminUser.role,
                    notes: adminUser.notes,
                });
                console.log("Offline user successfully saved: ", offlineUser);
                //Save user to zustand store
                setLogIn(adminUser._id, adminUser.firstName, adminUser.lastName, adminUser.email, adminUser.role, adminUser.notes);
                navigate("/admin", { replace: true });
            }
        }
        catch (error) {
            console.log("LOGIN FAILED: ", error);
            setErrorMessage("Email et/ou mot de passe incorrect.");
        }
        finally {
            setIsLoggingIn(false);
        }
    };
    const handleChange = () => {
        setErrorMessage("");
    };
    return (_jsx(Flex, { justify: "center", align: "center", minH: "100vh", px: 6, children: _jsx(Box, { bg: "white", border: "1px solid", borderColor: "#D1D5DB", borderRadius: "18px", boxShadow: "0 6px 20px rgba(0,0,0,0.12)", w: "460px", p: 10, children: _jsx("form", { noValidate: true, onSubmit: handleSubmit(handleLogin), onChange: handleChange, children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Image, { src: logo, h: "90px", boxSize: "7.3rem", objectFit: "contain", mx: "auto" }), _jsx(Text, { textAlign: "center", fontSize: "1.6rem", fontWeight: "700", color: "#1F2937", children: "Connexion" }), _jsx(FormControl, { children: _jsxs(InputGroup, { children: [_jsx(InputLeftElement, { pointerEvents: "none", h: "52px", children: _jsx(IoIosMail, { size: "20px", color: "#5B6472" }) }), _jsx(Input, { type: "email", placeholder: "Email", h: "52px", pl: "42px", bg: "#F9FAFB", border: "1px solid", borderColor: "#B8C2CC", color: "#1F2937", _placeholder: {
                                            color: "#6B7280",
                                        }, _hover: {
                                            borderColor: "#0078D4",
                                        }, _focus: {
                                            borderColor: "#0078D4",
                                            boxShadow: "0 0 0 1px #0078D4",
                                        }, ...register("email") })] }) }), _jsxs(FormControl, { children: [_jsxs(InputGroup, { children: [_jsx(InputLeftElement, { pointerEvents: "none", h: "52px", children: _jsx(FaUnlockAlt, { size: "16px", color: "#5B6472" }) }), _jsx(Input, { type: "password", placeholder: "Mot de passe", h: "52px", pl: "42px", bg: "#F9FAFB", border: "1px solid", borderColor: "#B8C2CC", color: "#1F2937", _placeholder: {
                                                color: "#6B7280",
                                            }, _hover: {
                                                borderColor: "#B8C2CC",
                                            }, _focus: {
                                                borderColor: "#0078D4",
                                                boxShadow: "0 0 0 1px #0078D4",
                                            }, ...register("password") })] }), errorMessage && (_jsx(Text, { color: "#D13438", fontSize: "1rem", fontWeight: "500", position: "relative", left: "4rem", top: "1rem", children: errorMessage }))] }), _jsx(Button, { type: "submit", h: "56px", bg: "#0078D4", mt: "1rem", color: "white", fontSize: "1.2rem", fontWeight: "600", leftIcon: _jsx(CiLock, { size: 22 }), isLoading: isLoggingIn, loadingText: "Connexion...", isDisabled: isLoggingIn, _hover: {
                                bg: "#106EBE",
                            }, _active: {
                                bg: "#005A9E",
                            }, children: "Se connecter" }), _jsx(Text, { position: "relative", top: "0.5rem", fontSize: "1.1rem", textAlign: "center", color: "#1F2937", children: "ou" }), _jsx(Flex, { justify: "center", children: _jsx(SignUp, {}) })] }) }) }) }));
};
export default LoginPage;
