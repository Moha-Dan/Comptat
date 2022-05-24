const Database = require('better-sqlite3')

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
			obj = table
			table = table.name
		}
		console.log(table)
		var columns = Object.keys(obj).map(x=>`${x} = ?`)
		var sql = `CREATE TABLE ${table} (_index INTEGER${(columns.length?","+columns.join(","):"")})`
		console.log(sql)
		var stmt = this.#sql.prepare(sql);
		stmt.run()
	}
	insert(table,...objs){
		var keys = Object.keys(objs[0]).map(x=>`@${x}`)
		const insert = this.#sql.prepare(`INSERT INTO ${table} VALUES (${keys.join(",")})`);
		this.#sql.transaction((objs) => {
			for (const obj of objs) insert.run(obj);
		});
	}
	select(table,obj,contraints = {}){
		var {columns,limit,order,filter,distinct,offset,where,group} = contraints;
		columns ??= "*"
		where ??= ""
		where = Object.keys(obj).map(x=>`${x} = ?`) + where
		const stmt = this.#sql.prepare(`SELECT ${distinct?"DISTINCT":""} ${columns} FROM ${table} WHERE ${where} ${order?"ORDER BY"+order:""} ${limit?"LIMIT "+limit+(offset?"OFFSET"+offset:""):""} ${group?"GROUP BY "+group:""} ${filter?"HAVING "+filter:""}`);
		if(!limit || limit > 1){
			return stmt.all(Object.values(obj));
		}else{
			return stmt.get(Object.values(obj));
		}
	}
	update(table,obj){
		var updated = Object.keys(obj).map(x=>`${x} = ?`)
		const update = this.#sql.prepare(`UPDATE ${table} SET ${updated} WHERE _index = ${obj._index}`);
	}
}

module.exports = SQLManager