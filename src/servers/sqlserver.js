const { createQueryServer } = require("../orm/QueryServer")

module.exports = function(){
	const qs = createQueryServer(
		{
			database:"database.db",
			entities:require("../entities.json"),
			queries:require("../queries.json"),
		}
	)
	return qs
}