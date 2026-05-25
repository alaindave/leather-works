import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, List, ListItem, Skeleton, SkeletonCircle, SkeletonText, Text, VStack, } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AddEmployee from "../components/AddEmployee";
import EmployeeCard from "../components/EmployeeCard";
import SearchBar from "../components/SearchBar";
import EmployeeFilterMenu from "../components/EmployeeFilterMenu";
const EmployeeListPage = () => {
    const [employees, setEmployees] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    useEffect(() => {
        axios
            .get(`${API_URL}/employees`)
            .then((res) => {
            setEmployees(res.data);
            console.log("Employees received: ", res.data);
        })
            .catch((error) => {
            console.error("Error while fetching employees: ", error);
        })
            .finally(() => {
            setLoading(false);
        });
    }, []);
    const handleAddEmployee = (employee) => {
        setEmployees([...employees, employee]);
    };
    const handleOnSearch = (searchText) => {
        setSearchText(searchText);
    };
    const handleFilterClicked = (filter) => {
        setFilter(filter);
    };
    return (_jsxs(VStack, { spacing: 0, align: "stretch", marginTop: "48px", marginLeft: "4px", ml: "3px", width: "83vw", children: [_jsxs(Box, { position: "relative", bg: "#03143B", height: "200px", borderRadius: "20px", children: [_jsxs(Box, { marginBottom: "20px", children: [_jsx(Text, { color: "#ffffff", fontSize: "27px", fontWeight: "700", marginLeft: "15px", marginTop: "10px", children: "Employ\u00E9s" }), _jsx(Text, { color: "#ffffff", fontSize: "15px", fontWeight: "500", position: "relative", bottom: "20px", marginLeft: "15px", children: "G\u00E9rez les informations de vos employ\u00E9s" })] }), _jsx(Box, { position: "absolute", top: "1px", right: "1px", children: _jsx(AddEmployee, { onAddEmployee: handleAddEmployee }) }), _jsx(Box, { position: "absolute", left: "1px", bottom: "1px", children: _jsx(EmployeeFilterMenu, { onFilterClicked: handleFilterClicked }) }), _jsx(Box, { position: "absolute", right: "1px", bottom: "1px", children: _jsx(SearchBar, { onSearch: handleOnSearch }) })] }), _jsx(Box, { height: "75vh", overflowY: "scroll", borderRadius: "20px", children: loading ? (_jsx(VStack, { spacing: 0, mt: "2px", children: [...Array(6)].map((_, index) => (_jsxs(Flex, { w: "100%", bg: "#0A1F57", borderBottom: "1px solid", borderColor: "#1E355A", p: 4, alignItems: "center", gap: 4, children: [_jsx(SkeletonCircle, { size: "14", fadeDuration: 0.4 }), _jsxs(Box, { flex: "1", children: [_jsx(Skeleton, { height: "18px", width: "220px", mb: 3, borderRadius: "6px", startColor: "#132C68", endColor: "#1E3A7A" }), _jsx(SkeletonText, { noOfLines: 2, spacing: "3", skeletonHeight: "12px", startColor: "#132C68", endColor: "#1E3A7A" })] })] }, index))) })) : (_jsx(List, { mt: "2px", mb: 0, position: "relative", right: "11px", children: employees
                        .filter((employee) => !filter || employee.department === filter)
                        .filter((employee) => `${employee.firstName} ${employee.lastName}`
                        .toLowerCase()
                        .includes(searchText.toLowerCase()))
                        .map((employee) => (_jsx(ListItem, { borderBottom: "1px solid", borderColor: "#1E355A", bg: "#0A1F57", mb: 0, children: _jsx(EmployeeCard, { employee: employee }, employee.employeeID) }, employee._id))) })) }), _jsx(Box, { bg: "#03143B", height: "70px", mb: "2px" })] }));
};
export default EmployeeListPage;
