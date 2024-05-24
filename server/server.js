const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const dotenv = require("dotenv");
const { buildStaffQuery } = require("./staffQueries");
const { validateSearchQuery } = require("./utils/validationSearch");

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

const StaffSchema = new mongoose.Schema({
	staffId: { type: String, required: true, unique: true, length: 8 },
	fullName: { type: String, required: true, maxlength: 100 },
	birthday: { type: Date, required: true },
	gender: { type: Number, required: true },
});

const Staff = mongoose.model("Staff", StaffSchema);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send("Internal Server Error");
});

// create
app.post("/staff", async (req, res, next) => {
	const { staffId, fullName } = req.body;

	if (!staffId || !fullName || staffId.length !== 8 || fullName.length > 100) {
		return res.status(400).send("Invalid staffId or fullName");
	}

	try {
		const staff = new Staff(req.body);
		await staff.save();
		res.status(201).send(staff);
	} catch (error) {
		if (error.name === "MongoServerError" && error.code === 11000) {
			res.status(409).send("Duplicate staffId");
		} else {
			next(error);
		}
	}
});

// read
app.get("/staff", async (req, res, next) => {
	try {
		const staff = await Staff.find(req.query).maxTimeMS(30000);
		res.send(staff);
	} catch (error) {
		next(error);
	}
});

// update
app.put("/staff/:id", async (req, res, next) => {
	try {
		const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.send(staff);
	} catch (error) {
		next(error);
	}
});

// delete
app.delete("/staff/:id", async (req, res, next) => {
	try {
		await Staff.findByIdAndDelete(req.params.id);
		res.send({ message: "Staff deleted" });
	} catch (error) {
		next(error);
	}
});

app.get("/staff/search", validateSearchQuery, async (req, res, next) => {
	try {
		const query = buildStaffQuery(req.query);
		const staff = await Staff.find(query);
		res.json(staff);
	} catch (error) {
		next(error);
	}
});

// Export to Excel Endpoint
app.get("/staff/export/excel", async (req, res, next) => {
	try {
		const query = buildStaffQuery(req.query);
		const staff = await Staff.find(query);

		if (staff.length === 0) {
			return res.status(404).send("No staff found matching the criteria.");
		}

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Staff Data");

		worksheet.columns = [
			{ header: "Staff ID", key: "staffId", width: 10 },
			{ header: "Full Name", key: "fullName", width: 30 },
			{ header: "Birthday", key: "birthday", width: 15 },
			{ header: "Gender", key: "gender", width: 10 },
		];

		staff.forEach((member) => {
			worksheet.addRow({
				staffId: member.staffId,
				fullName: member.fullName,
				birthday: member.birthday.toISOString().split("T")[0],
				gender: member.gender === 1 ? "Male" : "Female",
			});
		});

		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader("Content-Disposition", "attachment; filename=staff.xlsx");

		await workbook.xlsx.write(res);
		res.end();
	} catch (error) {
		next(error);
	}
});

// Export to PDF Endpoint
app.get("/staff/export/pdf", async (req, res, next) => {
	try {
		const query = buildStaffQuery(req.query);
		const staff = await Staff.find(query);

		if (staff.length === 0) {
			return res.status(404).send("No staff found matching the criteria.");
		}

		const doc = new PDFDocument();
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", "attachment; filename=staff.pdf");

		doc.pipe(res);

		doc.fontSize(16).text("Staff Data", { align: "center" }).moveDown();

		staff.forEach((member) => {
			doc.fontSize(12).text(`Staff ID: ${member.staffId}`);
			doc.text(`Full Name: ${member.fullName}`);
			doc.text(`Birthday: ${member.birthday.toISOString().split("T")[0]}`);
			doc.text(`Gender: ${member.gender === 1 ? "Male" : "Female"}`);
			doc.moveDown();
		});

		doc.end();
	} catch (error) {
		next(error);
	}
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
