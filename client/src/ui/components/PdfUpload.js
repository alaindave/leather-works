import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Flex, Icon, Input, Text, VStack, SimpleGrid, } from "@chakra-ui/react";
import { FiFileText, FiUpload, FiCreditCard, FiCheckCircle, } from "react-icons/fi";
import { useRef, useState } from "react";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export default function PdfUpload({ employeeId, uploadedBy, onUploaded, }) {
    const inputRef = useRef(null);
    const [documentType, setDocumentType] = useState("EMPLOYMENT_CONTRACT");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const uploadDocument = async (selectedFile) => {
        try {
            setUploading(true);
            const arrayBuffer = await selectedFile.arrayBuffer();
            await window.electron.employees_documents.upload({
                employeeId,
                uploadedBy,
                documentType,
                name: selectedFile.name,
                mimeType: selectedFile.type,
                buffer: new Uint8Array(arrayBuffer),
            });
            setFile(selectedFile);
            onUploaded?.(true);
        }
        catch (error) {
            console.error("DOCUMENT UPLOAD FAILED:", error);
        }
        finally {
            setUploading(false);
        }
    };
    const handleFile = async (selected) => {
        if (!selected)
            return;
        if (documentType === "EMPLOYMENT_CONTRACT") {
            if (selected.type !== "application/pdf") {
                alert("Veuillez sélectionner un document PDF.");
                return;
            }
        }
        else {
            const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
            if (!allowedTypes.includes(selected.type)) {
                alert("Veuillez sélectionner un fichier PDF ou une image JPG/JPEG.");
                return;
            }
        }
        if (selected.size > MAX_FILE_SIZE) {
            alert("Taille maximale : 10 MB.");
            return;
        }
        await uploadDocument(selected);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(SimpleGrid, { columns: 2, gap: 4, mb: 6, children: [_jsx(Box, { p: 5, borderWidth: "2px", borderRadius: "xl", cursor: "pointer", transition: "all .2s", borderColor: documentType === "EMPLOYMENT_CONTRACT" ? "yellow.400" : "gray.600", bg: documentType === "EMPLOYMENT_CONTRACT" ? "yellow.400" : "gray.800", color: documentType === "EMPLOYMENT_CONTRACT" ? "black" : "white", onClick: () => setDocumentType("EMPLOYMENT_CONTRACT"), _hover: {
                            borderColor: "yellow.300",
                            transform: "translateY(-2px)",
                        }, children: _jsxs(VStack, { gap: 2, children: [_jsx(Icon, { as: FiFileText, boxSize: 8 }), _jsx(Text, { fontWeight: "bold", children: "Contrat de travail" }), documentType === "EMPLOYMENT_CONTRACT" && (_jsxs(Flex, { align: "center", gap: 1, mt: 2, children: [_jsx(Icon, { as: FiCheckCircle }), _jsx(Text, { fontSize: "sm", fontWeight: "bold", children: "S\u00E9lectionn\u00E9" })] }))] }) }), _jsx(Box, { p: 5, borderWidth: "2px", borderRadius: "xl", cursor: "pointer", transition: "all .2s", borderColor: documentType === "NATIONAL_ID" ? "yellow.400" : "gray.600", bg: documentType === "NATIONAL_ID" ? "yellow.400" : "gray.800", color: documentType === "NATIONAL_ID" ? "black" : "white", onClick: () => setDocumentType("NATIONAL_ID"), _hover: {
                            borderColor: "yellow.300",
                            transform: "translateY(-2px)",
                        }, children: _jsxs(VStack, { gap: 2, children: [_jsx(Icon, { as: FiCreditCard, boxSize: 8 }), _jsx(Text, { fontWeight: "bold", children: "Carte d'identit\u00E9" }), documentType === "NATIONAL_ID" && (_jsxs(Flex, { align: "center", gap: 1, mt: 2, children: [_jsx(Icon, { as: FiCheckCircle }), _jsx(Text, { fontSize: "sm", fontWeight: "bold", children: "S\u00E9lectionn\u00E9" })] }))] }) })] }), _jsx(Input, { ref: inputRef, type: "file", accept: documentType === "EMPLOYMENT_CONTRACT"
                    ? "application/pdf"
                    : "application/pdf,image/jpeg,image/jpg,image/png", display: "none", onChange: (e) => handleFile(e.target.files?.[0] ?? null) }), !file ? (_jsx(Box, { border: "2px dashed", borderColor: "gray.500", borderRadius: "xl", p: 10, cursor: uploading ? "default" : "pointer", textAlign: "center", onClick: () => !uploading && inputRef.current?.click(), _hover: {
                    borderColor: "yellow.400",
                    bg: "whiteAlpha.50",
                }, children: _jsxs(VStack, { gap: 4, children: [_jsx(Icon, { as: FiUpload, boxSize: 12, color: "yellow.400" }), _jsx(Text, { fontWeight: "bold", fontSize: "lg", children: documentType === "EMPLOYMENT_CONTRACT"
                                ? "Ajouter un contrat de travail"
                                : "Ajouter une carte d'identité" }), _jsx(Text, { color: "gray.400", fontSize: "sm", children: documentType === "EMPLOYMENT_CONTRACT"
                                ? "Cliquez ici pour sélectionner un document PDF"
                                : "Cliquez ici pour sélectionner un document PDF ou JPG" }), _jsx(Text, { fontSize: "xs", color: "gray.500", children: "Taille maximale : 10 MB" })] }) })) : (_jsxs(Flex, { borderWidth: "1px", borderRadius: "xl", p: 5, bg: "gray.800", align: "center", gap: 4, children: [_jsx(Icon, { as: FiFileText, color: "yellow.400", boxSize: 8 }), _jsxs(Box, { flex: 1, children: [_jsx(Text, { fontWeight: "bold", color: "white", children: file.name }), _jsxs(Text, { fontSize: "sm", color: "gray.400", children: [(file.size / 1024 / 1024).toFixed(2), " MB"] })] }), _jsx(Text, { color: "green.400", fontWeight: "bold", children: "T\u00E9l\u00E9vers\u00E9 \u2713" })] }))] }));
}
