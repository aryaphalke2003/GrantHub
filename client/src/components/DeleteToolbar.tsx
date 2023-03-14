import { DeleteForever } from "@mui/icons-material";
import { Button } from "@mui/material";
import {
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
} from "@mui/x-data-grid";

// Toolbar used in most tables to support additional features and row deletion
export default function DeleteToolbar(
    filter: boolean,
    selectionActive: boolean,
    deleteCallback: () => void
) {
    return () => (
        <GridToolbarContainer className="text-xs text-gray-700 uppercase">
            <GridToolbarColumnsButton />
            {filter && <GridToolbarFilterButton />}
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            {selectionActive && (
                <Button
                    startIcon={<DeleteForever />}
                    onClick={deleteCallback}
                    size="small"
                >
                    Delete
                </Button>
            )}
        </GridToolbarContainer>
    );
}
