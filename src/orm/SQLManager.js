const Database = require('./drivers/sqlite');
const BaseDAO = require('./BaseDAO');

class SQLManager extends EventTarget{
	#sql
	constructor(file){
		super()
		this.#sql = new Database(file)
		// this.#sql.serialize(function() {
		// 	var e = new Event("connect")
		// 	this.dispatch(e)
		// })
		process.on('exit', () => this.#sql.close());
		process.on('SIGHUP', () => process.exit(128 + 1));
		process.on('SIGINT', () => process.exit(128 + 2));
		process.on('SIGTERM', () => process.exit(128 + 15));
	}
	create(table,obj){
		if(!obj){
			obj = [...table.columns]
			table = table.name
		}else{
			obj = Object.keys(obj)
		}
		console.log(table,obj)
		var columns = obj.map(x=>`${x}`)
		var sql = `CREATE TABLE ${table} (_index INTEGER${(columns.length?","+columns.join(","):"")})`
		this.#sql.exec(sql);
	}
	insert(table,...objs){
		var columns
		if(typeof table != "string"){
			columns = [...table.columns]
			table = table.name
		}else{
			columns = Object.keys(objs[0])
		}
		console.log(table,columns)
		var stmt = this.#sql.transaction((objs) => {
			for (const obj of objs){
				var keys = columns.map(x=>`'${obj[x]}'`)
				var sql = `INSERT INTO ${table} VALUES (0,${keys.join(",")})`
				this.#sql.prepare(sql);
			}
		})(objs);
		console.log(stmt)
		if(stmt){
			this.#sql.exec(stmt)
		}
	}
	select(table,obj  = {},contraints = {}){
		if(typeof table != "string"){
			table = table.name
		}
		var {columns,limit,order,filter,distinct,offset,where,group} = contraints;
		columns ??= "*"
		where ??= ""
		var wherefromO = Object.keys(obj).map((x,n)=>`${x} = '${obj[x]}'`)//${n!=0?"AND":""}
		where = wherefromO.join(' AND ') + (where.length>3?" AND "+where:"")
		console.log(table,wherefromO,Object.keys(obj),where)
		const stmt = this.#sql.exec(`SELECT ${distinct?"DISTINCT":""} ${columns} FROM ${table}${where.length > 4?' WHERE '+where:""}${order?" ORDER BY"+order:""} ${limit?" LIMIT "+limit+(offset?" OFFSET"+offset:""):""} ${group?" GROUP BY "+group:""} ${filter?" HAVING "+filter:""}`);
		console.log(stmt)
		// if(!limit || limit > 1){
		// 	return stmt.all(Object.values(obj));
		// }else{
		// 	return stmt.get(Object.values(obj));
		// }
	}
	update(table,obj){
		if(table instanceof BaseDAO)table = table.name
		var updated = Object.keys(obj).map(x=>`${x} = ?`)
		const update = this.#sql.prepare(`UPDATE ${table} SET ${updated} WHERE _index = ${obj._index}`);
	}
}

module.exports = SQLManager