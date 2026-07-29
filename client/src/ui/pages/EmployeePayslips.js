import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdOutlineChevronRight } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
const EmployeePayrollReport = () => {
    const location = useLocation();
    const { employee } = location.state || {};
    const { photo_url } = location.state || "";
    // const [payrollProfiles, setPayrollProfiles] = useState<
    //   PayrollEmployeeProfile[]
    // >([]);
    // useEffect(() => {
    //   getPayrollHistory();
    // }, []);
    // async function getPayrollHistory() {
    //   if (!employee?._id) return;
    //   const payroll_profiles =
    //     await window.electron.payrollEmployeeProfiles.getByEmployee(
    //       employee?._id
    //     );
    //   console.log("PAYROLL PROFILES FETCHED:", payroll_profiles);
    //   setPayrollProfiles(payroll_profiles);
    // }
    return (_jsxs(Flex, { direction: "column", bg: "#ffffff", width: "100%", alignItems: "flex-start", children: [_jsxs(Flex, { justify: "space-between", width: "100%", children: [_jsxs(HStack, { mt: "1.4rem", children: [_jsx(Link, { to: {
                                    pathname: `/employees_admin/employees_list/${employee?._id}`,
                                }, state: { photo_url }, children: _jsx(Box, { ml: "0.8rem", mb: "2rem", p: 2, border: "1px solid #14376b", borderRadius: "10px", children: _jsx(FaArrowLeftLong, { color: "black" }) }) }), _jsx(Box, { mt: "0.5rem", children: _jsxs(HStack, { ml: "0.3rem", position: "relative", bottom: "1rem", children: [_jsx(Text, { fontSize: "1.1rem", fontWeight: "500", children: "Employ\u00E9s" }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsxs(Text, { fontSize: "1.1rem", fontWeight: "500", children: [" ", employee?.firstName, " ", employee?.lastName] }), _jsx(Box, { position: "relative", bottom: "0.3rem", children: _jsx(MdOutlineChevronRight, { fontSize: "1.3rem" }) }), _jsx(Text, { fontSize: "1.1rem", fontWeight: "500", children: "Fiches de paye" })] }) })] }), _jsx(Link, { to: {
                            pathname: `/employees_admin/employees_list/${employee?._id}/payslips/settings`,
                        }, state: { employee, photo_url }, children: _jsx(Box, { position: "absolute", top: "1rem ", right: "1.5rem", children: _jsx(IoSettings, { fontSize: "1.7rem" }) }) })] }), _jsx(Text, { children: "Payroll history goes here" })] }));
};
export default EmployeePayrollReport;
