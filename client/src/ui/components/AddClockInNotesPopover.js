import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Badge, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverHeader, Textarea, Button, useDisclosure, Portal, } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
const AddClockInNotesPopover = ({ onSubmit, existingNotes }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const textareaRef = useRef(null);
    const [lateNote, setLateNote] = useState(existingNotes);
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        setLateNote(existingNotes);
    }, [existingNotes]);
    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            console.log("Notes to save:", lateNote);
            const success = await onSubmit(lateNote);
            if (success) {
                setIsSubmitting(false);
                setLateNote("");
                onClose();
            }
        }
        catch (error) {
            console.error("Failed to save late notes:", error);
        }
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
    return (_jsxs(Popover, { isOpen: isOpen, onOpen: onOpen, onClose: onClose, placement: "right", closeOnBlur: false, initialFocusRef: textareaRef, children: [_jsx(PopoverTrigger, { children: _jsx(Badge, { animation: `${flashLate} 1.5s ease-in-out 2`, bg: "#DD6B20", color: "gray.200", fontSize: "14px", cursor: "pointer", children: "En retard" }) }), _jsx(Portal, { children: _jsxs(PopoverContent, { bg: "#0E1E47", borderColor: "#22345F", color: "white", w: "320px", children: [_jsx(PopoverArrow, {}), _jsx(PopoverHeader, { children: "Ajouter une note" }), _jsxs(PopoverBody, { children: [_jsx(Textarea, { ref: textareaRef, value: lateNote ?? "", onChange: (e) => setLateNote(e.target.value), placeholder: "Raison du retard...", bg: "#08162b", color: "white", resize: "none", minH: "100px" }), _jsx(Button, { mt: 3, size: "sm", colorScheme: "yellow", onClick: handleSave, isLoading: isSubmitting, loadingText: "Patientez...", spinnerPlacement: "start", isDisabled: isSubmitting, children: "Sauvegarder" })] })] }) })] }));
};
export default AddClockInNotesPopover;
