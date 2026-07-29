import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Box, Button, Editable, EditableInput, EditablePreview, Flex, HStack, Image, Text, } from "@chakra-ui/react";
import { GiClockwork } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
// @ts-ignore
import { useEffect, useState } from "react";
import "../styles/App.css";
import AddClockInNotesPopover from "./AddClockInNotesPopover";
import defaultAvatar from "../assets/default-avatar.jpeg";
function formatClockInTime(input) {
    const cleaned = input.trim().replace(/[hH]/g, ":");
    // Handle 0830
    if (/^\d{4}$/.test(cleaned)) {
        const hours = Number(cleaned.slice(0, 2));
        const minutes = Number(cleaned.slice(2, 4));
        if (Number.isNaN(hours) ||
            Number.isNaN(minutes) ||
            hours > 23 ||
            minutes > 59) {
            return null;
        }
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
    // Handle 08:30, 8:30, 08H30, 08h30
    const match = cleaned.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!match)
        return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours > 23 ||
        minutes > 59) {
        return null;
    }
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
const EmployeeCard = ({ employee }) => {
    const [attendance, setAttendance] = useState(null);
    const [_clockIn, setClockIn] = useState("");
    const [isClockingIn, setIsClockingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [displayClock, setDisplayClock] = useState(true);
    const [showEditable, setShowEditable] = useState(false);
    const [loadingAttendance, setLoadingAttendance] = useState(true);
    const [photo_url, setPhotoUrl] = useState("");
    //Fetch attendance
    useEffect(() => {
        window.electron.attendance
            .getAttendanceRecord(employee._id, new Date().toISOString().split("T")[0])
            .then((attendance) => {
            setAttendance(attendance);
            console.log("Attendance fetched: ", attendance);
        })
            .catch((error) => {
            console.error("An error occured while fetching attendance data: ", error);
        })
            .finally(() => setLoadingAttendance(false));
    }, []);
    //Fetch employee photos URL
    useEffect(() => {
        async function load() {
            if (!employee.photo_path)
                return;
            const base64 = await window.electron.employees.getPhotoUrl(employee.photo_path);
            setPhotoUrl(`data:image/jpeg;base64,${base64}`);
        }
        load();
    }, [employee.photo_path]);
    const handleToggleClockInEdit = () => {
        setErrorMessage(false);
        if (isClockingIn) {
            setClockIn("");
            setShowEditable(false);
            setIsClockingIn(false);
            return;
        }
        const clockIn = new Date();
        const _clockIn = `${String(clockIn.getHours()).padStart(2, "0")}:${String(clockIn.getMinutes()).padStart(2, "0")} `;
        setClockIn(_clockIn);
        setShowEditable(true);
        setIsClockingIn(true);
    };
    const handleClockInSubmit = async () => {
        const formatted = formatClockInTime(_clockIn);
        if (!formatted) {
            setErrorMessage(true);
            return;
        }
        const [hours, minutes] = formatted.split(":").map(Number);
        const clockIn = new Date();
        clockIn.setHours(hours, minutes, 0, 0);
        console.log("Clock In to submit", clockIn.toISOString());
        await window.electron.attendance
            .create(employee._id, clockIn.toISOString())
            .then((attendance) => {
            console.log("Attendance creation success:", attendance);
            setAttendance(attendance);
            setDisplayClock(false);
            setShowEditable(false);
        })
            .catch((error) => console.error(error));
    };
    const handleLateNotes = async (lateNotes) => {
        try {
            if (!attendance?._id) {
                throw new Error("Attendance record not found");
            }
            const updatedAttendance = await window.electron.attendance.update(attendance._id, { lateNotes });
            setAttendance(updatedAttendance);
            return true;
        }
        catch (error) {
            console.error("An error occured while submitting late notes: ", error);
            return false;
        }
    };
    return (_jsxs(Flex, { w: "70rem", bg: "#ffffff", height: "5.2rem", mr: "2rem", padding: "0.3rem", position: "relative", overflowX: "hidden", overflowY: "hidden", justify: "space-between", children: [_jsxs(Flex, { width: "50rem", justify: "space-between", children: [_jsx(Link, { to: {
                            pathname: `/employees_admin/employees_list/${employee._id}`,
                        }, state: { photo_url }, children: _jsx(Image, { src: photo_url || defaultAvatar, boxSize: "70px", borderRadius: "full", fit: "cover", mt: "0.15rem", ml: "1rem" }) }), _jsxs(Box, { ml: "1rem", mt: "0.3rem", children: [_jsxs(Text, { color: "gray.900", fontWeight: "600", fontSize: "23px", fontFamily: "revert-layer", children: [employee.firstName, " ", employee.lastName] }), _jsxs(HStack, { width: "25rem", position: "relative", bottom: "0.95rem", children: [_jsx(Text, { color: "gray.700", fontSize: "16px", fontWeight: "500", children: employee.role }), " ", _jsx(Box, { color: "green", fontSize: "14px", position: "relative", bottom: "0.5rem", children: _jsx(GoDotFill, {}) }), _jsx(Text, { color: "gray.800", fontWeight: "500", children: employee.department })] })] }), _jsxs(Box, { children: [!loadingAttendance && attendance?.status === "CONGÉ" ? (_jsx(Badge, { mt: "2rem", bg: "#3182CE", color: "gray.200", fontSize: "14px", height: "22px", children: "En Cong\u00E9" })) : !loadingAttendance && attendance?.status === "ABSENT" ? (_jsx(Badge, { mt: "2rem", ml: "1rem", bg: "#E53E3E", color: "gray.200", fontSize: "14px", children: "Absent" })) : null, !loadingAttendance && attendance?.status === "PONCTUEL" ? (_jsx(Badge, { mt: "2rem", bg: "#38A169", color: "gray.200", fontSize: "14px", children: "A l'heure" })) : !loadingAttendance && attendance?.status === "RETARD" ? (_jsx(Box, { mt: "1.5rem", children: _jsx(AddClockInNotesPopover, { existingNotes: attendance?.lateNotes, onSubmit: handleLateNotes }) })) : null] }), _jsxs(HStack, { position: "relative", right: "3rem", children: [!attendance && displayClock ? (_jsx(Button, { color: "#c89704", backgroundColor: "transparent", _hover: { bg: "transparent" }, onClick: handleToggleClockInEdit, children: _jsx(GiClockwork, { className: "fa-3x", size: "2rem" }) })) : null, _jsx(Box, { ml: "1.2rem", width: "4rem", children: showEditable && (_jsxs(Editable, { visibility: showEditable ? "visible" : "hidden", pointerEvents: showEditable ? "auto" : "none", defaultValue: _clockIn, onChange: (clockIn) => setClockIn(clockIn), onFocus: () => setErrorMessage(false), submitOnBlur: false, onSubmit: handleClockInSubmit, children: [_jsx(EditablePreview, { color: "red.600", fontSize: "18px", animation: "pulse 1.7s infinite", _focus: {
                                                animation: "none",
                                            }, sx: {
                                                "@keyframes pulse": {
                                                    "0%": {
                                                        opacity: 1,
                                                    },
                                                    "50%": {
                                                        opacity: 0.3,
                                                    },
                                                    "100%": {
                                                        opacity: 1,
                                                    },
                                                },
                                            } }), _jsx(EditableInput, { color: "gray.700" })] })) })] })] }), _jsx(Box, { fontSize: "1.5rem", mt: "1.2rem", mr: "5rem", children: _jsx(BsThreeDotsVertical, {}) })] }));
};
export default EmployeeCard;
