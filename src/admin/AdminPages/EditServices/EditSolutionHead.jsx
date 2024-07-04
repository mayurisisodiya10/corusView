import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { fetchSolutions, updateSolutionHeading } from "../../AdminServices";
import Notification from "../../../Notification/Notification"; // Adjust path as per your project structure

function EditSolutionHead() {
  const [mainHeading, setMainHeading] = useState("");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedHeading, setEditedHeading] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetchSolutions();
      setMainHeading(data.heading); // Set the 'heading' field from the fetched data
    } catch (error) {
      console.error("Error fetching solutions:", error);
      setError("Failed to fetch solutions.");
    }
  };

  const handleEditClick = () => {
    setOpenEditDialog(true);
    setEditedHeading(mainHeading); // Set initial value of edited heading to current mainHeading
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditedHeading(""); // Clear edited heading state
  };

  const handleSaveChanges = async () => {
    try {
      const response = await updateSolutionHeading(editedHeading); // Call API to update heading
      setMainHeading(editedHeading); // Update mainHeading in the component state
      setSuccessMessage(response.message);
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating solution heading:", error);
      setError("Failed to update solution heading.");
      setSuccessMessage(error.message, "error");
    }
  };

  const handleSuccessNotificationClose = () => {
    setSuccessMessage(null);
  };

  return (
    <div>
      <h2>Solutions Main Heading</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Main Heading</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>{mainHeading}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={handleEditClick}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Main Heading</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Main Heading"
            fullWidth
            value={editedHeading}
            onChange={(e) => setEditedHeading(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification for Success */}
      {successMessage && (
        <Notification
          open={true}
          handleClose={handleSuccessNotificationClose}
          alertMessage={successMessage}
          alertSeverity="success"
        />
      )}

      {/* Notification for Error */}
      {error && (
        <Notification
          open={true}
          handleClose={() => setError(null)}
          alertMessage={error}
          alertSeverity="error"
        />
      )}
    </div>
  );
}

export default EditSolutionHead;
