import WarningConfirmationDialog from "./WarningConfirmationDialog";

// dialog for deleting fellow from a project
export default function DeleteFellowDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: (confirmed: boolean) => void;
}) {
    return (
        <WarningConfirmationDialog open={open} onClose={onClose}>
            Deleting fellow(s) will remove all records involving them, including any records
            of salaries paid to them. Are you sure you want to proceed?
        </WarningConfirmationDialog>
    );
}
