const { createQueryServer } = require("../orm/QueryServer")

module.exports = function(){
	const qs = createQueryServer(
		{
			database:"database.db",
			entities:require("../../config/entities.json"),
			queries:require("../../config/queries.json"),
		}
	)
	return qs
}