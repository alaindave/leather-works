import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Image, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import defaultAvatar from "../assets/default-avatar.jpeg";
export default function EmployeePhotoUpload({ employeeId, currentPhoto, onUploaded, }) {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    useEffect(() => {
        if (currentPhoto) {
            setPreview(null);
        }
    }, [currentPhoto]);
    async function upload(file) {
        const arrayBuffer = await file.arrayBuffer();
        await window.electron.employees.uploadPhoto(employeeId, {
            name: file.name,
            buffer: arrayBuffer,
        });
        onUploaded?.();
    }
    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file)
            return;
        setPreview(URL.createObjectURL(file));
        upload(file);
    }
    function handleSelect(e) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setPreview(URL.createObjectURL(file));
        upload(file);
    }
    return (_jsx(VStack, { spacing: 3, position: "relative", bottom: "4rem", children: _jsxs(Box, { w: "140px", h: "140px", borderRadius: "full", overflow: "hidden", border: "1px solid", borderColor: isDragging ? "blue.400" : "gray.300", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", onDragOver: (e) => {
                e.preventDefault();
                setIsDragging(true);
            }, onDragLeave: () => setIsDragging(false), onDrop: handleDrop, children: [_jsx("input", { type: "file", accept: "image/*", style: {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                    }, onChange: handleSelect }), _jsx(Image, { src: preview || currentPhoto || defaultAvatar, boxSize: "140px", objectFit: "cover" })] }) }));
}
