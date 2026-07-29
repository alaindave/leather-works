import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverHeader, Textarea, Button, useDisclosure, } from "@chakra-ui/react";
const TaskResolutionPopover = ({ onSubmit }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [notes, setNotes] = useState("");
    const textareaRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            console.log("Notes to save:", notes);
            const success = await onSubmit(notes);
            if (success) {
                setIsSubmitting(false);
                setNotes("");
                onClose();
            }
        }
        catch (error) {
            console.error("Failed to save notes:", error);
        }
    };
    return (_jsxs(Popover, { isOpen: isOpen, onOpen: onOpen, onClose: onClose, placement: "left", closeOnBlur: false, initialFocusRef: textareaRef, children: [_jsx(PopoverTrigger, { children: _jsx(Button, { colorScheme: "green", children: "Resoudre" }) }), _jsxs(PopoverContent, { position: "relative", top: "4rem", bg: "#0E1E47", borderColor: "#22345F", color: "white", children: [_jsx(PopoverArrow, {}), _jsx(PopoverHeader, { children: "Notes de resolution" }), _jsxs(PopoverBody, { children: [_jsx(Textarea, { ref: textareaRef, value: notes ?? "", onChange: (e) => setNotes(e.target.value), placeholder: "Notes de resolution...", bg: "#08162b", color: "white", resize: "none", minH: "100px" }), _jsx(Button, { mt: 3, size: "sm", colorScheme: "yellow", onClick: handleSave, isLoading: isSubmitting, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: isSubmitting, children: "Sauvegarder" })] })] })] }));
};
export default TaskResolutionPopover;
