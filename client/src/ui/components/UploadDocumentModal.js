import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, } from "@chakra-ui/react";
import PdfUpload from "./PdfUpload";
import { useState } from "react";
export default function UploadDocumentModal({ isOpen, onClose, employeeId, uploadedBy, documentType, onRefresh, }) {
    const [uploaded, setUploaded] = useState(false);
    const handleClose = () => {
        if (!uploaded)
            onClose();
        onRefresh?.();
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, size: "2xl", isCentered: true, children: _jsx(ModalOverlay, { backdropFilter: "blur(0.5rem)", children: _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: "Type de documents" }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { pb: 6, children: _jsx(PdfUpload, { employeeId: employeeId, uploadedBy: uploadedBy, onUploaded: (uploaded) => setUploaded(uploaded) }) }), _jsx(ModalFooter, { children: _jsx(Button, { color: "#ffffff", bg: "red.500", onClick: handleClose, _hover: { bg: "red.500" }, children: "Fermer" }) })] }) }) }));
}
