import AttendanceWithEmployee from "../../common/types/AttendanceWithEmployee";
interface Props {
    attendance?: AttendanceWithEmployee | null;
    onRefresh?: () => void;
    isUnlocked: boolean;
    awayStatus?: "ABSENT" | "CONGÉ" | null;
}
export declare const formatLateMinutes: (lateMinutes: number) => string;
declare const ClockIn: ({ attendance, onRefresh, isUnlocked, awayStatus }: Props) => import("react").JSX.Element | undefined;
export default ClockIn;
