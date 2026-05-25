import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Box, Button, Editable, EditableInput, EditablePreview, HStack, Image, Text, } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import { CiClock2 } from "react-icons/ci";
import { GiClockwork } from "react-icons/gi";
import { GoDotFill } from "react-icons/go";
import { Link } from "react-router-dom";
// @ts-ignore
import { useEffect, useState } from "react";
import "../styles/App.css";
const EmployeeCard = ({ employee }) => {
    const [attendance, setAttendance] = useState(null);
    const [_clockIn, setClockIn] = useState("");
    const [isClockingIn, setIsClockingIn] = useState(false);
    const [displayClock, setDisplayClock] = useState(true);
    const [showEditable, setShowEditable] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    useEffect(() => {
        axios
            .get(`${API_URL}/attendances/${employee._id}`)
            .then((res) => {
            setAttendance(res.data);
            console.log("Attendance received: ", res.data);
        })
            .catch((error) => {
            console.error("Error while fetching attendance: ", error);
        });
    }, []);
    const handleToggleClockInEdit = () => {
        console.log("isClockingIn value", isClockingIn);
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
        const [hours, minutes] = _clockIn.split(":").map(Number);
        const clockIn = new Date();
        clockIn.setHours(hours, minutes, 0, 0);
        await axios
            .post(`${API_URL}/attendances/${employee._id}`, {
            clockIn,
        })
            .then((response) => {
            console.log("Attendance success:", response.data);
            setAttendance(response.data);
            setDisplayClock(false);
            setShowEditable(false);
        })
            .catch((error) => console.error(error));
    };
    const flashLate = keyframes `
  0% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.2;
    transform: scale(1.08);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;
    return (_jsxs(HStack, { bg: "#0A1F57", height: "80px", width: "70vw", padding: "10px", borderRadius: "10px", position: "relative", right: "20px", spacing: 5, children: [_jsx(Box, { children: _jsx(Link, { to: {
                        pathname: `/employees_admin/employees_list/${employee._id}`,
                    }, children: _jsx(Image, { src: `/src/ui/assets/employee_photos/jeanne.jpeg`, boxSize: "70px", borderRadius: "full", fit: "cover" }) }) }), _jsxs(Box, { position: "relative", top: "10px", children: [_jsxs(Text, { color: "gray.200", fontWeight: "500", fontSize: "23px", fontFamily: "revert-layer", position: "relative", left: "30px", children: [employee.firstName, " ", employee.lastName] }), _jsxs(HStack, { position: "relative", left: "30px", bottom: "12px", children: [_jsx(Text, { color: "#A9B4D0", fontSize: "16px", fontWeight: "400", children: employee.role }), " ", _jsx(Box, { color: "green", fontSize: "14px", position: "relative", bottom: "7px", children: _jsx(GoDotFill, {}) }), _jsx(Text, { color: "#8ECDF8", fontWeight: "500", children: employee.department })] })] }), _jsxs(Box, { children: [_jsxs(Box, { children: [_jsx(Box, { opacity: attendance ? 1 : 0, pointerEvents: attendance ? "auto" : "none", animation: attendance?.status !== "ponctuel"
                                    ? `${flashLate} 1.4s ease-in-out 3`
                                    : undefined, position: "absolute", top: "15px", right: "150px", children: _jsxs(Badge, { bg: attendance?.status === "ponctuel" ? "#123D2B" : "#4A1F2D", color: attendance?.status === "ponctuel" ? "#5EF29B" : "#FF6B81", fontSize: "14px", children: [attendance?.status === "ponctuel" ? "A l'heure" : null, attendance?.status === "retard" ? "En retard" : null] }) }), _jsx(Box, { opacity: attendance ? 1 : 0, pointerEvents: attendance ? "auto" : "none", position: "absolute", top: "20px", right: "60px", children: _jsx(CiClock2, { color: "#F2B705", size: "22px" }) }), _jsxs(Text, { opacity: attendance ? 1 : 0, pointerEvents: attendance ? "auto" : "none", position: "absolute", top: "18px", right: "0.1px", color: "gray.300", fontSize: "17px", children: [attendance?.clockIn &&
                                        String(new Date(attendance.clockIn).getHours()).padStart(2, "0"), ":", attendance?.clockIn &&
                                        String(new Date(attendance.clockIn).getMinutes()).padStart(2, "0")] })] }), _jsxs(Box, { children: [!attendance && displayClock ? (_jsx(Button, { position: "absolute", top: "18px", right: "10px", color: "#F2B705", backgroundColor: "transparent", _hover: { bg: "transparent" }, onClick: handleToggleClockInEdit, children: _jsx(GiClockwork, { className: "fa-3x", size: "2rem" }) })) : null, showEditable && (_jsx(Box, { children: _jsxs(Editable, { width: "65px", position: "absolute", right: "63px", bottom: "25px", defaultValue: _clockIn, onChange: (clockIn) => setClockIn(clockIn), submitOnBlur: false, onSubmit: handleClockInSubmit, children: [_jsx(EditablePreview, { color: "yellow", fontSize: "18px", animation: "pulse 1.7s infinite", _focus: {
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
                                            } }), _jsx(EditableInput, { color: "#ffffff" })] }) }))] })] })] }));
};
export default EmployeeCard;
