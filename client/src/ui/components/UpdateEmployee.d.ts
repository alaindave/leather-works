import type Employee from "../../common/types/Employee";
import "react-datepicker/dist/react-datepicker.css";
interface Props {
    _id: string | undefined;
    employee: Employee | null;
    onUpdated?: () => void;
}
declare const UpdateEmployee: ({ _id, employee, onUpdated }: Props) => import("react").JSX.Element | undefined;
export default UpdateEmployee;
