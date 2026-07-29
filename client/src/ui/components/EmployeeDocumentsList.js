import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge, Box, Flex, HStack, Icon, IconButton, List, ListItem, Spacer, Text, VStack, } from "@chakra-ui/react";
import { FiDownload, FiEye, FiFileText, FiTrash2 } from "react-icons/fi";
export default function EmployeeDocumentsList({ documents, onView, onDownload, onDelete, }) {
    if (documents.length === 0) {
        return (_jsx(Box, { position: "relative", top: "1rem", borderWidth: "1px", borderRadius: "lg", p: 10, textAlign: "center", color: "gray.500", children: "Aucun document disponible." }));
    }
    return (_jsx(List, { spacing: 3, children: documents.map((document) => (_jsx(ListItem, { borderWidth: "1px", borderRadius: "lg", p: 4, _hover: {
                bg: "whiteAlpha.50",
            }, children: _jsxs(Flex, { align: "center", children: [_jsxs(HStack, { spacing: 4, children: [_jsx(Icon, { as: FiFileText, boxSize: 8, color: "red.400" }), _jsxs(VStack, { align: "start", spacing: 1, children: [_jsx(Text, { fontWeight: "600", children: document.documentType === "EMPLOYMENT_CONTRACT"
                                            ? "Contrat de travail"
                                            : "Carte d'identite" }), _jsx(Text, { fontSize: "sm", color: "gray.400", children: document.originalName }), _jsxs(Text, { fontSize: "xs", color: "gray.500", children: [(document.fileSize / 1024 / 1024).toFixed(2), " MB"] })] })] }), _jsx(Spacer, {}), _jsx(Badge, { colorScheme: document.needsUpload ? "orange" : "green", children: document.needsUpload
                            ? "En attente de synchronization"
                            : "Synchronise" }), _jsxs(HStack, { ml: 6, children: [_jsx(IconButton, { "aria-label": "View", icon: _jsx(FiEye, {}), variant: "ghost", onClick: () => onView?.(document) }), _jsx(IconButton, { "aria-label": "Download", icon: _jsx(FiDownload, {}), variant: "ghost", onClick: () => onDownload?.(document) }), _jsx(IconButton, { "aria-label": "Delete", icon: _jsx(FiTrash2, {}), colorScheme: "red", variant: "ghost", onClick: () => onDelete?.(document) })] })] }) }, document._id))) }));
}
