import type Employee from "../../common/types/Employee";
import "../styles/App.css";
interface Props {
    employee: Employee;
}
declare const EmployeeCard: ({ employee }: Props) => import("react").JSX.Element;
export default EmployeeCard;
