const validateSearchQuery = (req, res, next) => {
	const { staffId, gender, fromDate, toDate } = req.query;

	if (!staffId && !gender && !fromDate && !toDate) {
		return res.status(400).send("At least one search parameter is required");
	}

	if (fromDate && toDate && fromDate > toDate) {
		return res.status(400).send("From date cannot be greater than to date");
	}

	next();
};

module.exports = { validateSearchQuery };
