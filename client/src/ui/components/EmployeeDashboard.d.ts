interface Props {
    employeeCount: number;
    attendanceCount: number;
    leaveCount: number;
    lateCount: number;
}
declare const EmployeeDashboard: ({ employeeCount, attendanceCount, lateCount, leaveCount, }: Props) => import("react").JSX.Element;
export default EmployeeDashboard;
