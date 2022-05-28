const ListDAO = require("./ListDAO")

class ObjectManager extends EventTarget{
	#database
	constructor(database){
		this.#database = database
	}
	#tables = new Map()
	has(name){
		return this.#tables.has(name)
	}
	get(name){
		return this.#tables.get(name)
	}
	set(name,clazz){
		var T = new ListDAO(clazz,this.#database,name)
		this.#tables.set(name,T)
		return T
	}
}
module.exports = ObjectManager