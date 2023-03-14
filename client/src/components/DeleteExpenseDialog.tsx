import WarningConfirmationDialog from "./WarningConfirmationDialog";

// Dialog for deleting expense from a project
export default function DeleteExpenseDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: (confirmed: boolean) => void;
}) {
    return (
        <WarningConfirmationDialog open={open} onClose={onClose}>
            Deleting an expense will <strong>permanently</strong> delete{" "}
            <strong>all</strong> of it's data, including corresponding budget entries. Are
            you sure you want to proceed?
        </WarningConfirmationDialog>
    );
}
