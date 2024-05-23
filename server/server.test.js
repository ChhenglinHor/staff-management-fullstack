const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

beforeAll(async () => {
	await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("Staff Management API", () => {
	let server;

	beforeAll(() => {
		server = app.listen(8001);
	});

	afterAll(() => {
		server.close();
	});

	it("should create a new staff member", async () => {
		const res = await request(app).post("/staff").send({
			staffId: "C123",
			fullName: "John Doe2",
			birthday: "1990-01-01",
			gender: 1,
		});

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty("_id");
	});

	it("should get all staff members", async () => {
		const res = await request(app).get("/staff");
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
	});

	it("should update an existing staff member", async () => {
		const createResponse = await request(app).post("/staff").send({
			staffId: "C1232",
			fullName: "Jane Doe",
			birthday: "1995-05-05",
			gender: 2,
		});

		const updatedFullName = "Jane Doe Updated";

		const updateResponse = await request(app)
			.put(`/staff/${createResponse.body._id}`)
			.send({
				fullName: updatedFullName,
			});

		expect(updateResponse.statusCode).toEqual(
			200,
			JSON.stringify(updateResponse.body)
		);
		expect(updateResponse.body.fullName).toEqual(updatedFullName);
	});

	it("should delete an existing staff member", async () => {
		const createResponse = await request(app).post("/staff").send({
			staffId: "B12327",
			fullName: "Alice Smith",
			birthday: "1988-08-08",
			gender: 2,
		});

		const deleteResponse = await request(app).delete(
			`/staff/${createResponse.body._id}`
		);

		expect(deleteResponse.statusCode).toEqual(200);
		expect(deleteResponse.body.message).toEqual("Staff deleted");
	});

	it("should search for staff members based on criteria", async () => {
		const res = await request(app).get("/staff/search?gender=1");
		expect(res.statusCode).toEqual(200);
		expect(Array.isArray(res.body)).toBe(true);
		expect(res.body.length).toBeGreaterThan(0);
	});
});
