import AttendanceWithEmployee from "../../common/types/AttendanceWithEmployee";
interface Props {
    attendance: AttendanceWithEmployee | null;
    onDelete: () => void;
    gridTemplate: string;
    isUnlocked: boolean;
    toggleOff: () => void;
}
declare const _default: import("react").MemoExoticComponent<({ attendance, onDelete, gridTemplate, isUnlocked, toggleOff, }: Props) => import("react").JSX.Element | null>;
export default _default;
