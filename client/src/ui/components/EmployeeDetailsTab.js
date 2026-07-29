import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs, useToast, useDisclosure, } from "@chakra-ui/react";
import { FaBuilding, FaCalendarAlt, FaHashtag } from "react-icons/fa";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import { GiRelationshipBounds, GiRotaryPhone } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { MdAttachMoney, MdWork } from "react-icons/md";
import { LuPaperclip } from "react-icons/lu";
import useAdminUser from "../../store/auth.store";
import EmployeeDetailsCard from "./EmployeeDetailsCard";
import { useEffect, useState, useRef } from "react";
import EmployeeDocumentsList from "./EmployeeDocumentsList";
import UploadDocumentModal from "./UploadDocumentModal";
const EmployeeDetailsTab = ({ employee }) => {
    const [documents, setDocuments] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeletionOpen, onOpen: onDeletionOpen, onClose: onDeletionClose, } = useDisclosure();
    const cancelRef = useRef(null);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const toast = useToast();
    useEffect(() => {
        if (!employee)
            return;
        console.log("EMPLOYEE ID TESTING", employee._id);
        window.electron.employees_documents
            .getByEmployee(employee._id)
            .then((documents) => {
            setDocuments(documents);
            console.log("DOCUMENTS FETCHED: ", documents);
        })
            .catch((error) => {
            console.error("ERROR FETCHING DOCUMENT:", error);
        });
    }, [employee]);
    const user = useAdminUser((store) => store.adminUser);
    const handleRefresh = () => {
        if (!employee)
            return;
        window.electron.employees_documents
            .getByEmployee(employee._id)
            .then((documents) => {
            setDocuments(documents);
            console.log("DOCUMENTS FETCHED: ", documents);
        })
            .catch((error) => {
            console.error("ERROR FETCHING DOCUMENT:", error);
        });
    };
    const handleView = async (document) => {
        await window.electron.employees_documents.view(document.localPath);
    };
    const handleDownload = async (document) => {
        await window.electron.employees_documents.download(document);
        toast({
            title: "Telechargement",
            status: "success",
        });
    };
    const handleDelete = (document) => {
        setDocumentToDelete(document);
        onDeletionOpen();
    };
    const confirmDelete = async () => {
        if (!documentToDelete)
            return;
        try {
            await window.electron.employees_documents.delete(documentToDelete._id);
            setDocuments((prev) => prev.filter((d) => d._id !== documentToDelete._id));
            toast({
                title: "Document supprimé",
                status: "success",
            });
            onDeletionClose();
        }
        catch (error) {
            toast({
                title: "Suppression echouée",
                status: "error",
            });
        }
        finally {
            setDocumentToDelete(null);
            onClose();
        }
    };
    if (!employee)
        return null;
    return (_jsxs(Box, { maxH: "90vh", w: "47vw", children: [_jsxs(Tabs, { variant: "enclosed", h: "100%", display: "flex", flexDirection: "column", children: [_jsxs(TabList, { borderBottomColor: "rgba(255,255,255,0.08)", overflowX: "hidden", overflowY: "hidden", whiteSpace: "nowrap", flexShrink: 0, sx: {
                            "&::-webkit-scrollbar": {
                                height: "4px",
                            },
                        }, children: [_jsx(Tab, { flexShrink: 0, color: "gray.600", fontSize: { base: "sm", md: "md", lg: "lg" }, fontWeight: "600", px: { base: 3, md: 5 }, _selected: {
                                    color: "purple.600",
                                    borderColor: "#F2B705",
                                    bg: "transparent",
                                }, _hover: {
                                    color: "purple.600",
                                }, children: "Info personnelles" }), _jsx(Tab, { flexShrink: 0, color: "gray.600", fontSize: { base: "sm", md: "md", lg: "lg" }, fontWeight: "600", px: { base: 3, md: 5 }, _selected: {
                                    color: "purple.600",
                                    borderColor: "#F2B705",
                                    bg: "transparent",
                                }, _hover: {
                                    color: "purple.600",
                                }, children: "Info professionnelles" }), _jsx(Tab, { flexShrink: 0, color: "gray.600", fontSize: { base: "sm", md: "md", lg: "lg" }, fontWeight: "600", px: { base: 3, md: 5 }, _selected: {
                                    color: "purple.600",
                                    borderColor: "#F2B705",
                                    bg: "transparent",
                                }, _hover: {
                                    color: "purple.600",
                                }, children: "Contact" }), _jsx(Tab, { flexShrink: 0, color: "gray.600", fontSize: { base: "sm", md: "md", lg: "lg" }, fontWeight: "600", px: { base: 3, md: 5 }, _selected: {
                                    color: "purple.600",
                                    borderColor: "#F2B705",
                                    bg: "transparent",
                                }, _hover: {
                                    color: "purple.600",
                                }, children: "Documents" })] }), _jsxs(TabPanels, { flex: "1", overflowY: "auto", px: { base: 2, md: 4 }, py: 4, children: [_jsxs(TabPanel, { p: 0, children: [_jsx(EmployeeDetailsCard, { property: "Nom", value: employee?.lastName || "N.D.", icon: IoPerson }), _jsx(EmployeeDetailsCard, { property: "Pr\u00E9nom", value: employee?.firstName || "N.D.", icon: IoPerson }), _jsx(EmployeeDetailsCard, { property: "Matricule", value: employee?.matricule || "N.D.", icon: FaHashtag }), _jsx(EmployeeDetailsCard, { property: "No carte d'identit\u00E9", value: employee?.idNum || "N.D.", icon: FaHashtag }), _jsx(EmployeeDetailsCard, { property: "Date de naissance", value: employee?.dateBirth
                                            ? new Date(employee.dateBirth).toLocaleDateString("fr-FR")
                                            : "N.D.", icon: FaCalendarAlt })] }), _jsxs(TabPanel, { p: 0, children: [_jsx(EmployeeDetailsCard, { property: "Poste", value: employee?.role || "N.D.", icon: MdWork }), _jsx(EmployeeDetailsCard, { property: "D\u00E9partement", value: employee?.department || "N.D.", icon: FaBuilding }), _jsx(EmployeeDetailsCard, { property: "Salaire", value: employee?.salary?.toLocaleString("fr-BI") || "N.D.", icon: MdAttachMoney }), _jsx(EmployeeDetailsCard, { property: "Date d'embauche", value: employee?.dateHired
                                            ? new Date(employee.dateHired).toLocaleDateString("fr-FR")
                                            : "N.D.", icon: FaCalendarAlt }), _jsx(EmployeeDetailsCard, { property: "Cong\u00E9s restants", value: employee?.remainingLeave || "N.D.", icon: FaCalendarAlt })] }), _jsxs(TabPanel, { p: 0, children: [_jsx(EmployeeDetailsCard, { property: "Adresse", value: employee?.address || "N.D.", icon: FaHouseChimneyWindow }), _jsx(EmployeeDetailsCard, { property: "T\u00E9l\u00E9phone", value: employee?.telephone || "N.D.", icon: GiRotaryPhone }), _jsx(EmployeeDetailsCard, { property: "Nom du contact d'urgence", value: employee?.emergencyContact || "N.D.", icon: IoPerson }), _jsx(EmployeeDetailsCard, { property: "Relation avec l'employ\u00E9", value: employee?.relationship || "N.D.", icon: GiRelationshipBounds }), _jsx(EmployeeDetailsCard, { property: "T\u00E9l\u00E9phone du contact d'urgence", value: employee?.contactPhone || "N.D.", icon: GiRotaryPhone })] }), _jsxs(TabPanel, { p: 0, children: [_jsx(UploadDocumentModal, { isOpen: isOpen, onClose: onClose, employeeId: employee._id, uploadedBy: user._id, documentType: "EMPLOYMENT_CONTRACT", onRefresh: handleRefresh }), _jsx(EmployeeDocumentsList, { documents: documents, onView: handleView, onDownload: handleDownload, onDelete: handleDelete }), _jsx(Button, { position: "absolute", top: "3rem", right: "0.01rem", onClick: onOpen, bg: "transparent", fontSize: "1.4rem", _hover: { bg: "transparent" }, children: _jsx(LuPaperclip, {}) })] })] })] }), _jsx(AlertDialog, { isOpen: isDeletionOpen, leastDestructiveRef: cancelRef, onClose: () => {
                    setDocumentToDelete(null);
                    onDeletionClose();
                }, children: _jsx(AlertDialogOverlay, { backdropFilter: "auto", backdropBlur: "0.5rem", children: _jsxs(AlertDialogContent, { bg: "#08162b", color: "white", mx: 4, position: "relative", top: "8rem", children: [_jsx(AlertDialogHeader, { children: "Supprimer le document" }), _jsx(AlertDialogBody, { children: documentToDelete ? (_jsxs(_Fragment, { children: ["\u00CAtes vous sur de vouloir supprimer", " ", _jsx("strong", { style: { color: "#F2B705" }, children: documentToDelete.originalName }), "?", _jsx("br", {})] })) : ("Êtes vous sur de vouloir supprimer ce document") }), _jsxs(AlertDialogFooter, { children: [_jsx(Button, { ref: cancelRef, onClick: onDeletionClose, children: "Annuler" }), _jsx(Button, { colorScheme: "red", ml: 3, onClick: confirmDelete, children: "Supprimer" })] })] }) }) })] }));
};
export default EmployeeDetailsTab;
