class Manager{
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
		var T = new Table(clazz,this.#database,name)
		this.#tables.set(name,T)
		return T
	}
}
module.exports = {ObjectManager:Manager,ObjectTable:Table}