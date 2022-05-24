const BaseDAO = require("./src/orm/BaseDAO");
const SQLManager = require("./src/orm/SQLManager");
const { LONG, STRING } = require("./src/orm/Types");

class User{
	id = LONG
	username = STRING
	password = STRING
}

// console.log(new User)

// UserDAO = BaseDAO.fromObject(new User)
sqlm = new SQLManager(":memory:")
UserDAO = BaseDAO.fromClass(User)
sqlm.create(UserDAO)
udao = new UserDAO(0,"jhn")

console.log()