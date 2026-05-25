import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, HStack, Text, VStack, Image, Divider, Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useDisclosure, } from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmployeeDetailsTab from "../components/EmployeeDetailsTab";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { MdDeleteForever } from "react-icons/md";
import { MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import source from "../assets/employee_photos/Jeanne.jpeg";
import UpdateEmployee from "../components/UpdateEmployee";
import { useEffect, useRef, useState } from "react";
const EmployeeDetailsPage = () => {
    const [employee, setEmployee] = useState({});
    const { _id } = useParams();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    useEffect(() => {
        axios
            .get(`${API_URL}/employees/${_id}`)
            .then((res) => {
            setEmployee(res.data);
            console.log("Employee fetched: ", res.data);
        })
            .catch((error) => {
            console.error("Error while fetching employee: ", error);
        });
    }, []);
    const handleDelete = async () => {
        await axios
            .delete(`${API_URL}/employees/${_id}`)
            .then((response) => {
            console.log("Employee successfully deleted: ", response.data);
            navigate("/employees_admin/employees_list");
        })
            .catch((error) => console.error("Unable to delete employee:", error));
    };
    return (_jsxs(_Fragment, { children: [_jsx(AlertDialog, { isOpen: isOpen, leastDestructiveRef: cancelRef, onClose: onClose, children: _jsx(AlertDialogOverlay, { backdropFilter: "auto", backdropBlur: "30px", bgGradient: "radial(circle,#47370b, #061962)", children: _jsxs(AlertDialogContent, { bg: "#08162b", color: "#ffffff", position: "relative", top: "180px", children: [_jsx(AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", children: "Supprimer l'employ\u00E9" }), _jsxs(AlertDialogBody, { children: ["Etes vous sur de vouloir supprimer", " ", _jsxs("span", { style: { color: "#F2B705", fontWeight: "bold" }, children: [" ", employee?.firstName, " "] }), _jsxs("span", { style: { color: "#F2B705", fontWeight: "bold" }, children: [" ", employee?.lastName, " "] }), "de la liste des employ\u00E9s?"] }), _jsx(AlertDialogFooter, { children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "brown", borderWidth: "0.5px", colorScheme: " #320b01", mr: 3, onClick: handleDelete, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(MdAutoDelete, { size: "1.2rem" }) }), _jsxs(Text, { marginTop: "0.9rem", fontSize: "1rem", children: [" ", "Supprimer"] })] }) }), _jsx(Button, { ref: cancelRef, borderColor: "gray.500", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: onClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "1.2rem" }) }), _jsx(Text, { color: "#ffffff", marginTop: "0.9rem", fontSize: "1rem", children: "Annuler" })] }) })] }) })] }) }) }), _jsx(Box, { background: "#03143B", borderRadius: "20px", height: "94vh", width: "79vw", marginTop: "50px", marginLeft: "8px", children: _jsxs(VStack, { spacing: "2px", children: [_jsx(Box, { background: "#03143B", height: "10rem", width: "78vw", borderRadius: "18px", border: "none", marginTop: "5px", marginBottom: "2px", children: _jsxs(HStack, { position: "relative", top: "10px", children: [_jsx(Box, { borderRadius: "10px", borderColor: " #14376b", borderWidth: "1px", padding: "8px", position: "relative", bottom: "15px", left: "10px", children: _jsx(Link, { to: "/employees_admin/employees_list", children: _jsx(FaArrowLeftLong, { color: "#ffffff", size: "1.5rem" }) }) }), _jsxs(Box, { marginLeft: "1.5rem", children: [_jsx(Text, { fontSize: "1.5rem", fontWeight: "700", color: "#ffffff", children: "D\u00E9tails de l'employ\u00E9" }), _jsx(Text, { color: "#C7D2FE", position: "relative", bottom: "18px", children: "Consultez et g\u00E9rez les informations de l'employ\u00E9" })] }), _jsx(Box, { position: "absolute", top: "3px", right: "5px", children: _jsx(UpdateEmployee, { _id: _id, employee: employee }) })] }) }), _jsxs(HStack, { marginTop: "3px", children: [_jsx(Box, { bg: "#0E1E47", borderWidth: "1px", borderRadius: "18px", border: "none", height: "74vh", width: "28vw", children: _jsxs(VStack, { position: "relative", top: "60px", children: [_jsx(Image, { src: source, height: "120px", width: "120px", boxSize: "120px", borderRadius: "full", fit: "cover" }), _jsxs(Text, { color: "gray.200", fontWeight: "700", fontSize: "1.4rem", position: "relative", children: [employee?.firstName, " ", employee?.lastName] }), _jsx(Text, { color: "#C7D2FE", position: "relative", bottom: "15px", fontSize: "1rem", children: employee?.role }), _jsxs(HStack, { bg: "#08162b", width: "80px", border: "none", borderRadius: "40px", marginLeft: "12px", children: [_jsx("span", { style: { position: "relative", left: "5px" }, children: _jsx(GoDotFill, { color: "green", size: "1rem" }) }), _jsx(Text, { position: "relative", top: "7px", color: "green.400", children: "Actif" })] }), _jsx(Divider, { orientation: "horizontal", color: "gray.400" }), _jsxs(Box, { position: "relative", top: "30px", children: [_jsx(Text, { color: "#C7D2FE", fontSize: "1.3rem", children: "Matricule" }), _jsx(Text, { fontSize: "1.2rem", color: "#F2B705", children: employee?.employeeID })] }), _jsxs(Button, { borderColor: "black", bg: "brown", borderRadius: "15px", borderWidth: "4px", size: "lg", position: "relative", top: "85px", onClick: onOpen, children: [_jsx(MdDeleteForever, { color: "#ffffff", size: "23px" }), _jsx(Text, { position: "relative", top: "8px", left: "5px", fontSize: "1.2rem", color: "#ffffff", children: "Supprimer" })] })] }) }), _jsx(Box, { bg: "#03143B", border: "none", borderWidth: "1px", borderRadius: "18px", height: "74vh", width: "50vw", marginTop: "1px", children: _jsx(EmployeeDetailsTab, { employee: employee }) })] })] }) })] }));
};
export default EmployeeDetailsPage;
