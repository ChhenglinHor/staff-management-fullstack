import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Typography,
} from "@mui/material";

import StaffList from "./components/StaffList";
import AddStaffForm from "./components/AddStaffForm";
import AdvancedSearch from "./components/AdvancedSearch";

export const HOST_URL = process.env.REACT_APP_API_URL;

const App = () => {
	const [staff, setStaff] = useState([]);
	const [open, setOpen] = useState(false);

	const loadInitialStaff = useCallback(() => {
		axios.get(`${HOST_URL}/staff`).then((response) => {
			setStaff(response.data);
		});
	}, []);

	useEffect(() => {
		loadInitialStaff();
	}, [loadInitialStaff]);

	const handleAdd = (newStaff) => {
		setStaff([...staff, newStaff]);
		handleClose();
	};

	const handleDelete = (id) => {
		axios.delete(`${HOST_URL}/staff/${id}`).then(() => {
			setStaff(staff.filter((member) => member._id !== id));
		});
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleEdit = (index, updatedStaff) => {
		const updatedStaffList = [...staff];
		updatedStaffList[index] = updatedStaff;
		setStaff(updatedStaffList);
	};

	const handleSearchResults = useCallback((results) => {
		setStaff(results);
	}, []);

	return (
		<Box pr={2} pl={2}>
			<Box textAlign="center" mt={2} mb={2}>
				<Typography variant="h4">Staff Management</Typography>
			</Box>
			<Button sx={{ mb: 2 }} variant="contained" onClick={handleClickOpen}>
				Add New Staff
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add New Staff</DialogTitle>
				<DialogContent>
					<AddStaffForm onAdd={handleAdd} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
			<AdvancedSearch
				onSearchResults={handleSearchResults}
				reloadInitialStaff={loadInitialStaff}
			/>
			<StaffList staff={staff} onDelete={handleDelete} onEdit={handleEdit} />
		</Box>
	);
};

export default App;
