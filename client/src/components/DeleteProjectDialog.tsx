import WarningConfirmationDialog from "./WarningConfirmationDialog";

// Dialog for deleting project
export default function DeleteProjectDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: (confirmed: boolean) => void;
}) {
    return (
        <WarningConfirmationDialog open={open} onClose={onClose}>
            Deleting a grant will <strong>permanently</strong> delete <strong>all</strong>{" "}
            of it's data, including any expenses, budget entries and fellows. Are you sure
            you want to proceed?
        </WarningConfirmationDialog>
    );
}
