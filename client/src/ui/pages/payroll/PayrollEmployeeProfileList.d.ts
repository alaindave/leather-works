interface Props {
    type: "EARNING" | "DEDUCTION";
    employeeID: string;
}
export default function PayrollEmployeeProfileList({ type, employeeID, }: Props): import("react").JSX.Element;
export {};
