import { IconType } from "react-icons";
interface Props {
    property: string;
    value?: string | number | null;
    icon: IconType;
}
declare const EmployeeDetailsCard: ({ property, value, icon }: Props) => import("react").JSX.Element;
export default EmployeeDetailsCard;
