const { columns } = require("./BaseDAO")
const BaseDAO = require("./BaseDAO")
const ListDAO = require("./ListDAO")
const SQLManager = require("./SQLManager")

class QueryServer{
	#sqlm = null
	#entities = null
	#tables = null
	get entities(){
		return this.#entities
	}
	#queries = null
	constructor(config){
		this.#sqlm = new SQLManager(config.database)
		const entities = Object.keys(config.entities||{})
		this.#queries = (config.queries||{})
		this.#entities = new Map()
		this.#tables = new Map()
		entities.forEach(x=>{
			var table = this.createClassFromEntity(x,config.entities[x])
			var tables = this.#sqlm.exec(`.schema ${table.name}`)
			if(tables) tables = tables.slice(0,-2)
			var create = this.#sqlm.createCommand(table)
			if(tables && tables!=create){
				console.log("exec","drop")
				this.#sqlm.exec(`DROP TABLE ${table.name}`)
				tables = null
			}
			if(!tables){
				console.log("exec","create")
				this.#sqlm.exec(create)
			}
			this.#tables.set(table.name, new ListDAO(table))
			this.#entities.set(table.name, table)
		})
	}
	query(query,data){
		var Q = this.queryBuild(query,data)
		// console.log(Q)
		var {columns,tables,where} = Q
		columns = columns?[...columns].join(','):"*"
		tables = [...tables.keys()]
		var where = [...where.keys()].map(x=>{
			return `${x} = ${Q.where.get(x)}`
		})
		// console.log(where)
		var S = `SELECT ${columns||"*"} FROM ${tables} ${where.length>0?"WHERE "+where.join(' AND '):""}`
		// console.log(S)
		var R = this.#sqlm.exec(S)
		// console.log(R)
		return R
	}
	queryBuild(query,data){
		var queryFX = typeof query == "string"?query:query.query
		var QD = {
			where:new Map(),
			tables:new Map(),
			columns:new Set(),
		}
		if(!queryFX)return QD
		queryFX = queryFX.split(".")
		// console.log(this.#entities[queryFX[0]],queryFX[0])
		if(this.#entities.has(queryFX[0])){
			var table = queryFX[0]
			if(!QD.tables.has(table)){
				QD.tables.set(table,new Set)
			}
			if(queryFX[1]){
				QD.tables.get(table).add(queryFX[1])
				QD.columns.add(`${table}.${queryFX[1]}`)
			}else{
				QD.tables.set(table,new Set(this.#entities.get(table).columns))
				this.#entities.get(table).columns.forEach(x=>{
					QD.columns.add(`${table}.${x}`)
				})
			}

		}else{
			queryFX = queryFX.reduce((p,o)=>{
				if(p == null){
					return this.#queries[o] || this.#entities[o]
				}else{
					return p[o]||p
				}
			},null)
			if(typeof queryFX == "object"){
				var qd = this.queryBuild(queryFX,data)
				// console.log(queryFX,qd)
				qd.tables.forEach((value,key)=>{
					if(!QD.tables.has(key)){
						QD.tables.set(key,new Set)
					}
					QD.tables.get(key).add(value)
				})
				qd.columns.forEach(x=>{
					QD.columns.add(x)
				})
				qd.where.forEach((value,key)=>{
					QD.where.set(key,value)
				})
			}
			if(typeof queryFX == "string"){
				queryFX = `'${queryFX}'`
				QD = [...queryFX.matchAll(/\$\{.+\}/g)].reduce((all,x)=>{
					var y = x[0].slice(2,-1)
					var qd = this.queryBuild(y,data)
					var z = []
					qd.tables.forEach((value,key)=>{
						if(!all.tables.has(key)){
							all.tables.set(key,new Set)
						}
						all.tables.get(key).add(value)
						value.forEach(x=>{
							z.push(`${key}.${x}`)
						})
					})
					qd.where.forEach((value,key)=>{
						all.where.set(key,value)
					})
					queryFX = queryFX.replace(x[0],`',${z.join(',')},'`)
					return all
				},QD)
				queryFX.replaceAll("''","")
				// console.log(queryFX,QD)
				QD.columns = new Set(queryFX.split(','))
			}
		}
		if(typeof query =="object"){
			// console.log(query)
			if(query.columns){
				QD.columns.clear()
				if(typeof query.columns == "string")
					query.columns = [query.columns]
				query.columns.forEach(x=>{
					QD.columns.add(x)
				})
			}
			if(query.where){
				Object.keys(query.where).forEach(x=>{
					var attr = query.where[x].slice(1)
					QD.where.set(x,data[attr])
				})
			}
		}
		// console.log(QD)
		return QD
	}
	createClassFromEntity(name,entity){
		var table = {}
		Object.keys(entity).forEach(name=>{
			if(name.startsWith("__"))return
			var x = entity[name]
			if(typeof x == "object"){
				var {type,primary,notnull} = x
			}else{
				var type = x
			}
			var attribut = `${type} ${primary?"PRIMARY KEY ":""}${notnull?"NOT NULL ":""}`
			table[name] = attribut
		})
		var clazz = BaseDAO.fromClass(table,name+"s")
		// clazz.prototype.roles = entity.__roles
		clazz.roles = entity.__roles
		return clazz
	}
	insert(tableName,obj){
		var table = this.#tables.get(tableName)
		if(!table)return false
		console.log("step4 true")
		var entity = this.#entities.get(tableName)
		console.log("step5 true",entity,this.#entities.keys(),tableName)
		if(!entity)return false
		var args = [...entity.columns].map(x=>{return obj[x]||null})
		var inst = new entity(...args)
		table.push(inst)
		return true
	}
}

module.exports = {
	createQueryServer:(config)=>{
		return new QueryServer(config)
	}
}