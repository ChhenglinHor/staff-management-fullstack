import React, { useState, useCallback } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	MenuItem,
} from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axios from "axios";
import { format } from "date-fns";

const StaffList = React.memo(({ staff, onDelete, onEdit }) => {
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editFormData, setEditFormData] = useState({});
	const [editIndex, setEditIndex] = useState(null);

	const handleEdit = useCallback((index) => {
		setEditFormData(staff[index]);
		setEditIndex(index);
		setEditDialogOpen(true);
	}, []);

	const handleEditChange = useCallback((e) => {
		setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
	}, []);

	const handleEditSubmit = useCallback(() => {
		axios
			.put(`http://localhost:3003/staff/${editFormData._id}`, editFormData)
			.then((response) => {
				handleEditDialogClose();
				onEdit(editIndex, response.data);
			})
			.catch((error) => {
				console.error("Error updating staff member:", error);
			});
	}, []);

	const handleEditDialogClose = useCallback(() => {
		setEditDialogOpen(false);
		setEditFormData({});
		setEditIndex(null);
	}, []);

	return (
		<>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ backgroundColor: "lightblue" }}>
								Staff ID
							</TableCell>
							<TableCell sx={{ backgroundColor: "lightblue" }}>
								Full Name
							</TableCell>
							<TableCell sx={{ backgroundColor: "lightblue" }}>
								Birthday
							</TableCell>
							<TableCell sx={{ backgroundColor: "lightblue" }}>
								Gender
							</TableCell>
							<TableCell sx={{ backgroundColor: "lightblue" }}>
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{staff.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6}>no records found</TableCell>
							</TableRow>
						) : (
							staff.map((member, index) => (
								<TableRow key={member._id}>
									<TableCell>{member.staffId}</TableCell>
									<TableCell>{member.fullName}</TableCell>
									<TableCell>
										{format(new Date(member.birthday), "yyyy-MM-dd")}
									</TableCell>
									<TableCell>
										{member.gender === 1 ? "Male" : "Female"}
									</TableCell>
									<TableCell>
										<IconButton
											onClick={() => onDelete(member._id)}
											color="error"
										>
											<DeleteForeverOutlinedIcon />
										</IconButton>
										<IconButton onClick={() => handleEdit(index)}>
											<EditOutlinedIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))
						)}
						{/* {} */}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
				<DialogTitle>Edit Staff</DialogTitle>
				<DialogContent>
					<TextField
						label="Staff ID"
						name="staffId"
						value={editFormData.staffId || ""}
						onChange={handleEditChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Full Name"
						name="fullName"
						value={editFormData.fullName || ""}
						onChange={handleEditChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Birthday"
						type="date"
						name="birthday"
						value={
							editFormData.birthday
								? format(new Date(editFormData.birthday), "yyyy-MM-dd")
								: ""
						}
						onChange={handleEditChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						select
						label="Gender"
						name="gender"
						value={editFormData.gender || ""}
						onChange={handleEditChange}
						fullWidth
						margin="normal"
					>
						<MenuItem value={1}>Male</MenuItem>
						<MenuItem value={2}>Female</MenuItem>
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditDialogClose}>Cancel</Button>
					<Button onClick={handleEditSubmit}>Save</Button>
				</DialogActions>
			</Dialog>
		</>
	);
});

export default StaffList;
