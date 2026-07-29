import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, } from "@chakra-ui/react";
const DeletionDialog = ({ isOpen, onClose, onConfirmation, header, body, }) => {
    const cancelRef = useRef(null);
    return (_jsx(AlertDialog, { isOpen: isOpen, leastDestructiveRef: cancelRef, onClose: onClose, children: _jsx(AlertDialogOverlay, { backdropFilter: "auto", backdropBlur: "10px", children: _jsxs(AlertDialogContent, { bg: "#08162b", children: [_jsx(AlertDialogHeader, { fontSize: "lg", fontWeight: "bold", color: "#ffffff", children: header }), _jsx(AlertDialogBody, { color: "#ffffff", children: body }), _jsxs(AlertDialogFooter, { children: [_jsx(Button, { ref: cancelRef, onClick: onClose, children: "Non" }), _jsx(Button, { colorScheme: "red", onClick: onConfirmation, ml: 3, children: "Oui" })] })] }) }) }));
};
export default DeletionDialog;
