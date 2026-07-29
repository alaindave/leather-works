import type Employee from "../../common/types/Employee";
interface Props {
    employee: Employee | null;
}
declare const EmployeeDetailsTab: ({ employee }: Props) => import("react").JSX.Element | null;
export default EmployeeDetailsTab;
