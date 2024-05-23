import React, { useCallback, useState } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";
import axios from "axios";

import { HOST_URL } from "../App";

const AdvancedSearch = React.memo(({ onSearchResults, reloadInitialStaff }) => {
	const [criteria, setCriteria] = useState({
		staffId: "",
		gender: "",
		fromDate: "",
		toDate: "",
	});

	const handleInputChange = (e) => {
		setCriteria({ ...criteria, [e.target.name]: e.target.value });
	};

	const handleSearch = useCallback(() => {
		axios
			.get(`${HOST_URL}/staff/search`, { params: criteria })
			.then((response) => onSearchResults(response.data))
			.catch((error) => console.error(error));
	}, [criteria, onSearchResults]);

	const handleExport = useCallback(
		(type) => {
			axios
				.get(`${HOST_URL}/staff/export/${type}`, {
					params: criteria,
					responseType: "blob",
				})
				.then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute(
						"download",
						`staff.${type === "excel" ? "xlsx" : "pdf"}`
					);
					document.body.appendChild(link);
					link.click();
				})
				.catch((error) => console.error(error));
		},
		[criteria]
	);

	const handleClear = () => {
		setCriteria({
			staffId: "",
			gender: "",
			fromDate: "",
			toDate: "",
		});
		reloadInitialStaff();
	};

	return (
		<Box>
			<Box mb={2}>
				<TextField
					label="Staff ID"
					name="staffId"
					value={criteria.staffId}
					onChange={handleInputChange}
					fullWidth
					margin="normal"
					sx={{ maxWidth: "200px", paddingRight: "8px" }}
				/>
				<TextField
					select
					label="Gender"
					name="gender"
					value={criteria.gender}
					onChange={handleInputChange}
					fullWidth
					margin="normal"
					sx={{ maxWidth: "150px", paddingRight: "8px" }}
				>
					<MenuItem value="">All</MenuItem>
					<MenuItem value="1">Male</MenuItem>
					<MenuItem value="2">Female</MenuItem>
				</TextField>
				<TextField
					label="From Date"
					type="date"
					name="fromDate"
					value={criteria.fromDate}
					onChange={handleInputChange}
					fullWidth
					margin="normal"
					InputLabelProps={{ shrink: true }}
					sx={{ maxWidth: "200px", paddingRight: "8px" }}
				/>
				<TextField
					label="To Date"
					type="date"
					name="toDate"
					value={criteria.toDate}
					onChange={handleInputChange}
					fullWidth
					margin="normal"
					InputLabelProps={{ shrink: true }}
					sx={{ maxWidth: "200px", paddingRight: "8px" }}
				/>
				<Button
					variant="outlined"
					color="primary"
					onClick={handleSearch}
					sx={{ maxWidth: "200px", mt: 2, mr: 1 }}
				>
					Search
				</Button>
				<Button
					variant="outlined"
					color="secondary"
					onClick={handleClear}
					sx={{ maxWidth: "200px", mt: 2, mr: 1 }}
				>
					Clear
				</Button>
				<Button
					variant="contained"
					onClick={() => handleExport("excel")}
					sx={{ maxWidth: "200px", mt: 2, mr: 1 }}
				>
					Export to Excel
				</Button>
				<Button
					variant="contained"
					onClick={() => handleExport("pdf")}
					sx={{ maxWidth: "200px", mt: 2 }}
				>
					Export to PDF
				</Button>
			</Box>
		</Box>
	);
});

export default AdvancedSearch;
