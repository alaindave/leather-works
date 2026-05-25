import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Button, Editable, EditableInput, EditablePreview, Grid, HStack, Text, } from "@chakra-ui/react";
import axios from "axios";
import { memo, useMemo, useState } from "react";
import { GiClockwork } from "react-icons/gi";
import { FaWindowClose } from "react-icons/fa";
const formatTime = (date) => {
    if (!date)
        return "--:--";
    return `${String(new Date(date).getHours()).padStart(2, "0")}:${String(new Date(date).getMinutes()).padStart(2, "0")}`;
};
const EmployeeAttendanceCard = ({ attendance, onDelete, gridTemplate, }) => {
    const { _id, employee: { firstName, lastName, employeeID, role, department }, } = attendance;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const [localAttendance, setLocalAttendance] = useState(attendance);
    const [clockOutMode, setClockOutMode] = useState("idle");
    const formattedClockIn = useMemo(() => formatTime(localAttendance.clockIn), [localAttendance.clockIn]);
    const [clockInValue, setClockInValue] = useState(formattedClockIn);
    const formattedClockOut = useMemo(() => formatTime(localAttendance.clockOut), [localAttendance.clockOut]);
    const [clockOutValue, setClockOutValue] = useState(formattedClockOut);
    // =========================
    // Edit Clock In
    // =========================
    const handleEditClockIn = async (newTime) => {
        try {
            const response = await axios.put(`${API_URL}/attendances/${_id}`, {
                clockIn: newTime,
            });
            setLocalAttendance(response.data);
        }
        catch (error) {
            console.error("Error editing clock in:", error);
        }
    };
    // =========================
    // Toggle Clock Out
    // =========================
    const handleToggleClockOut = () => {
        if (clockOutMode === "editing") {
            setClockOutValue("");
            setClockOutMode("idle");
            return;
        }
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setClockOutValue(currentTime);
        setClockOutMode("editing");
    };
    // =========================
    // Submit Clock Out
    // =========================
    const handleSubmitClockOut = async () => {
        try {
            setClockOutMode("submitting");
            const [hours, minutes] = clockOutValue.split(":").map(Number);
            const clockOutDate = new Date();
            clockOutDate.setHours(hours, minutes, 0, 0);
            // Optimistic update
            setLocalAttendance((prev) => ({
                ...prev,
                clockOut: clockOutDate,
            }));
            const response = await axios.put(`${API_URL}/attendances/${_id}`, {
                clockOut: clockOutDate,
            });
            setLocalAttendance(response.data);
            setClockOutMode("completed");
        }
        catch (error) {
            console.error("Error clocking out:", error);
            setClockOutMode("editing");
        }
    };
    return (_jsxs(Grid, { templateColumns: gridTemplate, alignItems: "center", px: 4, py: 5, bg: "#0E1E47", borderRadius: "18px", border: "1px solid #22345F", w: "80vw", children: [_jsxs(Text, { color: "gray.200", fontSize: "18px", children: [firstName, " ", lastName] }), _jsx(Text, { color: "gray.200", fontSize: "18px", children: employeeID }), _jsx(Text, { color: "gray.200", fontSize: "18px", children: role }), _jsx(Text, { color: "gray.200", fontSize: "18px", children: department }), _jsxs(Editable, { position: "relative", bottom: "8px", right: "10px", value: clockInValue, onChange: setClockInValue, submitOnBlur: false, width: "80px", selectAllOnFocus: true, onSubmit: handleEditClockIn, children: [_jsx(EditablePreview, { color: "#63E6BE", fontSize: "18px", fontWeight: "500", px: 2, borderRadius: "6px", transition: "0.2s", _hover: {
                            bg: "rgba(255,255,255,0.05)",
                            cursor: "pointer",
                        } }), _jsx(EditableInput, { color: "white", fontSize: "18px", width: "80px" })] }), _jsx(Box, { width: "90px", minWidth: "90px", display: "flex", alignItems: "center", justifyContent: "flex-start", children: localAttendance.clockOut ? (_jsxs(Editable, { position: "relative", right: "8px", bottom: "8px", value: clockOutValue, onChange: setClockOutValue, submitOnBlur: false, selectAllOnFocus: true, width: "80px", onSubmit: async (newTime) => {
                        try {
                            const [hours, minutes] = newTime.split(":").map(Number);
                            const updatedClockOut = new Date(localAttendance.clockOut);
                            updatedClockOut.setHours(hours, minutes, 0, 0);
                            // Optimistic UI update
                            setLocalAttendance((prev) => ({
                                ...prev,
                                clockOut: updatedClockOut,
                            }));
                            const response = await axios.put(`${API_URL}/attendances/${_id}`, {
                                clockOut: updatedClockOut,
                            });
                            setLocalAttendance(response.data);
                        }
                        catch (error) {
                            console.error("Error editing clock out:", error);
                        }
                    }, children: [_jsx(EditablePreview, { color: "#FF9E7A", fontSize: "18px", fontWeight: "500", px: 2, borderRadius: "6px", transition: "0.2s", _hover: {
                                bg: "rgba(255,255,255,0.05)",
                                cursor: "pointer",
                            } }), _jsx(EditableInput, { color: "white", fontSize: "18px", width: "80px" })] })) : clockOutMode === "editing" || clockOutMode === "submitting" ? (_jsxs(Editable, { value: clockOutValue, onChange: setClockOutValue, onSubmit: handleSubmitClockOut, submitOnBlur: false, selectAllOnFocus: true, width: "80px", position: "relative", bottom: "8px", children: [_jsx(EditablePreview, { color: "red.500", fontSize: "18px", px: 2, width: "80px", animation: clockOutMode === "submitting" ? "none" : "pulse 1.7s infinite", sx: {
                                "@keyframes pulse": {
                                    "0%": { opacity: 1 },
                                    "50%": { opacity: 0.3 },
                                    "100%": { opacity: 1 },
                                },
                            } }), _jsx(EditableInput, { color: "white", fontSize: "18px", width: "80px" })] })) : (_jsx(Text, { color: "gray.400", width: "80px", fontSize: "18px", px: 2, children: "--:--" })) }), _jsxs(HStack, { spacing: 1, position: "relative", bottom: "8px", children: [!localAttendance.clockOut && (_jsx(Button, { bg: "transparent", _hover: {
                            bg: "transparent",
                        }, color: clockOutMode === "editing" ? "red.300" : "#F2B705", onClick: handleToggleClockOut, children: _jsx(GiClockwork, { size: "1.8rem" }) })), _jsx(Button, { bg: "transparent", _hover: {
                            bg: "transparent",
                        }, color: "#ff4d4d", onClick: onDelete, children: _jsx(FaWindowClose, { size: "1.1rem" }) })] })] }));
};
export default memo(EmployeeAttendanceCard);
