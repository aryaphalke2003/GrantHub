import { Check, Close } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";

// Popup dialog template
export default function WarningConfirmationDialog({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: (confirmed: boolean) => void;
    children;
}) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
                <DialogContentText>{children}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    startIcon={<Close />}
                    onClick={() => onClose(false)}
                >
                    Cancel
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Check />}
                    onClick={() => onClose(true)}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
