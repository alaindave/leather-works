import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Flex, Grid, HStack, Text, Textarea, useDisclosure, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
import useAdminUser from "../../store/auth.store";
import EmployeeDashboard from "../components/EmployeeDashboard";
import TaskSubmissionModal from "../components/TaskSubmissionModal";
import TaskCard from "../components/TaskCard";
import QuickActions from "../components/QuickActions";
import TaskDetailsDrawer from "../components/TaskDetailsDrawer";
import useTaskStore from "../../store/task.store";
import { FaSyncAlt } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
const EmployeeAdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [adminUsersList, setAdminUsersList] = useState([]);
    const [time, setTime] = useState(new Date());
    const user = useAdminUser((store) => store.adminUser);
    const saveNotes = useAdminUser((store) => store.saveNotes);
    // const loadTasks = useTaskStore((store) => store.loadTasks);
    const loadTopTasks = useTaskStore((store) => store.loadTopTasks);
    const deleteTask = useTaskStore((store) => store.deleteTask);
    const tasks = useTaskStore((store) => store.tasks);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState(user.notes);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose, } = useDisclosure();
    const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose, } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState(null);
    const lateCount = attendances.filter((attendance) => attendance.status === "RETARD");
    const dailyAttendance = attendances.filter((attendance) => attendance.status === "PONCTUEL" || attendance.status === "RETARD");
    //useEffect for initial data fetch and live clock
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 10000);
        window.electron.employees
            .getAll()
            .then((employees) => {
            setEmployees(employees);
            return window.electron.attendance.getByDate(new Date().toISOString().split("T")[0]);
        })
            .then((attendance) => {
            setAttendances(attendance);
            return window.electron.leave.getOngoingLeaves();
        })
            .then((leaves) => {
            setLeaves(leaves);
            return window.electron.adminUsers.getAll();
        })
            .then((adminUsers) => {
            console.log("Retrieved admin users: ", adminUsers);
            setAdminUsersList(adminUsers);
            return loadTopTasks(user._id);
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
        if (notes === user.notes)
            return;
        const timeout = setTimeout(() => {
            handleNotesSubmission();
        }, 1000);
        return () => clearTimeout(timeout);
    }, [notes]);
    const handleDataSync = async () => {
        try {
            setLoading(true);
            const result = await window.electron.sync();
            if (result.success) {
                console.log("Sync completed");
                const employees = await window.electron.employees.getAll();
                setEmployees(employees);
                console.log("Fetched synced employees:", employees);
                const attendances = await window.electron.attendance.getByDate(new Date().toISOString().split("T")[0]);
                setAttendances(attendances);
                console.log("Fetched synced attendances:", attendances);
                const leaves = await window.electron.leave.getOngoingLeaves();
                setLeaves(leaves);
                console.log("Fetched synced leaves:", leaves);
                const admin_users = await window.electron.adminUsers.getAll();
                setAdminUsersList(admin_users);
                console.log("Fetched admin users", admin_users);
                const top_tasks = await loadTopTasks(user._id);
                console.log("Fetched top tasks:", top_tasks);
            }
            else {
                console.error(result.message);
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleTaskCreate = () => {
        console.log("Task create clicked");
        onCreateOpen();
    };
    const handleTaskClick = (task) => {
        setSelectedTask(task);
        onDetailsOpen();
    };
    const handleTaskDelete = async (_id) => {
        console.log("ID to delete,", _id);
        try {
            const deletedTask = await deleteTask(_id);
            console.log("Deleted task: ", deletedTask);
        }
        catch (e) {
            console.error("An error occured while deleting the task.", e);
        }
    };
    //refresh tasks
    const handleTaskRefresh = async () => {
        try {
            await loadTopTasks(user._id);
        }
        catch (error) {
            console.log("An error occured while refreshing tasks:", error);
        }
    };
    //Submit personal notes
    const handleNotesSubmission = () => {
        window.electron.offlineUsers
            .saveNotes(user._id, notes)
            .then((res) => {
            console.log("Notes successfully saved: ", res);
            setNotes(notes);
            saveNotes(notes);
        })
            .catch((error) => console.error("An error occured while saving notes: ", error));
    };
    return (_jsxs(Flex, { direction: "column", ml: "0.01rem", w: "100%", minH: "94vh", bg: "#ffffff", border: "1px solid", borderColor: "#D1D9E0", overflow: "hidden", p: { base: 3, md: 6 }, children: [_jsxs(Flex, { justify: "space-between", align: { base: "flex-start", md: "center" }, flexDir: { base: "column", md: "row" }, gap: 3, children: [_jsxs(Box, { position: "relative", bottom: "0.7rem", children: [_jsxs(HStack, { children: [_jsx(Text, { fontSize: "clamp(1.3rem, 1vw + 0.8rem, 1.4rem)", fontWeight: "700", color: "#1F2937", children: "Tableau de bord" }), _jsx(Button, { bg: "transparent", isLoading: loading, color: "gray.800", _hover: { bg: "transparent" }, fontSize: "1rem", position: "relative", bottom: "0.5rem", right: "1rem", onClick: handleDataSync, children: _jsx(FaSyncAlt, {}) })] }), _jsx(Text, { fontSize: "clamp(1rem, 1vw + 0.8rem, 1.1rem)", color: "gray.500", position: "relative", bottom: "1.4rem", children: "Vue d'ensemble de votre gestion de personnel" })] }), _jsxs(Flex, { bg: "#F8F9FB", border: "1px solid", borderColor: "#D1D9E0", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", overflow: "hidden", align: "center", flexWrap: "wrap", position: "relative", bottom: "1.8rem", children: [_jsxs(Flex, { px: 3, py: 2, align: "center", gap: 2, children: [_jsx(CiCalendarDate, { color: "#0078D4", size: 22 }), _jsx(Text, { color: "gray.900", fontSize: "md", position: "relative", top: "0.5rem", children: new Date().toLocaleDateString("fr-FR") })] }), _jsxs(Flex, { px: 3, py: 2, align: "center", gap: 2, children: [_jsx(CiClock2, { color: "#0078D4", size: 22 }), _jsxs(Text, { color: "gray.900", fontSize: "md", position: "relative", top: "0.5rem", children: [String(time.getHours()).padStart(2, "0"), ":", String(time.getMinutes()).padStart(2, "0")] })] })] })] }), _jsx(Box, { children: _jsx(EmployeeDashboard, { employeeCount: employees.length, attendanceCount: dailyAttendance.length, leaveCount: leaves.length, lateCount: lateCount.length }) }), _jsxs(Grid, { templateColumns: { base: "1fr", xl: "1.2fr 1fr" }, gap: 6, flex: "1", minH: 0, overflow: "hidden", mt: 4, children: [_jsxs(Box, { border: "1px solid", borderColor: "#D1D9E0", borderRadius: "12px", bg: "#FFFFFF", p: 5, display: "flex", flexDir: "column", flex: 1, minH: "18rem", maxH: "23rem", mt: 4, overflowY: "auto", position: "relative", children: [_jsx(Flex, { align: "center", gap: 2, mb: 3, children: _jsx(Text, { color: "#1F2937", fontSize: "clamp(1.3rem, 1vw + 0.8rem, 1.3rem)", fontWeight: "600", position: "relative", top: "0.4rem", children: "Notes" }) }), _jsx(Textarea, { placeholder: "Bienvenue sur LeatherWorks.\nÉcrivez vos notes ici...", value: notes, onChange: (e) => setNotes(e.target.value), bg: "#091735", border: "1px solid rgba(255,255,255,0.1)", _hover: { borderColor: "yellow.300" }, _focus: {
                                    borderColor: "yellow.400",
                                    boxShadow: "0 0 0 1px #F4C20D",
                                }, flex: "1", resize: "none", color: "#ffffff", fontSize: "clamp(1.3rem, 1vw + 0.8rem, 1.3rem)", fontWeight: "700", fontFamily: "system-ui", _placeholder: {
                                    color: "#6B7280",
                                } }), _jsxs(Button, { position: "absolute", right: "1.3rem", colorScheme: "blue", width: "6rem", height: "3rem", children: [_jsx(Box, { mr: "0.4rem", children: _jsx(FaBell, {}) }), "Rappel"] })] }), _jsxs(Box, { display: "flex", flexDir: "column", overflowY: "auto", minH: 0, children: [_jsx(TaskSubmissionModal, { isOpen: isCreateOpen, onClose: onCreateClose, onRefresh: handleTaskRefresh, adminUsersList: adminUsersList, author: user }), _jsx(TaskDetailsDrawer, { task: selectedTask, isOpen: isDetailsOpen, onClose: onDetailsClose, onRefresh: handleTaskRefresh }), tasks.map((task) => (_jsx(Box, { mt: 6, ml: { base: 0, xl: 8 }, children: _jsx(TaskCard, { task: task, onTaskClick: handleTaskClick, onTaskDelete: handleTaskDelete }) }, task._id)))] })] }), _jsx(Box, { mb: 7, children: _jsx(QuickActions, { onTaskCreate: handleTaskCreate }) })] }));
};
export default EmployeeAdminPage;
