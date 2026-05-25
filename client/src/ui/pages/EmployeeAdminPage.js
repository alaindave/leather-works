import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Flex, HStack, Icon, StackDivider, Text, Textarea, } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
import { FaSave } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import { TfiAnnouncement } from "react-icons/tfi";
import useAdminUser from "../../store/authStore";
import EmployeeDashboard from "../components/EmployeeDashboard";
const EmployeeAdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [time, setTime] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [announcement, setAnnouncement] = useState("");
    const [liveAnnouncement, setLiveAnnouncement] = useState(null);
    const [oldAnnouncements, setOldAnnouncements] = useState([]);
    const adminUser = useAdminUser((store) => store.adminUser);
    const lateCount = attendances.filter((attendance) => attendance.status === "retard");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    //useEffect for initial data fetch and live clock
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 10000);
        axios
            .get(`${API_URL}/employees`)
            .then((res) => {
            setEmployees(res.data);
            return axios.get(`${API_URL}/attendances`);
        })
            .then((res) => {
            setAttendances(res.data);
            return axios.get(`${API_URL}/leaves`);
        })
            .then((res) => {
            setLeaves(res.data);
            return axios.get(`${API_URL}/adminUsers/${adminUser?._id}`);
        })
            .then((res) => {
            console.log("Retrieved admin user: ", res.data);
            setNotes(res.data.notes);
            return axios.get(`${API_URL}/announcements`);
        })
            .then((res) => {
            console.log("Retrieved old announcements: ", res.data);
            setOldAnnouncements(res.data);
        })
            .catch((error) => {
            console.error("An error occured while retrieving data:", error);
        });
        return () => clearInterval(interval);
    }, []);
    //useEffect for personal notes saving
    useEffect(() => {
        if (!notes?.trim())
            return;
        const timeout = setTimeout(() => {
            handleNotesSubmission();
        }, 1000);
        return () => clearTimeout(timeout);
    }, [notes]);
    //useEffect to fetch live announcements from manager
    useEffect(() => {
        const unsubscribe = window.electron.announcements.onNew((data) => {
            setLiveAnnouncement(data);
        });
        return () => unsubscribe();
    }, []);
    //Submit personal notes
    const handleNotesSubmission = () => {
        console.log("Notes to submit:", notes);
        axios
            .put(`${API_URL}/adminUsers/${adminUser?._id}`, {
            notes,
        })
            .then((res) => console.log("Notes successfully saved: ", res.data))
            .catch((error) => console.error("An error occured while saving notes: ", error));
    };
    //Send announcements from manager
    const handleAnnouncementSend = async () => {
        console.log("Announcement to be sent to Main: ", announcement);
        try {
            const sendAnnouncement = await window.electron.announcements.createAnnouncement({
                message: announcement,
                createdBy: `${adminUser?.firstName} ${adminUser?.lastName}`,
            });
            console.log("Announcement post results from Main: ", sendAnnouncement);
        }
        catch (error) {
            console.error("An error occured while creating announcement: ", error);
        }
    };
    console.log("Live announcement value: ", liveAnnouncement?.message);
    return (_jsxs(Flex, { position: "relative", direction: "column", justify: "space-between", background: "#03143B", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "\n      0 8px 32px rgba(0,0,0,0.35),\n      inset 0 1px 1px rgba(255,255,255,0.08)\n    ", borderRadius: "24px", height: "94.3vh", width: "90vw", marginTop: "50px", marginLeft: "4px", children: [_jsxs(HStack, { children: [_jsxs(Box, { children: [_jsx(Text, { color: "#ffffff", fontSize: "27px", fontWeight: "700", marginLeft: "15px", marginTop: "10px", children: "Tableau de bord" }), _jsx(Text, { color: "#ffffff", fontSize: "15px", fontWeight: "500", position: "relative", bottom: "20px", marginLeft: "15px", children: "Vue d'ensemble de votre gestion de personnel" })] }), _jsxs(HStack, { position: "absolute", top: "5px", right: "5px", height: "50px", borderWidth: "0.3px", borderColor: "gray.100", borderRadius: "5px", divider: _jsx(StackDivider, { borderColor: "gray.200" }), children: [_jsxs(HStack, { width: "130px", children: [_jsx(Box, { marginLeft: "6px", children: _jsx(CiCalendarDate, { color: "#F2B705", size: "25px" }) }), _jsx(Box, { color: "#ffffff", children: new Date().toLocaleDateString("fr-FR") })] }), _jsxs(HStack, { width: "120px", children: [_jsx(Box, { children: _jsx(CiClock2, { color: "#F2B705", size: "25px" }) }), _jsxs(Box, { color: "#ffffff", marginLeft: "18px", children: [String(time?.getHours()).padStart(2, "0"), ":", String(time?.getMinutes()).padStart(2, "0")] })] })] })] }), _jsx(Box, { marginLeft: "5px", position: "relative", bottom: "40px", children: _jsx(EmployeeDashboard, { employeeCount: employees.length, attendanceCount: attendances.length, leaveCount: leaves.length, lateCount: lateCount.length }) }), _jsxs(HStack, { children: [_jsxs(Box, { position: "relative", left: "5px", bottom: "80px", width: "36vw", p: 6, borderRadius: "24px", bg: "#091735", backdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,0.08)", children: [_jsxs(HStack, { mb: 4, spacing: 3, children: [_jsx(Icon, { as: FaRegNoteSticky, color: "yellow.400", boxSize: 6 }), _jsx(Text, { color: "white", fontSize: "xl", fontWeight: "600", position: "relative", top: "8px", children: "Notes personnelles" })] }), _jsx(Textarea, { placeholder: "\u00C9crivez vos notes ici...", value: notes, onChange: (e) => setNotes(e.target.value), height: "280px", width: "32vw", resize: "none", bg: "#091735", border: "1px solid", borderColor: "whiteAlpha.100", color: "gray.200", fontWeight: "400", fontSize: "1.2rem", fontFamily: "monospace", _placeholder: {
                                    color: "gray.500",
                                }, _hover: {
                                    borderColor: "yellow.400",
                                }, _focus: {
                                    borderColor: "yellow.400",
                                    boxShadow: "0 0 0 1px #F4C20D",
                                    bg: "rgba(255,255,255,0.05)",
                                } })] }), adminUser?.role === "manager" ? (_jsxs(Box, { height: "403px", width: "38vw", position: "relative", left: "50px", bottom: "77px", borderWidth: "0.5px", borderRadius: "24px", bg: "#091735", backdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,0.08)", children: [_jsxs(HStack, { mb: 4, spacing: 3, position: "relative", left: "20px", top: "12px", children: [_jsx(Icon, { ml: "8px", as: TfiAnnouncement, color: "yellow.300", boxSize: 6 }), _jsx(Text, { position: "relative", left: "8px", top: "3px", mt: "12px", color: "white", fontSize: "xl", fontWeight: "600", children: "Envoyer une annonce" })] }), _jsx(Box, { position: "relative", left: "25px", bg: "#091735", height: "280px", width: "35vw", border: "1px solid rgba(255,255,255,0.08)", children: _jsx(Textarea, { placeholder: "Faites vos annonces ici...", value: announcement, onChange: (e) => setAnnouncement(e.target.value), height: "280px", width: "35vw", resize: "none", bg: "#091735", border: "1px solid", borderColor: "whiteAlpha.100", color: "gray.200", fontWeight: "400", fontSize: "1.2rem", fontFamily: "monospace", _placeholder: {
                                        color: "gray.500",
                                    }, _hover: {
                                        borderColor: "yellow.400",
                                    }, _focus: {
                                        borderColor: "yellow.400",
                                        boxShadow: "0 0 0 1px #F4C20D",
                                        bg: "rgba(255,255,255,0.05)",
                                    } }) }), _jsx(Button, { position: "absolute", right: "0.5px", bottom: "0.5px", borderRadius: "10px", borderColor: "black", bg: "#F2B705", borderWidth: "0.5px", colorScheme: " #320b01", color: "black", mr: 3, onClick: handleAnnouncementSend, children: _jsxs(HStack, { children: [_jsx(Box, { children: _jsx(FaSave, {}) }), _jsxs(Text, { position: "relative", top: "8px", fontSize: "1rem", children: [" ", "Envoyer"] })] }) })] })) : (_jsxs(Box, { height: "400px", width: "38vw", position: "relative", left: "50px", bottom: "77px", borderWidth: "0.5px", borderRadius: "24px", bg: "#091735", backdropFilter: "blur(18px)", border: "1px solid rgba(255,255,255,0.08)", children: [_jsxs(HStack, { mb: 4, spacing: 3, children: [_jsx(Icon, { ml: "8px", as: TfiAnnouncement, color: "yellow.300", boxSize: 8 }), _jsx(Text, { position: "relative", left: "25px", top: "8px", mt: "12px", color: "white", fontSize: "xl", fontWeight: "600", children: "Messages de la direction" })] }), _jsx(Box, { position: "relative", left: "25px", bg: "#091735", height: "280px", width: "35vw", border: "1px solid rgba(255,255,255,0.08)", children: _jsx(Text, { color: "gray.200", fontSize: "1.2rem", fontWeight: "500", children: liveAnnouncement?.message || oldAnnouncements[0]?.message }) })] }))] })] }));
};
export default EmployeeAdminPage;
