import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, HStack, Icon, Stack, Text, VStack, useDisclosure, } from "@chakra-ui/react";
import { FiClock, FiBriefcase, FiCalendar } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { FaDollarSign } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAdminUser from "../../store/auth.store";
import EmployeeDetailsTab from "../components/EmployeeDetailsTab";
import UpdateEmployee from "../components/UpdateEmployee";
import ComponentErrorFallback from "./ComponentErrorFallback";
import NotAuthorized from "../components/NotAuthorized";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa";
import EmployeePhotoUpload from "../components/EmployeePhotoUpload";
const EmployeeDetailsPage = () => {
    const [employee, setEmployee] = useState({});
    const [attendance, setAttendance] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { _id } = useParams();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);
    const adminUser = useAdminUser((store) => store.adminUser);
    const location = useLocation();
    const { photo_url } = location.state || "";
    useEffect(() => {
        if (!_id)
            return;
        window.electron.employees
            .getById(_id)
            .then((employee) => {
            setEmployee(employee);
            console.log("EMPLOYEE FETCHED: ", employee);
            return window.electron.attendance.getAttendanceRecord(employee._id, new Date().toISOString().split("T")[0]);
        })
            .then((attendance) => {
            setAttendance(attendance);
            console.log("ATTENDANCE FETCHED: ", attendance);
        })
            .catch((error) => {
            console.error("ERROR FETCHING DATA:", error);
        });
    }, [_id]);
    const refreshEmployee = async () => {
        try {
            if (!_id)
                return;
            const updatedEmployee = await window.electron.employees.getById(_id);
            setEmployee(updatedEmployee);
            console.log("FETCHED UPDATED EMPLOYEE:", updatedEmployee);
        }
        catch (error) {
            console.error("AN ERROR OCCURED WHILE FETCHING EMPLOYEE", error);
        }
    };
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (!_id)
                return;
            await window.electron.employees.delete(_id);
            navigate("/employees_admin/employees_list");
        }
        catch (error) {
            console.error("UNABLE TO DELETE EMPLOYEE:", error);
        }
        finally {
            setIsDeleting(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(AlertDialog, { isOpen: isOpen, leastDestructiveRef: cancelRef, onClose: onClose, children: _jsx(AlertDialogOverlay, { backdropFilter: "blur(8px)", children: _jsxs(AlertDialogContent, { bg: "#08162b", color: "white", mx: 4, position: "relative", top: "3rem", children: [_jsx(AlertDialogHeader, { children: "Supprimer l'employ\u00E9" }), _jsxs(AlertDialogBody, { children: ["\u00CAtes-vous s\u00FBr de vouloir supprimer", " ", _jsxs("b", { style: { color: "#F2B705" }, children: [employee?.firstName, " ", employee?.lastName] }), " ", "de la liste des employ\u00E9s ?"] }), _jsx(AlertDialogFooter, { children: _jsxs(HStack, { children: [_jsx(Button, { colorScheme: "red", onClick: handleDelete, leftIcon: _jsx(MdAutoDelete, { fontSize: "1.2rem" }), isLoading: isDeleting, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: isDeleting, children: "Supprimer" }), _jsx(Button, { ref: cancelRef, onClick: onClose, leftIcon: _jsx(RxCrossCircled, { fontSize: "1.2rem" }), children: "Annuler" })] }) })] }) }) }), _jsx(Box, { position: "relative", bg: "#F8F9FB", w: "100%", maxW: "1400px", mx: "auto", ml: "0.01rem", height: "94.8vh", children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(Stack, { direction: { base: "column", md: "row" }, justify: "space-between", align: { base: "flex-start", md: "center" }, spacing: 4, children: [_jsxs(HStack, { align: "center", children: [_jsx(Link, { to: "/employees_admin/employees_list", children: _jsx(Box, { p: 2, border: "1px solid #14376b", borderRadius: "10px", ml: "0.5rem", mb: "1.3rem", children: _jsx(FaArrowLeftLong, { color: "black" }) }) }), _jsxs(Box, { ml: "0.5rem", mt: "0.8rem", children: [_jsx(Text, { fontSize: "1.4rem", fontWeight: "600", color: "#1F2937", children: "D\u00E9tails de l'employ\u00E9" }), _jsx(Text, { fontSize: "1rem", fontWeight: "500", color: "gray.500", position: "relative", bottom: "1.4rem", children: "Consultez et g\u00E9rez les informations de l'employ\u00E9" })] })] }), _jsxs(HStack, { children: [_jsx(Link, { to: {
                                                pathname: `/employees_admin/employees_list/${_id}/attendances`,
                                            }, state: { employee, photo_url, attendance }, children: _jsxs(HStack, { cursor: "pointer", bg: "gray.100", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", borderRadius: "0.4rem", padding: "0.4rem", children: [_jsx(FaRegClock, { size: "1.3rem", color: "purple" }), _jsx(Text, { color: "gray.900", position: "relative", top: "0.4rem", children: "Pr\u00E9sence" })] }) }), _jsx(Link, { to: {
                                                pathname: `/employees_admin/employees_list/${_id}/leaves`,
                                            }, state: { employee, photo_url }, children: _jsxs(HStack, { cursor: "pointer", bg: "gray.100", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", borderRadius: "0.4rem", padding: "0.4rem", children: [_jsx(CiCalendarDate, { size: "1.3rem", color: "purple" }), _jsx(Text, { position: "relative", top: "0.4rem", children: "Cong\u00E9s" })] }) }), _jsx(Link, { to: {
                                                pathname: `/employees_admin/employees_list/${_id}/payslips`,
                                            }, state: { employee, photo_url }, children: _jsxs(HStack, { cursor: "pointer", bg: "gray.100", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", borderRadius: "0.4rem", padding: "0.4rem", children: [_jsx(FaDollarSign, { size: "1.3rem", color: "purple" }), _jsx(Text, { position: "relative", top: "0.4rem", children: "Fiche de paye" })] }) })] }), adminUser?.role === "manager" ? (_jsx(ErrorBoundary, { FallbackComponent: ComponentErrorFallback, children: _jsx(Box, { position: "relative", bottom: "1rem", children: _jsx(UpdateEmployee, { _id: _id, employee: employee, onUpdated: refreshEmployee }) }) })) : (_jsx(Box, { position: "relative", right: "1.3rem", bottom: "1.5rem", children: _jsx(NotAuthorized, { buttonText: "Modifier", icon: FaUserEdit, placement: "left", width: "13rem", color: "#4F46E5" }) }))] }), _jsxs(Stack, { direction: { base: "column", lg: "row" }, spacing: 4, children: [_jsxs(Box, { children: [_jsxs(Box, { border: "1px solid", borderColor: "#D1D9E0", width: "27vw", ml: "1rem", bg: "#ffffff", children: [_jsx(Box, { bg: "purple.700", height: "8rem" }), _jsx(Box, { height: "15vh", bg: "#ffffff", position: "relative", children: _jsx(EmployeePhotoUpload, { employeeId: _id, currentPhoto: photo_url, onUploaded: refreshEmployee }) }), _jsxs(VStack, { position: "relative", bottom: "3rem", bg: "#ffffff", spacing: 3, children: [_jsxs(Text, { fontSize: "1.2rem", fontWeight: "700", color: "gray.700", textAlign: "center", children: [employee?.firstName, " ", employee?.lastName] }), _jsx(Text, { color: "purple.500", children: employee?.role }), _jsxs(HStack, { bg: "green.100", px: 3, py: 1, borderRadius: "1.1rem", children: [_jsx(GoDotFill, { color: "green", size: "1.3rem" }), _jsx(Text, { color: "green.700", position: "relative", top: "0.4rem", right: "0.3rem", fontSize: "1rem", children: "Actif" })] })] })] }), _jsxs(VStack, { spacing: 4, align: "stretch", ml: 4, mt: 1, position: "relative", bottom: "0.3rem", children: [_jsx(Box, { borderWidth: "1px", borderColor: "gray.200", p: 4, bg: "white", boxShadow: "sm", children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(Flex, { justify: "space-between", align: "center", children: [_jsxs(HStack, { spacing: 3, children: [_jsx(Flex, { w: "42px", h: "42px", bg: "purple.50", justify: "center", align: "center", children: _jsx(Icon, { as: FiBriefcase, color: "purple.500", boxSize: 5 }) }), _jsx(Box, { children: _jsx(Text, { fontWeight: "bold", children: "D\u00E9partement" }) })] }), _jsx(Text, { fontWeight: "400", children: employee?.department })] }), _jsxs(Flex, { justify: "space-between", align: "center", children: [_jsxs(HStack, { spacing: 3, children: [_jsx(Flex, { w: "42px", h: "42px", bg: "purple.50", justify: "center", align: "center", children: _jsx(Icon, { as: FiCalendar, color: "purple.500", boxSize: 5 }) }), _jsx(Box, { children: _jsx(Text, { fontWeight: "bold", children: "Date d'embauche" }) })] }), _jsx(Text, { fontWeight: "400", children: employee?.dateHired &&
                                                                            new Date(employee?.dateHired).toLocaleDateString("fr-FR") })] })] }) }), _jsx(Box, { borderWidth: "1px", borderColor: "gray.200", p: 4, bg: "white", boxShadow: "sm", position: "relative", bottom: "1rem", children: _jsx(Flex, { justify: "space-between", align: "center", children: attendance?.status === "CONGÉ" ||
                                                            attendance?.status === "ABSENT" ? (_jsx(HStack, { spacing: 2, children: _jsx(Text, { fontWeight: "bold", color: attendance.status === "CONGÉ"
                                                                    ? "blue.500"
                                                                    : "red.500", position: "relative", left: "8rem", fontSize: "1.1rem", children: attendance?.status === "CONGÉ"
                                                                    ? "En congé"
                                                                    : "Absent" }) })) : (_jsxs(_Fragment, { children: [_jsx(HStack, { spacing: 3, children: _jsx(Box, { children: _jsxs(HStack, { spacing: 1, color: "gray.500", fontSize: "sm", children: [_jsx(Icon, { as: FiClock, fontSize: "1.1rem", color: "purple.500" }), _jsxs(Text, { mt: "1rem", fontSize: "0.95rem", children: ["Arriv\u00E9e \u00E0", " ", attendance?.clockIn &&
                                                                                            new Date(attendance?.clockIn).toLocaleTimeString("fr-FR")] })] }) }) }), _jsx(HStack, { spacing: 2, children: _jsx(Text, { fontWeight: "bold", color: "green.500", children: attendance?.status }) })] })) }) })] }), _jsx(Box, { bg: "transparent", children: adminUser?.role === "manager" ? (_jsx(Button, { bg: "red.100", color: "red.600", width: "12rem", height: "3rem", onClick: onOpen, fontSize: "1rem", ml: "6rem", leftIcon: _jsx(FaRegTrashCan, { fontSize: "1.3rem" }), children: "Supprimer" })) : (_jsx(NotAuthorized, { buttonText: "Supprimer", icon: FaRegTrashCan, placement: "bottom", width: "13rem", color: "red" })) })] }), _jsx(Box, { bg: "#F8F9FB", border: "1px solid", borderColor: "#D1D9E0", overflowY: "auto", height: "71.8vh", children: _jsx(ErrorBoundary, { FallbackComponent: ComponentErrorFallback, children: _jsx(EmployeeDetailsTab, { employee: employee }) }) })] })] }) })] }));
};
export default EmployeeDetailsPage;
