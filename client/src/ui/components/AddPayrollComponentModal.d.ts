interface Props {
    type: "EARNING" | "DEDUCTION";
    onCreated?: () => void;
}
export default function AddPayrollComponentModal({ type, onCreated }: Props): import("react").JSX.Element;
export {};
