const buildStaffQuery = (queryParams) => {
  const { staffId, gender, fromDate, toDate } = queryParams;

  let query = {};
  if (staffId) query.staffId = staffId;
  if (gender) query.gender = gender;
  if (fromDate && toDate) {
    query.birthday = { $gte: new Date(fromDate), $lte: new Date(toDate) };
  }

  return query;
};

module.exports = { buildStaffQuery };
