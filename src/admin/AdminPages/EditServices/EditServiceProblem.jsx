import React, { useState, useEffect } from "react";
import {
  Box,
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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  fetchProblems,
  updateProblem,
  deleteProblem,
  addProblem,
  fetchOnlyOurServiceHead,
} from "../../AdminServices"; // Adjust path as per your project structure

import Notification from "../../../Notification/Notification"; // Adjust path as per your project structure

function EditServiceProblem() {
  const [problems, setProblems] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [editedHeading, setEditedHeading] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [newHeading, setNewHeading] = useState("");
  const [newContent, setNewContent] = useState("");
  const [ourServicesHeadings, setOurServicesHeadings] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  // Notification state
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");

  const fetchData = async () => {
    try {
      const problemsData = await fetchProblems();
      setProblems(problemsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("Failed to fetch problems.", "error");
    }
  };

  const fetchOurServiceHeadings = async () => {
    try {
      const data = await fetchOnlyOurServiceHead();
      setOurServicesHeadings(data);
    } catch (error) {
      console.error("Error fetching service headings:", error);
      showNotification("Failed to fetch service headings.", "error");
    }
  };

  const handleEditClick = (problem) => {
    setSelectedProblem(problem);
    setEditedHeading(problem.problems_inner_heading);
    setEditedContent(problem.problems_inner_content);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (problem) => {
    setSelectedProblem(problem);
    setOpenDeleteDialog(true);
  };

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedProblem(null);
    setEditedHeading("");
    setEditedContent("");
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProblem(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewHeading("");
    setNewContent("");
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        service_id: selectedProblem.service_id,
        our_services_heading: selectedProblem.our_services_heading,
        problems_inner_heading: editedHeading,
        problems_inner_content: editedContent,
      };
      const response = await updateProblem(
        selectedProblem.problems_id,
        updatedData
      );
      await fetchData();
      handleCloseEditDialog();
      showNotification("Problem updated successfully.", "success");
    } catch (error) {
      console.error("Error updating problem:", error);
      showNotification("Failed to update problem.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteProblem(selectedProblem.problems_id);
      await fetchData();
      handleCloseDeleteDialog();
      showNotification("Problem deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting problem:", error);
      showNotification("Failed to delete problem.", "error");
    }
  };

  const handleAddProblem = async () => {
    try {
      const newProblem = {
        problems_inner_heading: newHeading,
        problems_inner_content: newContent,
        service_id: selectedService.id,
      };
      const response = await addProblem(newProblem);
      await fetchData();
      handleCloseAddDialog();
      showNotification("Problem added successfully.", "success");
    } catch (error) {
      console.error("Error adding problem:", error);
      showNotification("Failed to add problem.", "error");
    }
  };

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setOpenNotification(true);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };

  useEffect(() => {
    fetchData();
    fetchOurServiceHeadings();
  }, []);

  return (
    <>
      <Box>
        <Typography variant="h5" component="h5">
          Edit Service Problem
        </Typography>

        {/* Add Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddClick}
          style={{ marginBottom: "1rem" }}
        >
          Add Problem
        </Button>

        {/* Table of Problems */}
        <TableContainer
          component={Paper}
          style={{ marginTop: "10px", maxHeight: "500px", overflow: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Our Services Heading</TableCell>
                <TableCell>Inner Heading</TableCell>
                <TableCell>Inner Content</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map((problem, index) => (
                <TableRow key={problem.problems_id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{problem.our_services_heading}</TableCell>
                  <TableCell>{problem.problems_inner_heading}</TableCell>
                  <TableCell>{problem.problems_inner_content}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(problem)}>
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDeleteClick(problem)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Problem</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Inner Heading"
              fullWidth
              value={editedHeading}
              onChange={(e) => setEditedHeading(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Inner Content"
              fullWidth
              multiline
              rows={4}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Problem Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add Problem</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Select Our Service Heading</InputLabel>
              <Select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                fullWidth
                name="selectedOurService"
              >
                {ourServicesHeadings.map((service) => (
                  <MenuItem key={service.id} value={service}>
                    {service.heading}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Inner Heading"
              fullWidth
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Inner Content"
              fullWidth
              multiline
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Cancel</Button>
            <Button onClick={handleAddProblem} color="primary">
              Add Problem
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Problem</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this problem?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Component */}
        <Notification
          open={openNotification}
          handleClose={handleCloseNotification}
          alertMessage={notificationMessage}
          alertSeverity={notificationSeverity}
        />
      </Box>
    </>
  );
}

export default EditServiceProblem;
