interface Props {
    onSubmit: (notes: string | undefined) => Promise<boolean>;
}
declare const TaskResolutionPopover: ({ onSubmit }: Props) => import("react").JSX.Element;
export default TaskResolutionPopover;
