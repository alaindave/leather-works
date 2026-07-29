interface Props {
    onSubmit: (notes: string | undefined) => Promise<boolean>;
    existingNotes?: string | undefined;
}
declare const AddClockInNotesPopover: ({ onSubmit, existingNotes }: Props) => import("react").JSX.Element;
export default AddClockInNotesPopover;
