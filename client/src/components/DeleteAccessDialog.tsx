import WarningConfirmationDialog from "./WarningConfirmationDialog";

// Dialog for deleting access to a project
export default function DeleteAccessDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: (confirmed: boolean) => void;
}) {
    return (
        <WarningConfirmationDialog open={open} onClose={onClose}>
            Are you sure you want to prevent the selected user(s) from accessing
            this grant?
        </WarningConfirmationDialog>
    );
}
