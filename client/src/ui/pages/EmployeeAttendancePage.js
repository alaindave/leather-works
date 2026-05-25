import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, Grid, HStack, Text, VStack, useDisclosure, } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import EmployeeAttendanceCard from "../components/EmployeeAttendanceCard";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
/* ================= SHIMMER ================= */
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;
const Shimmer = ({ width = "100%", height = "18px" }) => (_jsx(Box, { borderRadius: "6px", height: height, width: width, background: "linear-gradient(90deg, #0A1F57 25%, #132C68 37%, #0A1F57 63%)", backgroundSize: "400% 100%", animation: "shimmer 1.4s ease infinite" }));
const EmployeeAttendancePage = () => {
    const [attendances, setAttendances] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("");
    const [time, setTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);
    const navigate = useNavigate();
    const gridTemplate = `
    1.5fr 1.4fr 1.3fr 1.3fr 115px 115px 115px
  `;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        axios
            .get(`${API_URL}/attendances`)
            .then((res) => {
            setAttendances(res.data);
        })
            .catch((error) => {
            console.error(error);
        })
            .finally(() => {
            setLoading(false);
        });
        return () => clearInterval(interval);
    }, []);
    const handleOnSearch = (searchText) => {
        setSearchText(searchText);
    };
    const handleFilterClicked = (filter) => {
        setFilter(filter);
    };
    const handleDeleteClick = (attendance) => {
        onOpen();
        setAttendance(attendance);
    };
    const handleDelete = async () => {
        axios
            .delete(`${API_URL}/attendances/${attendance?._id}`)
            .then(() => {
            setAttendances(attendances.filter((att) => att._id !== attendance?._id));
            onClose();
        })
            .catch((error) => console.error(error));
    };
    const handleAttendanceExport = async () => {
        const attendance_csv = attendances
            .map((a) => `${a.employee.firstName} ${a.employee.lastName},${a.employee.employeeID},${a.clockIn},${a.date}`)
            .join("\n");
        try {
            const result = await window.electron.file.save(attendance_csv);
            console.log(result);
        }
        catch (e) {
            console.log(e);
        }
    };
    if (loading)
        return (_jsxs(_Fragment, { children: [_jsx(Box, { as: "style", children: shimmerKeyframes }), _jsxs(VStack, { spacing: 0, align: "stretch", ml: "3px", children: [_jsxs(Box, { position: "relative", top: "50px", bg: "#03143B", height: "200px", borderRadius: "20px", p: 4, children: [_jsx(Shimmer, { width: "220px", height: "28px" }), _jsx(Box, { mt: 2, children: _jsx(Shimmer, { width: "320px", height: "16px" }) }), _jsx(Box, { position: "absolute", top: "10px", right: "10px", children: _jsx(Shimmer, { width: "140px", height: "38px" }) }), _jsx(Box, { position: "absolute", left: "10px", bottom: "10px", children: _jsx(Shimmer, { width: "180px", height: "38px" }) }), _jsx(Box, { position: "absolute", right: "10px", bottom: "10px", children: _jsx(Shimmer, { width: "250px", height: "38px" }) })] }), _jsx(Grid, { templateColumns: gridTemplate, bg: "#08162b", mt: "52px", height: "70px", ml: "5px", alignItems: "center", px: 6, children: [...Array(7)].map((_, i) => (_jsx(Shimmer, { width: "90px", height: "18px" }, i))) }), _jsx(Box, { height: "90vh", width: "80vw", overflow: "hidden", children: [...Array(6)].map((_, i) => (_jsxs(Grid, { templateColumns: gridTemplate, bg: "#0A1F57", borderBottom: "1px solid #1E355A", alignItems: "center", px: 6, py: 4, children: [_jsx(Shimmer, { width: "160px" }), _jsx(Shimmer, { width: "90px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "120px" }), _jsx(Shimmer, { width: "90px" }), _jsx(Shimmer, { width: "90px" }), _jsxs(HStack, { spacing: 3, children: [_jsx(Shimmer, { width: "30px", height: "30px" }), _jsx(Shimmer, { width: "30px", height: "30px" })] })] }, i))) }), _jsxs(Flex, { bg: "#08162b", height: "120px", borderRadius: "16px", justify: "space-between", align: "center", px: 4, children: [_jsx(Shimmer, { width: "260px", height: "20px" }), _jsx(Shimmer, { width: "120px", height: "20px" })] })] })] }));
    /* ================= NORMAL UI ================= */
    if (attendances?.length > 0 && attendance?.employee !== null)
        return (_jsxs(_Fragment, { children: [_jsx(AlertDialog, { isOpen: isOpen, leastDestructiveRef: cancelRef, onClose: onClose, children: _jsx(AlertDialogOverlay, { backdropFilter: "auto", backdropBlur: "30px", bgGradient: "radial(circle,#47370b, #061962)", children: _jsxs(AlertDialogContent, { bg: "#08162b", color: "#ffffff", position: "relative", top: "180px", children: [_jsx(AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", children: "Supprimer de la liste de pr\u00E9sence" }), _jsxs(AlertDialogBody, { children: ["Etes vous sur de vouloir supprimer", " ", _jsxs("span", { style: { color: "#F2B705", fontWeight: "bold" }, children: [" ", attendance?.employee.firstName, " "] }), _jsxs("span", { style: { color: "#F2B705", fontWeight: "bold" }, children: [" ", attendance?.employee.lastName, " "] }), "de la liste de pr\u00E9sence?"] }), _jsx(AlertDialogFooter, { children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, onClick: handleDelete, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(MdAutoDelete, { size: "1.2rem" }) }), _jsxs(Text, { marginTop: "0.9rem", fontSize: "1rem", children: [" ", "Supprimer"] })] }) }), _jsx(Button, { ref: cancelRef, borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: onClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "1.2rem" }) }), _jsx(Text, { color: "#ffffff", marginTop: "0.9rem", fontSize: "1rem", children: "Annuler" })] }) })] }) })] }) }) }), _jsxs(VStack, { spacing: 0, align: "stretch", ml: "3px", children: [_jsxs(Box, { position: "relative", top: "50px", bg: "#03143B", height: "200px", borderRadius: "20px", children: [_jsxs(HStack, { children: [_jsxs(Box, { marginBottom: "20px", children: [_jsx(Text, { color: "#ffffff", fontSize: "27px", fontWeight: "700", marginLeft: "15px", marginTop: "10px", children: "Pr\u00E9sence" }), _jsx(Text, { color: "#ffffff", fontSize: "15px", fontWeight: "500", position: "relative", bottom: "20px", marginLeft: "15px", children: "G\u00E9rez la liste de pr\u00E9sence" })] }), _jsxs(Button, { bg: "#F2B705", onClick: handleAttendanceExport, position: "absolute", top: "10px", right: "10px", children: [_jsx(HiOutlineDownload, {}), "Exporter"] })] }), _jsx(Box, { position: "absolute", left: "1px", bottom: "1px", children: _jsx(EmployeeFilterMenu, { onFilterClicked: handleFilterClicked }) }), _jsx(Box, { position: "absolute", right: "1px", bottom: "1px", children: _jsx(SearchBar, { onSearch: handleOnSearch }) })] }), _jsxs(Grid, { templateColumns: gridTemplate, px: 10, bg: "gray.400", fontWeight: "600", background: "#08162b", overflowX: "auto", mt: "52px", height: "70px", marginLeft: "5px", children: [_jsx(Text, { color: "#d6b65c", fontSize: "18px", marginTop: "12px", position: "relative", right: "28px", children: "Employ\u00E9" }), _jsx(Text, { color: "#d6b65c", fontSize: "18px", marginTop: "12px", position: "relative", children: "ID" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", marginTop: "12px", position: "relative", children: "Poste" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", marginTop: "12px", position: "relative", children: "Departement" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", marginTop: "12px", position: "relative", left: "18px", children: "Arriv\u00E9e" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", marginTop: "12px", position: "relative", left: "22px", children: "D\u00E9part" }), _jsx(Text, { fontSize: "18px", color: "#d6b65c", marginTop: "12px", position: "relative", left: "22px", children: "Actions" })] }), _jsx(Box, { mt: 0.5, mb: 0.8, height: "90vh", width: "80vw", overflowX: "auto", overflowY: "auto", children: attendances
                                .filter((attendance) => !filter || attendance.employee.department === filter)
                                .filter((attendance) => `${attendance.employee.firstName} ${attendance.employee.lastName} ${" "} ${" "}`
                                .toLowerCase()
                                .includes(searchText.toLowerCase()))
                                .map((attendance) => (_jsx(EmployeeAttendanceCard, { attendance: attendance, gridTemplate: gridTemplate, onDelete: () => handleDeleteClick(attendance) }, attendance._id))) }), _jsxs(Flex, { bg: "#08162b", mb: "3px", height: "120px", borderRadius: "16px", justify: "space-between", children: [_jsxs(Text, { color: "#F2B705", fontSize: "1.5rem", fontFamily: "monospace", fontWeight: "600", position: "relative", top: "22px", marginLeft: "12px", children: ["Pr\u00E9sence du ", new Date().toLocaleDateString("fr-FR")] }), _jsxs(Box, { color: "#F2B705", fontSize: "24px", fontWeight: "600", position: "relative", top: "25px", marginRight: "12px", children: [String(time.getHours()).padStart(2, "0"), ":", String(time.getMinutes()).padStart(2, "0"), ":", String(time.getSeconds()).padStart(2, "0")] })] })] })] }));
    // no attendance to show
    else
        return (_jsx(Text, { fontSize: "35px", fontStyle: "revert", fontWeight: "600", color: "gray.200", position: "relative", top: "350px", left: "200px", children: "Pas de pr\u00E9sence enregistr\u00E9e aujourd'hui." }));
};
export default EmployeeAttendancePage;
