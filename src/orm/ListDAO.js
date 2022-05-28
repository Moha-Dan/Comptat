const BaseDAO = require("./BaseDAO")

class ListDAO extends EventTarget{
	#array = []
	#database
	#source
	#name
	constructor(obj,database,name){
		super()
		if(typeof obj != "string"){
			this.#name = obj.name
			this.#source = obj
			this.#database = database
		}else{
			this.#name = name
			this.#source = obj
			this.#database = database
		}
	}
	#rebuild(res){
		return res.split('\n').reduce((all,rep)=>{
			var data = rep.split(',')
			var t = BaseDAO.rebuild(data,this.#source)
			if(!t) return all
			var r = {
				value:t,
				index:data[0],
			}
			all.push(r)
			return all
		},[])
	}
	get length(){
		return parseInt(this.#database.select(this.#source,null,{columns:"Count(*)"}))
	}
	filter(obj){
		var res = this.#database.select(this.#source,obj)
		return this.#rebuild(res)
	}
	find(obj){
		var res = this.#database.select(this.#source,obj,{limit:1})
		return this.#rebuild(res)[0].value
	}
	forEach(callback){
		var res = this.#database.select(this.#source,null)
		this.#rebuild(res).forEach(x=>{
			callback(x.value,x.index)
		})
	}
	push(...items){
		this.#array.push(...items)
		var ev = new Event("push")
		ev.table = this.#name
		ev.prop = {
			name:"length",
			value:this.#array.length,
		}
		this.dispatchEvent(ev)
	}
	sort(order){
		var res = this.#database.select(this.#source,null,{order})
		return this.#rebuild(res)
	}
	slice(){}
	// remove(value){}
	// includes(value){}
}
module.exports = ListDAO