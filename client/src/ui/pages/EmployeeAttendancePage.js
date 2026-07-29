import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, Grid, HStack, Spacer, Switch, Text, useDisclosure, VStack, } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { MdAutoDelete } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import EmployeeAttendanceCard from "../components/EmployeeAttendanceCard";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
import SearchBar from "../components/SearchBar";
import DateDropdown from "../components/DateDropdown";
import { FaSyncAlt } from "react-icons/fa";
/* ================= SHIMMER ================= */
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
}
`;
const Shimmer = ({ width = "100%", height = "18px" }) => (_jsx(Box, { borderRadius: "6px", height: height, width: width, bg: "gray.300", animation: "shimmer 1.4s ease infinite" }));
const EmployeeAttendancePage = () => {
    const [attendances, setAttendances] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("");
    const [time, setTime] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);
    const gridTemplate = `
  1.6fr 1.5fr 1.3fr 1.3fr 1fr 1fr 0.8fr
`;
    /* ================= CLOCK ================= */
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    /* Initial data fetch*/
    useEffect(() => {
        setLoading(true);
        console.log("Selected date:", selectedDate);
        window.electron.attendance
            .getByDate(selectedDate)
            .then((attendances) => {
            console.log(`Fetched attendances for ${selectedDate}`, attendances);
            setAttendances(attendances);
        })
            .catch((error) => {
            console.error(`An error occurred while fetching for ${selectedDate}`, error);
        })
            .finally(() => {
            setLoading(false);
        });
    }, [selectedDate]);
    //Attendance sync and refresh
    const handleAttendanceSync = async () => {
        try {
            setLoading(true);
            const result = await window.electron.sync();
            if (result.success) {
                console.log("Sync completed");
                const attendances = await window.electron.attendance.getByDate(selectedDate);
                console.log(`Fetched attendances for ${selectedDate}`, attendances);
                setAttendances(attendances);
            }
            else {
                console.error(result.message);
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        try {
            if (attendance?._id)
                await window.electron.attendance.delete(attendance?._id);
            setAttendances((prev) => prev.filter((att) => att._id !== attendance?._id));
            onClose();
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleExport = async () => {
        const csv = attendances
            .map((a) => `${a.firstName} ${a.lastName},${a.matricule},${a.clockIn},${a.date}`)
            .join("\n");
        await window.electron.file.save(csv);
    };
    //Get attendances without leaves
    // const attendancesWithoutLeaves = attendances?.filter(
    //   (a) => a.status != "CONGÉ" && a.status != "ABSENT"
    // );
    return (_jsxs(Flex, { direction: "column", ml: "0.02rem", width: "100vw", h: "95.1vh", bg: "#F8FAFC", children: [_jsx(AlertDialog, { isOpen: isOpen, leastDestructiveRef: cancelRef, onClose: onClose, returnFocusOnClose: false, children: _jsx(AlertDialogOverlay, { backdropFilter: "auto", backdropBlur: "0.5rem", children: _jsxs(AlertDialogContent, { bg: "#08162b", color: "#ffffff", position: "relative", top: "180px", children: [_jsx(AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", children: "Supprimer de la liste de pr\u00E9sence" }), _jsxs(AlertDialogBody, { children: ["Etes vous sur de vouloir supprimer", " ", _jsxs("span", { style: { color: "#F2B705", fontWeight: "bold" }, children: [" ", attendance?.firstName, " "] }), _jsxs("span", { style: { color: "#F2B705", fontWeight: "bold" }, children: [" ", attendance?.lastName, " "] }), "de la liste de pr\u00E9sence?"] }), _jsx(AlertDialogFooter, { children: _jsxs(HStack, { position: "relative", right: "2rem", children: [_jsx(Button, { borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, onClick: handleDelete, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(MdAutoDelete, { size: "1.2rem" }) }), _jsxs(Text, { marginTop: "0.9rem", fontSize: "1rem", children: [" ", "Supprimer"] })] }) }), _jsx(Button, { ref: cancelRef, borderColor: "#ffffff", borderRadius: "10px", bg: "#08162b", borderWidth: "0.5px", colorScheme: " #320b01", color: "#1a000d", mr: 3, onClick: onClose, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(RxCrossCircled, { color: "#ffffff", size: "1.2rem" }) }), _jsx(Text, { color: "#ffffff", marginTop: "0.9rem", fontSize: "1rem", children: "Annuler" })] }) })] }) })] }) }) }), _jsxs(Flex, { direction: "column", bg: "#F8F9FB", height: "10rem", width: "80vw", children: [_jsxs(Flex, { children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Text, { color: "#1F2937", fontSize: "clamp(1.3rem, 1vw + 0.8rem, 1.4rem)", fontWeight: "700", ml: "0.5rem", mt: "0.7rem", children: "Pr\u00E9sences" }), _jsx(Button, { bg: "transparent", isLoading: loading, color: "gray.800", _hover: { bg: "transparent" }, fontSize: "1rem", position: "relative", bottom: "0.2rem", right: "1rem", onClick: handleAttendanceSync, children: _jsx(FaSyncAlt, {}) })] }), _jsx(Text, { fontWeight: "500", left: "0.45rem", fontSize: "clamp(1rem, 1vw + 0.8rem, 1.1rem)", color: "gray.500", position: "relative", bottom: "1.4rem", children: "G\u00E9rez la liste de pr\u00E9sence" })] }), _jsx(Spacer, {}), _jsxs(Button, { bg: "#4F46E5", color: "#ffffff", onClick: handleExport, mt: "0.5rem", mr: "1.3rem", children: [_jsx(HiOutlineDownload, {}), " Exporter"] })] }), _jsxs(Flex, { children: [_jsx(Box, { ml: "0.5rem", children: _jsx(EmployeeFilterMenu, { onFilterClicked: setFilter }) }), _jsx(Spacer, {}), _jsx(Box, { children: _jsx(SearchBar, { onSearch: setSearchText }) })] })] }), _jsxs(Grid, { templateColumns: gridTemplate, px: 10, fontWeight: "600", bg: "#F8F9FB", borderWidth: "0.3px", border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(15,23,42,.06)", height: "4.7rem", width: "80vw", overflowY: "hidden", overflowX: "hidden", mt: "1rem", ml: "0.5rem", children: [_jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: "0.7rem", children: "Employ\u00E9" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: "0.7rem", children: "ID" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: "0.7rem", children: "Poste" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: "0.7rem", children: "Departement" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: "0.7rem", children: "Arriv\u00E9e" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: "0.7rem", children: "D\u00E9part" }), _jsx(Text, { color: "gray.800", fontSize: "1.1rem", mt: "0.7rem", children: "Actions" })] }), _jsx(Box, { height: "90vh", overflowY: "auto", overflowX: "hidden", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Box, { as: "style", children: shimmerKeyframes }), _jsx(VStack, { spacing: 3, children: [...Array(6)].map((_, i) => (_jsx(Shimmer, { height: "40px" }, i))) })] })) : attendances.length === 0 ? (_jsx(Text, { position: "relative", top: "12rem", left: "20rem", color: "gray.700", fontSize: "2.1rem", fontWeight: "500", children: "Pas de pr\u00E9sence enregistr\u00E9e" })) : (attendances
                    // .filter((a) => a.status !== "ABSENT" && a.status !== "CONGÉ")
                    .filter((a) => !filter || a.department === filter)
                    .filter((a) => `${a.firstName} ${a.lastName}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase()))
                    .map((attendance) => (_jsx(EmployeeAttendanceCard, { attendance: attendance, gridTemplate: gridTemplate, onDelete: () => {
                        setAttendance(attendance);
                        onOpen();
                    }, isUnlocked: unlocked, toggleOff: () => setUnlocked(false) }, attendance._id)))) }), _jsxs(Flex, { bg: "linear-gradient(\n        135deg,\n        rgba(255,255,255,0.08),\n        rgba(255,255,255,0.03)\n      )", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", mr: "0.15rem", height: "6rem", justify: "space-between", width: "82vw", children: [_jsx(Box, { mt: "0.6rem", ml: "1rem", fontSize: "1.2rem", fontFamily: "monospace", fontWeight: "600", children: _jsx(DateDropdown, { onChange: setSelectedDate }) }), _jsx(Box, { mt: "0.8rem", children: _jsx(Switch, { colorScheme: "blue", size: "lg", isChecked: unlocked, onChange: (e) => setUnlocked(e.target.checked) }) }), _jsxs(Box, { color: "gray.800", fontSize: "24px", fontWeight: "600", mt: "0.6rem", mr: "2rem", children: [String(time.getHours()).padStart(2, "0"), ":", String(time.getMinutes()).padStart(2, "0"), ":", String(time.getSeconds()).padStart(2, "0")] })] })] }));
};
export default EmployeeAttendancePage;
