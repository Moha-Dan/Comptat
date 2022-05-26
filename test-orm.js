const BaseDAO = require("./src/orm/BaseDAO");
const Database = require("./src/orm/drivers/sqlite");
const SQLManager = require("./src/orm/SQLManager");
const { LONG, STRING } = require("./src/orm/Types");

class User{
	id = LONG
	username = STRING
	password = STRING
}

// console.log(new User)

UserDAO = BaseDAO.fromObject(new User)
sqlm = new SQLManager("database.db")
UserDAO = BaseDAO.fromClass(User)
// console.log(UserDAO,UserDAO.name,UserDAO.columns)
// sqlm.create(UserDAO)
// udao = new UserDAO(0,"jhn")
// udao = new UserDAO(0,"nhj")
// console.log(udao.username)
sqlm.insert(UserDAO,udao)
console.log(sqlm.select(UserDAO))
console.log(sqlm.select(UserDAO,{username:"jhn"}))
// sql = new Database(":memory:")
// sql.connect()
// console.log(sql.exec(".help"))
// sql.close()