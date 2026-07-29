import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Badge, Box, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, HStack, Icon, Stack, Text, Textarea, VStack, } from "@chakra-ui/react";
import { FiCheckCircle, FiUser } from "react-icons/fi";
import useAdminUser from "../../store/auth.store";
import useTaskStore from "../../store/task.store";
import { useState } from "react";
import TaskResolutionPopover from "./TaskResolutionPopover";
import { CiCalendarDate, CiClock2 } from "react-icons/ci";
export default function TaskDetailsDrawer({ task, isOpen, onClose, onRefresh, }) {
    if (!task)
        return null;
    const author = useAdminUser((store) => store.adminUser);
    const addComment = useTaskStore((store) => store.addComment);
    const _task = useTaskStore((s) => s.tasks.find((t) => t._id === task._id));
    const [comment, setComment] = useState("");
    console.log("Fetched task from store:", _task);
    const handleTaskComment = async () => {
        if (!comment.trim())
            return;
        await addComment(task._id, author, comment);
        onRefresh?.();
        setComment("");
    };
    const handleResolution = async (notes) => {
        console.log("Resolution notes to submit:", notes);
        const resolvedBy = `${author.firstName} ${author.lastName}`;
        const updatedTask = {
            ...task,
            isResolved: 1,
            resolutionNotes: notes,
            resolvedAt: new Date().toISOString(),
            resolvedBy,
        };
        console.log("Task to update", updatedTask);
        try {
            const result = await window.electron.tasks.update(updatedTask);
            console.log("Task update result", result);
            onRefresh?.();
            return true;
        }
        catch (error) {
            console.error("An error occured during task update:", error);
            return false;
        }
    };
    return (_jsxs(Drawer, { isOpen: isOpen, onClose: onClose, placement: "left", size: "lg", children: [_jsx(DrawerOverlay, {}), _jsxs(DrawerContent, { children: [_jsx(DrawerHeader, { borderBottomWidth: "1px", borderColor: "gray.500", children: _jsxs(VStack, { align: "start", spacing: 1, position: "relative", children: [_jsxs(Flex, { justify: "space-between", children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Text, { fontWeight: "bold", fontFamily: "monospace", children: task.taskNumber }), _jsx(Badge, { colorScheme: task.isResolved ? "green" : "yellow", mb: "1rem", ml: "2rem", children: task.isResolved ? "Resolue" : "Ouverte" })] }), _jsxs(HStack, { position: "relative", bottom: "1rem", children: [_jsx(Avatar, { size: "sm", name: `${task.author.firstName} ${task.author.lastName}` }), _jsx(Box, { ml: "0.1rem", children: _jsxs(Text, { position: "relative", top: "0.4rem", fontSize: "1.1rem", children: [task.author.firstName, " ", task.author.lastName] }) })] })] }), !task.isResolved && (_jsx(Box, { position: "absolute", right: "0.2rem", children: _jsx(TaskResolutionPopover, { onSubmit: handleResolution }) }))] }), _jsxs(Flex, { bg: "gray.100", borderRadius: "0.4rem", height: "4.5rem", width: "42vw", justify: "space-between", mt: "0.2rem", children: [_jsxs(HStack, { ml: "3rem", position: "relative", top: "0.6rem", children: [_jsx(Box, { position: "relative", right: "0.3rem", bottom: "0.8rem", fontSize: "1.7rem", color: "blue.500", children: _jsx(CiCalendarDate, {}) }), _jsxs(Box, { children: [_jsx(Text, { mt: "0.3rem", fontSize: "0.93rem", color: "gray.600", children: "Ouverte le" }), _jsx(Text, { position: "relative", bottom: "0.98rem", fontSize: "0.98rem", color: "gray.600", children: new Date(task.submittedAt).toLocaleDateString("fr-FR") })] })] }), _jsxs(HStack, { position: "relative", top: "0.6rem", children: [_jsx(Box, { fontSize: "1.6rem", mr: "0.3rem", position: "relative", right: "0.3rem", bottom: "0.8rem", color: "blue.500", children: _jsx(CiClock2, {}) }), _jsxs(Box, { mr: "3rem", children: [_jsx(Text, { fontSize: "0.94rem", color: "gray.600", mt: "0.3rem", children: "Date limite" }), _jsx(Text, { position: "relative", bottom: "1.1rem", fontSize: "0.95rem", color: "gray.600", children: new Date(task.deadline).toLocaleDateString("fr-FR") })] })] })] }), _jsx(Flex, { width: "42vw", justify: "space-between", children: _jsxs(Box, { children: [_jsx(Text, { mt: "1rem", whiteSpace: "pre-wrap", fontSize: "1.18rem", color: "gray.900", children: task.subject }), _jsx(Text, { position: "relative", bottom: "0.3rem", fontSize: "1.1rem", fontWeight: "300", color: "black", fontFamily: "system-ui", children: task.message })] }) })] }) }), _jsx(DrawerBody, { children: _jsxs(VStack, { align: "stretch", spacing: 1, children: [_jsxs(Box, { children: [_jsx(Text, { fontWeight: "bold", mb: 3, fontSize: "1.2rem", children: "Destinataires" }), _jsx(Stack, { spacing: 3, children: task.recipients?.map((user) => (_jsxs(HStack, { children: [_jsx(Avatar, { size: "sm", name: `${user.firstName} ${user.lastName}` }), _jsx(Box, { ml: "0.1rem", children: _jsxs(Text, { position: "relative", top: "0.4rem", fontSize: "1.1rem", children: [user.firstName, " ", user.lastName] }) })] }, user._id))) })] }), task.isResolved && (_jsxs(Box, { children: [_jsx(Divider, { borderColor: "gray.500" }), _jsx(VStack, { align: "stretch", spacing: 3, children: _jsxs(_Fragment, { children: [_jsxs(HStack, { children: [_jsx(Icon, { as: FiCheckCircle, color: "green.500" }), _jsxs(Box, { children: [_jsxs(Text, { position: "relative", top: "1rem", children: ["Resolue le", " "] }), _jsx(Text, { children: new Date(task.resolvedAt)
                                                                            .toLocaleString("fr-FR")
                                                                            .replaceAll(" ", " à ") })] })] }), task.resolvedBy && (_jsxs(HStack, { children: [_jsx(Icon, { as: FiUser }), _jsxs(Text, { position: "relative", top: "0.4rem", children: ["par ", task.resolvedBy] })] })), task.resolutionNotes && (_jsxs(Box, { p: 3, bg: "gray.100", rounded: "md", children: [_jsx(Text, { fontWeight: "bold", mb: 1, children: "Notes de resolution" }), _jsx(Text, { fontFamily: "mono", children: task.resolutionNotes })] }))] }) })] })), _jsx(Divider, { borderColor: "gray.500" }), _jsxs(Box, { children: [_jsxs(Text, { fontWeight: "bold", mb: 4, children: ["Commentaires (", _task?.comments?.length ?? 0, ")"] }), _jsx(Stack, { spacing: 4, children: _task?.comments?.map((comment) => (_jsxs(Box, { borderWidth: "1px", rounded: "md", p: 3, children: [_jsxs(HStack, { mb: 2, children: [_jsx(Avatar, { size: "sm", name: `${comment.author.firstName} ${comment.author.lastName}` }), _jsxs(Box, { flex: 1, position: "relative", top: "1rem", left: "0.2rem", children: [_jsxs(Text, { fontWeight: "semibold", children: [comment.author.firstName, " ", comment.author.lastName] }), _jsx(Text, { position: "relative", bottom: "1.1rem", fontSize: "0.92rem", color: "gray.500", children: new Date(comment.createdAt).toLocaleString("fr-FR", {
                                                                            timeZone: "Africa/Bujumbura",
                                                                        }) })] })] }), _jsx(Text, { fontFamily: "mono", ml: "2.5rem", whiteSpace: "pre-wrap", position: "relative", bottom: "0.6rem", children: comment.comment })] }, comment._id))) })] })] }) }), _jsx(DrawerFooter, { borderTopWidth: "1px", children: _jsxs(HStack, { w: "100%", children: [_jsx(Textarea, { placeholder: "Ecrivez vos commentaires...", value: comment, onChange: (e) => setComment(e.target.value) }), _jsx(Button, { colorScheme: "blue", onClick: handleTaskComment, children: "Commenter" })] }) })] })] }));
}
