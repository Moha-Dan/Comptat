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
	static rebuild(data,source){
		if(data.length<2) return 
		data = data.slice(1)
		var obj = new source()
		var i = 0
		source.columns.forEach((v)=>{
			obj[v] = data[i]
			i++
		})
		return obj
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
	static fromClass(clazz,name){
		var object
		try{
			object = new clazz()
		}catch{
			object = clazz
		}
		name ||= clazz.name
		var agrs = []
		var construct = []
		construct.push(`var self = this;`)//Object.assign(new EventTarget,this||{})
		construct.push(`this.name = "${name}"`)
		var columns = new Set()
		construct.push(`var object = ${JSON.stringify(object)}`)
		Object.keys(object).forEach((x)=>{
			agrs.push(x)
			// console.log(x)
			var c = new String(x)
			c.data = object[x]
			columns.add(c)
			construct.push(`object.${x} = ${x}`)
			construct.push(`Object.defineProperty(self,"${x}",
				{
					get:()=>{
						return object.${x}
					},
					set:(newValue)=>{
						var e = new Event("change")
						e.oldValue = object.${x}
						e.newValue = newValue
						self.dispatchEvent(e)
						object.${x} = newValue
					}
				}
			)`)
		})
		construct.push(`self.toJSON = ()=>JSON.stringify(object)`)
		construct.push(`return self`)
		var constructor = new Function(...agrs,construct.join(';'))
		// console.log(constructor.toString())
		// constructor = Object.assign(BaseDAO,constructor)
		constructor.prototype = new BaseDAO
		// constructor.name = clazz.name
		Object.defineProperty(constructor,"columns",{
			get:()=>{return new Set(columns)},
		})
		
		var descriptor = Reflect.getOwnPropertyDescriptor(constructor,"name")
		Reflect.deleteProperty(constructor,"name")
		descriptor.value = name
		Reflect.defineProperty(constructor,"name",descriptor)
		
		return constructor
	}
}
module.exports = BaseDAO