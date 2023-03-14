import WarningConfirmationDialog from "./WarningConfirmationDialog";

// Dialog for deleting a user
export default function DeleteUserDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: (confirmed: boolean) => void;
}) {
    return (
        <WarningConfirmationDialog open={open} onClose={onClose}>
            Deleting user(s) will prevent them from being able to log in and access this
            portal. Any pending projects they may have created will be deleted. Are you
            sure you want to continue?
        </WarningConfirmationDialog>
    );
}
