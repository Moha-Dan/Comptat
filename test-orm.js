const BaseDAO = require("./src/orm/BaseDAO");
const Database = require("./src/orm/drivers/sqlite");
const ListDAO = require("./src/orm/ListDAO");
const { createQueryServer } = require("./src/orm/QueryServer");
const SQLManager = require("./src/orm/SQLManager");
const { LONG, STRING } = require("./src/orm/Types");

class User{
	id = LONG
	username = STRING
	password = STRING
}

// console.log(new User)

// UserDAO = BaseDAO.fromObject(new User)
// sqlm = new SQLManager("database.db")
// UserDAO = BaseDAO.fromClass(User)
// ldao = new ListDAO(UserDAO,sqlm)
// console.log(UserDAO,UserDAO.name,UserDAO.columns)
// sqlm.create(UserDAO)
// udao = new UserDAO(0,"jhn")
// ldao.push(udao)
// udao = new UserDAO(0,"nhj")
// ldao.push(udao)
// console.log(ldao.length)
// console.log(ldao.find({username:"jhn"}))
// console.log(ldao.filter({username:"nhj"}))
// console.log(ldao.sort("username DESC"))
// ldao.forEach(x=>{
// 	console.log(x)
// })
// console.log(udao.username)
// sqlm.insert(UserDAO,udao)
// console.log(sqlm.select(UserDAO))
// console.log(sqlm.select(UserDAO,{username:"jhn"}))
// console.log(udao.addEventListener)
// udao.username = "john"
// console.log(udao.username)
// sql = new Database(":memory:")
// sql.connect()
// console.log(sql.exec(".help"))
// sql.close()

qs = createQueryServer(
	{
		database:"database.db",
		entities:require("./src/entities.json"),
		queries:require("./src/queries.json"),
	}
)
qs.query("demande.yours",{"id":"0"})
qs.query("demande.yoursCount",{"id":"0"})
qs.query("demande.projects",{"id":"0"})