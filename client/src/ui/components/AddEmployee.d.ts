import "react-datepicker/dist/react-datepicker.css";
import type Employee from "../../common/types/Employee";
import "../styles/App.css";
interface Props {
    onAddEmployee: (employee: Employee) => void;
}
declare const AddEmployee: ({ onAddEmployee }: Props) => import("react").JSX.Element;
export default AddEmployee;
