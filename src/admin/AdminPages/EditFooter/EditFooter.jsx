import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Typography
} from "@mui/material";
import { fetchFooterData, updateFooterData } from "../../AdminServices";
import { ChromePicker } from "react-color";
import Notification from "../../../Notification/Notification"; // Adjust the path as needed

const EditFooter = () => {
  const [footerData, setFooterData] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [selectedColor, setSelectedColor] = useState("#000000"); // Default color
  const [loading, setLoading] = useState(true);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("default");
  const fetchData = async () => {
    try {
      const response = await fetchFooterData();
      setFooterData(response);
      setEditItem(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

 

  const handleEditClick = (item) => {
    setEditItem({ ...item });
    setSelectedColor(item.footer_color); // Set initial color for color picker
    setEditDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({ ...editItem, [name]: value });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    setEditItem({ ...editItem, footer_color: color.hex });
  };

  const handleUpdate = async () => {
    if (!editItem.email || !editItem.phone || !editItem.address || !editItem.link1 || !editItem.link2 || !editItem.link3) {
      setNotificationMessage("All fields are required");
      setNotificationSeverity("error");
      setNotificationOpen(true);
      return;
    }

    try {
      const response = await updateFooterData(editItem.id, editItem);
      setNotificationMessage(response.message);
      setNotificationSeverity("success");
      fetchData();
      setEditDialogOpen(false);
    } catch (error) {
      setNotificationMessage("Error updating data");
      setNotificationSeverity("error");
      console.error("Error updating data:", error);
    } finally {
      setNotificationOpen(true);
    }
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!footerData) {
    return null;
  }

  return (
    <div>
        <Typography variant="h5" component="h5">
      Edit Footer
    </Typography>
      <TableContainer component={Paper} style={{marginTop:"10px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Link 1</TableCell>
              <TableCell>Link 2</TableCell>
              <TableCell>Link 3</TableCell>
              <TableCell>Footer Color</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{footerData.id}</TableCell>
              <TableCell>{footerData.email}</TableCell>
              <TableCell>{footerData.phone}</TableCell>
              <TableCell>{footerData.address}</TableCell>
              <TableCell>
                <a href={footerData.link1} target="_blank" rel="noopener noreferrer">
                  Instagram Link
                </a>
              </TableCell>
              <TableCell>
                <a href={footerData.link2} target="_blank" rel="noopener noreferrer">
                  Linkedin Link
                </a>
              </TableCell>
              <TableCell>
                <a href={footerData.link3} target="_blank" rel="noopener noreferrer">
                  Youtube Link
                </a>
              </TableCell>
              <TableCell style={{ backgroundColor: footerData.footer_color, height: 50, width: 50 }}></TableCell>
              <TableCell>
                <Button onClick={() => handleEditClick(footerData)}>Edit</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Footer Data</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Email"
            name="email"
            value={editItem.email || ""}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Phone"
            name="phone"
            value={editItem.phone || ""}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Address"
            name="address"
            value={editItem.address || ""}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Link 1"
            name="link1"
            value={editItem.link1 || ""}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Link 2"
            name="link2"
            value={editItem.link2 || ""}
            onChange={handleInputChange}
          />
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="Link 3"
            name="link3"
            value={editItem.link3 || ""}
            onChange={handleInputChange}
          />
          <ChromePicker color={selectedColor} onChangeComplete={handleColorChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate}  color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Notification
        open={notificationOpen}
        handleClose={handleCloseNotification}
        alertMessage={notificationMessage}
        alertSeverity={notificationSeverity}
      />
    </div>
  );
};

export default EditFooter;
