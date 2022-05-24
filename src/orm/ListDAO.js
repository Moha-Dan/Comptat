class Table extends EventTarget{
	#array = []
	#database
	#source
	#name
	constructor(obj,database,name){
		super()
		this.#name = name
		this.#source = obj
		this.#database = database
	}
	get length(){
		return this.#array.length
	}
	filter(obj){
		return this.#array.filter(x=>{
			Object.keys(obj).every(y=>{
				return x[y] == obj[y]
			})
		})
	}
	find(obj){
		return this.#array.find(x=>{
			Object.keys(obj).every(y=>{
				return x[y] == obj[y]
			})
		})
	}
	forEach(callback){
		this.#array.forEach(callback)
	}
	push(...items){
		this.#array.push(...items)
		var ev = new Event()
		ev.table = this.#name
		ev.prop = {
			name:"length",
			value:this.#array.length,
		}
		this.dispatchEvent(ev)
	}
	sort(order){
		var sorting = ""
		Object.keys(order).forEach(x=>{
			var o = "+"
			if(order[x] == "DEC"){
				o = "-"
			}
			sorting.concat(`a.${x}${o}b.${x}`)
		})
		this.#array.sort(
			new Function("a","b",sorting)
		)
	}
	slice(){

	}
	remove(){

	}
}