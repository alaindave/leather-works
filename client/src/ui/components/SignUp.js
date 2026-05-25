import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAdminUser from "../../store/authStore";
import { Box, Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, useDisclosure, Image, } from "@chakra-ui/react";
import { MdAlternateEmail } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { MdPerson2 } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { RiLockPasswordFill } from "react-icons/ri";
import logo from "../assets/afritan_logo.png";
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
const SignUp = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const setAuth = useAdminUser((store) => store.login);
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    const onSubmit = async (data) => {
        console.log("Form submitted:", data);
        await axios
            .post(`${API_URL}/adminUsers`, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
        })
            .then((res) => {
            console.log("User successfully created: ", res.data);
            setAuth(res.data._id, res.data.firstName, res.data.lastName, res.data.email, res.data.roles);
            navigate("/admin");
        })
            .catch((error) => console.error(error));
    };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { background: "rgba(3, 8, 21, 0.95)", color: "#F2B705", size: "md", onClick: onOpen, _hover: {
                    background: "rgba(3, 8, 21, 0.95)",
                    color: "#F2B705",
                    transform: "scale(1.05)",
                }, children: _jsx(Text, { fontSize: "17px", children: "Cr\u00E9er un compte" }) }), _jsxs(Modal, { size: "3xl", isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, { backdropFilter: "auto", backdropBlur: "30px" }), _jsx(ModalContent, { position: "relative", top: "60px", bg: "#08162b", children: _jsxs("form", { noValidate: true, onSubmit: handleSubmit(onSubmit), children: [_jsx(ModalHeader, { color: "#ffffff", children: _jsxs(HStack, { position: "relative", left: "130px", children: [_jsx(Box, { position: "relative", right: "20px", children: _jsx(Image, { src: logo, boxSize: "65px", borderRadius: "20px" }) }), _jsxs(VStack, { position: "relative", top: "10px", left: "18px", children: [_jsxs(Text, { position: "relative", top: "8px", fontSize: "1.5rem", children: [" ", "Cr\u00E9er un compte admin"] }), _jsx(Text, { color: "#C7D2FE", fontSize: "15px", position: "relative", right: "15px", bottom: "20px", children: "Remplissez le formulaire" })] })] }) }), _jsx(ModalCloseButton, { color: "#ffffff" }), _jsx(ModalBody, { children: _jsx(FormControl, { children: _jsxs(VStack, { spacing: "12px", marginBottom: "10px", position: "relative", bottom: "15px", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Nom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "310px", type: "text", ...register("lastName"), marginBottom: "3px" }), _jsx(Box, { position: "relative", width: "250px", marginBottom: "12px", children: _jsx(Text, { position: "absolute", className: "text-danger", fontSize: "sm", children: errors.lastName?.message }) })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdPerson2, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Prenom", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "310px", type: "text", ...register("firstName"), marginBottom: "3px" }), _jsx(Box, { position: "relative", width: "250px", marginBottom: "12px", children: _jsx(Text, { position: "absolute", className: "text-danger", fontSize: "sm", children: errors.firstName?.message }) })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(MdAlternateEmail, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Email", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "310px", type: "email", ...register("email"), marginBottom: "3px" }), _jsx(Box, { position: "relative", width: "250px", marginBottom: "15px", children: _jsx(Text, { position: "absolute", className: "text-danger", fontSize: "sm", children: errors.email?.message }) })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(RiLockPasswordFill, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Mot de passe", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "310px", type: "password", placeholder: "Minimum de 8 caract\u00E8res et 1 chiffre", _placeholder: { opacity: 1, color: "#e6ebfe" }, ...register("password"), marginBottom: "3px" }), _jsx(Box, { position: "relative", width: "250px", marginBottom: "15px", children: _jsx(Text, { position: "absolute", className: "text-danger", fontSize: "sm", children: errors.password?.message }) })] }), _jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Box, { marginBottom: "10px", children: _jsx(RiLockPasswordFill, { color: "#F2B705", size: "1.3rem" }) }), _jsxs(FormLabel, { color: "#C7D2FE", marginBottom: "10px", children: ["Confirmez le mot de passe", _jsx("span", { style: { color: "#F2B705", fontSize: "1rem" }, children: "*" })] })] }), _jsx(Input, { color: "#e6ebfe", width: "310px", type: "password", placeholder: "Minimum de 8 caract\u00E8res et 1 chiffre", _placeholder: { opacity: 1, color: "#e6ebfe" }, ...register("confirmPassword"), marginBottom: "3px" }), _jsx(Box, { position: "relative", width: "250px", marginBottom: "12px", children: _jsx(Text, { position: "absolute", className: "text-danger", fontSize: "sm", children: errors.confirmPassword?.message }) })] })] }) }) }), _jsx(ModalFooter, { bg: "#08162b", children: _jsxs(HStack, { position: "relative", bottom: "10px", right: "14rem", children: [_jsx(Button, { borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: onClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "18px" }) }), _jsx(Text, { color: "#ffffff", position: "relative", top: "8px", fontSize: "1rem", children: "Annuler" })] }) }), _jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, type: "submit", children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsxs(Text, { position: "relative", top: "8px", fontSize: "1rem", children: [" ", "Ajouter"] })] }) })] }) })] }) })] })] }));
};
export default SignUp;
