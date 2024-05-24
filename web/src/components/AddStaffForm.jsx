import React, { useCallback, useState } from "react";
import axios from "axios";
import {
	TextField,
	Button,
	Grid,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
} from "@mui/material";

import { HOST_URL } from "../App";

const AddStaffForm = React.memo(({ onAdd }) => {
	const [form, setForm] = useState({
		staffId: "",
		fullName: "",
		birthday: "",
		gender: 1, // 1 represents 'Male' and 2 represents 'Female'
	});

	const handleChange = useCallback(
		(e) => {
			setForm({ ...form, [e.target.name]: e.target.value });
		},
		[form]
	);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();

			const formattedForm = {
				...form,
				birthday: new Date(form.birthday),
			};

			axios
				.post(`${HOST_URL}/staff`, formattedForm)
				.then((response) => {
					onAdd(response.data);
					setForm({
						staffId: "",
						fullName: "",
						birthday: "",
						gender: 1,
					});
				})
				.catch((error) => {
					if (error.response && error.response.status === 400) {
						alert("Invalid staffId or fullName");
					} else {
						alert("An error occurred while adding the staff member");
					}
				});
		},
		[form]
	);

	return (
		<form onSubmit={handleSubmit}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<TextField
						label="Staff ID"
						name="staffId"
						value={form.staffId}
						onChange={handleChange}
						fullWidth
						required
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Full Name"
						name="fullName"
						value={form.fullName}
						onChange={handleChange}
						fullWidth
						required
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						label="Birthday"
						type="date"
						name="birthday"
						value={form.birthday}
						onChange={handleChange}
						fullWidth
						required
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
				<Grid item xs={12}>
					<FormControl fullWidth required>
						<InputLabel>Gender</InputLabel>
						<Select
							label="Gender"
							name="gender"
							value={form.gender}
							onChange={handleChange}
						>
							<MenuItem value={1}>Male</MenuItem>
							<MenuItem value={2}>Female</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<Button type="submit" variant="contained">
						Add Staff
					</Button>
				</Grid>
			</Grid>
		</form>
	);
});

export default AddStaffForm;
