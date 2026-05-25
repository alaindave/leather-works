import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, } from "@chakra-ui/react";
import { FaBuilding, FaCalendarAlt, FaHashtag } from "react-icons/fa";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import { GiRotaryPhone } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";
import { MdAttachMoney, MdWork } from "react-icons/md";
import { GiRelationshipBounds } from "react-icons/gi";
import "../styles/App.css";
import EmployeeDetailsCard from "./EmployeeDetailsCard";
const EmployeeDetailsTab = ({ employee }) => {
    return (_jsx(Box, { marginTop: "10px", children: _jsxs(Tabs, { variant: "enclosed", children: [_jsxs(TabList, { borderBottomColor: "rgba(255,255,255,0.08)", children: [_jsx(Tab, { color: "gray.200", fontSize: "20px", fontWeight: "600", _selected: {
                                color: "#F2B705",
                                borderColor: "#F2B705",
                                bg: "rgba(242,183,5,0.08)",
                            }, _hover: {
                                color: "#F2B705",
                            }, children: "Info personnelles" }), _jsx(Tab, { color: "gray.200", fontSize: "20px", fontWeight: "600", _selected: {
                                color: "#F2B705",
                                borderColor: "#F2B705",
                                bg: "rgba(242,183,5,0.08)",
                            }, _hover: {
                                color: "#F2B705",
                            }, children: "Info professionnelles" }), _jsx(Tab, { color: "gray.200", fontSize: "20px", fontWeight: "600", _selected: {
                                color: "#F2B705",
                                borderColor: "#F2B705",
                                bg: "rgba(242,183,5,0.08)",
                            }, _hover: {
                                color: "#F2B705",
                            }, children: "Contact" })] }), _jsxs(TabPanels, { children: [_jsxs(TabPanel, { children: [_jsx(EmployeeDetailsCard, { property: "Nom", value: employee?.lastName ?? "N.D.", icon: IoPerson }), _jsx(EmployeeDetailsCard, { property: "Prenom", value: employee?.firstName ?? "N.D.", icon: IoPerson }), _jsx(EmployeeDetailsCard, { property: "Matricule", value: employee?.employeeID ?? "N.D.", icon: FaHashtag }), _jsx(EmployeeDetailsCard, { property: "Date de naissance", value: employee?.dateBirth
                                        ? new Date(employee.dateBirth).toLocaleDateString("fr-FR")
                                        : "N.D.", icon: FaCalendarAlt })] }), _jsxs(TabPanel, { children: [_jsx(EmployeeDetailsCard, { property: "Poste", value: employee?.role || "N.D.", icon: MdWork }), _jsx(EmployeeDetailsCard, { property: "Departement", value: employee?.department || "N.D.", icon: FaBuilding }), _jsx(EmployeeDetailsCard, { property: "Salaire", value: employee?.salary || "N.D.", icon: MdAttachMoney }), _jsx(EmployeeDetailsCard, { property: "Date d'embauche", value: employee?.dateHired
                                        ? new Date(employee.dateHired).toLocaleDateString("fr-FR")
                                        : "N.D.", icon: FaCalendarAlt })] }), _jsxs(TabPanel, { children: [_jsx(EmployeeDetailsCard, { property: "Addresse", value: employee?.address, icon: FaHouseChimneyWindow }), _jsx(EmployeeDetailsCard, { property: "Telephone", value: employee?.telephone, icon: GiRotaryPhone }), _jsx(EmployeeDetailsCard, { property: "Nom du contact d'urgence", value: employee?.emergencyContact, icon: IoPerson }), _jsx(EmployeeDetailsCard, { property: "Relation avec l'employ\u00E9", value: employee?.relationship, icon: GiRelationshipBounds }), _jsx(EmployeeDetailsCard, { property: "Telephone du contact d'urgence", value: employee?.contactPhone, icon: GiRotaryPhone })] })] })] }) }));
};
export default EmployeeDetailsTab;
