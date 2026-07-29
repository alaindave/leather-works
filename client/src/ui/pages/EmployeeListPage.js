import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Flex, HStack, List, ListItem, Skeleton, SkeletonCircle, SkeletonText, Spacer, Text, VStack, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaAddressBook } from "react-icons/fa6";
import useAdminUser from "../../store/auth.store";
import AddEmployee from "../components/AddEmployee";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
import NotAuthorized from "../components/NotAuthorized";
import SearchBar from "../components/SearchBar";
import { FaSyncAlt } from "react-icons/fa";
const EmployeeListPage = () => {
    const [employees, setEmployees] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const adminUser = useAdminUser((store) => store.adminUser);
    //Initial data fetch
    useEffect(() => {
        window.electron.employees
            .getAll()
            .then((employees) => {
            setEmployees(employees);
            console.log("Employees fetched: ", employees);
        })
            .catch((error) => console.error("An error occured while fetching employees from sqlite DB", error))
            .finally(() => {
            setLoading(false);
        });
    }, []);
    //Employee sync and refresh
    const handleEmployeeSync = async () => {
        try {
            setLoading(true);
            const result = await window.electron.sync();
            if (result.success) {
                console.log("Sync completed");
                const employees = await window.electron.employees.getAll();
                setEmployees(employees);
                console.log("Fetched synced employees:", employees);
            }
            else {
                console.error(result.message);
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddEmployee = (employee) => {
        setEmployees([...employees, employee]);
    };
    const handleOnSearch = (searchText) => {
        setSearchText(searchText);
    };
    const handleFilterClicked = (filter) => {
        setFilter(filter);
    };
    return (_jsxs(Flex, { direction: "column", h: "94vh", width: "100vw", bg: "#F8FAFC", children: [_jsxs(Flex, { direction: "column", w: "79vw", bg: "#F8F9FB", height: "10rem", mt: "0.5rem", ml: "0.05rem", children: [_jsxs(Flex, { children: [_jsxs(Box, { children: [_jsxs(HStack, { children: [_jsx(Text, { color: "gray.800", fontSize: "clamp(1.3rem, 1vw + 0.8rem, 1.4rem)", fontWeight: "700", mt: "0.4rem", ml: "0.4rem", children: "Employ\u00E9s" }), _jsx(Button, { bg: "transparent", isLoading: loading, color: "gray.700", _hover: { bg: "transparent" }, fontSize: "clamp(1rem, 1vw + 0.8rem, 1.1rem)", position: "relative", bottom: "0.2rem", right: "1rem", onClick: handleEmployeeSync, children: _jsx(FaSyncAlt, {}) })] }), _jsx(Text, { fontWeight: "500", left: "0.45rem", fontSize: "clamp(1rem, 1vw + 0.8rem, 1.1rem)", color: "gray.500", position: "relative", bottom: "1.4rem", children: "G\u00E9rez les informations de vos employ\u00E9s" })] }), _jsx(Spacer, {}), adminUser?.role === "manager" ? (_jsx(Box, { mt: "0.75rem", mr: "2.3rem", children: _jsx(AddEmployee, { onAddEmployee: handleAddEmployee }) })) : (_jsx(Box, { mt: "0.1rem", mr: "1rem", children: _jsx(NotAuthorized, { buttonText: "Ajouter un employ\u00E9", icon: FaAddressBook, placement: "left", width: "13rem", color: "#4F46E5" }) }))] }), _jsxs(Flex, { direction: { base: "column", md: "row" }, justify: "space-between", gap: 3, children: [_jsx(Flex, { wrap: "wrap", gap: 2, ml: "1rem", children: _jsx(EmployeeFilterMenu, { onFilterClicked: handleFilterClicked }) }), _jsx(Flex, { position: "relative", left: "1.1rem", wrap: "wrap", mr: "3.5rem", children: _jsx(SearchBar, { onSearch: handleOnSearch }) })] })] }), _jsx(Flex, { flex: "1", overflow: "hidden", bg: "transparent", mt: "0.1rem", ml: "0.05rem", children: _jsx(Box, { w: "100%", h: "100%", overflowY: "auto", borderRadius: "inherit", children: loading ? (_jsx(VStack, { spacing: 0, children: [...Array(6)].map((_, index) => (_jsxs(Flex, { w: "100%", bg: "#ffffff", borderBottom: "1px solid #1E355A", p: 4, align: "center", gap: 4, mb: 1, children: [_jsx(SkeletonCircle, { size: "12" }), _jsxs(Box, { flex: "1", children: [_jsx(Skeleton, { height: "16px", width: "60%", mb: 3, borderRadius: "6px", startColor: "#132C68", endColor: "#1E3A7A" }), _jsx(SkeletonText, { noOfLines: 2, spacing: "3", skeletonHeight: "10px", startColor: "#132C68", endColor: "#1E3A7A" })] })] }, index))) })) : (_jsx(List, { position: "relative", bottom: "0.5rem", right: "2.2rem", children: employees
                            .filter((employee) => !filter || employee.department === filter)
                            .filter((employee) => `${employee.firstName} ${employee.lastName}`
                            .toLowerCase()
                            .includes(searchText.toLowerCase()))
                            .map((employee) => (_jsx(ListItem, { border: "1px solid #E2E8F0", borderRadius: "0.5rem", boxShadow: "0 2px 10px rgba(15,23,42,.06)", margin: "0.1rem", width: "75vw", bg: "#ffffff", ml: "1.5rem", overflowX: "hidden", children: _jsx(EmployeeCard, { employee: employee }) }, employee._id))) })) }) })] }));
};
export default EmployeeListPage;
