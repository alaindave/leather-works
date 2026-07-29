interface Props {
    type: "EARNING" | "DEDUCTION";
    employeeID: string;
    onCreated?: () => void;
}
export default function AddPayrollEmployeeProfileModal({ type, onCreated, employeeID, }: Props): import("react").JSX.Element;
export {};
