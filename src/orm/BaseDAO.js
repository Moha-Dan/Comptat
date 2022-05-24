function createDAOAttribute(object,key){
	return {
		get:()=>{
			return object[key]
		},
		set:function(newValue){
			var e = new Event("change")
			e.oldValue = object[key]
			e.newValue = newValue
			this.dispatchEvent(e)
			object[key] = newValue
		},
	}
}

class BaseDAO extends EventTarget{
	static columns = new Set();
	[Symbol.toStringTag](){
		return "BaseDAO"
	}
	static fromObject(object){
		var dao = new BaseDAO()
		Object.keys(object).forEach(key=>{
			Object.defineProperty(dao,key,
				createDAOAttribute(object,key)
			)
		})
		return dao
	}
	static fromClass(clazz){
		var object = new clazz()
		var agrs = []
		var construct = []
		construct.push(`var self = this;`)//Object.assign(new EventTarget,this||{})
		construct.push(`this.name = "${clazz.name}"`)
		var columns = new Set()
		construct.push(`var object = ${JSON.stringify(object)}`)
		Object.keys(object).forEach((x)=>{
			agrs.push(x)
			columns.add(x)
			construct.push(`object.${x} = ${x}`)
			construct.push(`Object.defineProperty(self,"${x}",
				{
					get:()=>{
						return object.${x}
					},
					set:()=>{
						var e = new Event("change")
						e.oldValue = object[key]
						e.newValue = newValue
						self.dispatchEvent(e)
						object[key] = newValue
					}
				}
			)`)
		})
		construct.push(`return self`)
		var constructor = new Function(...agrs,construct.join(';'))
		// console.log(constructor.toString())
		// constructor = Object.assign(BaseDAO,constructor)
		constructor.prototype = new BaseDAO
		Object.defineProperty(constructor,"columns",{
			get:()=>{return new Set(...columns)},
		})
		return constructor
	}
}
module.exports = BaseDAO