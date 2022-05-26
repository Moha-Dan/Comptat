const {execSync} = require("child_process");
class Driver{
	connect(){

	}
	exec(cmd){
		var out = execSync(cmd)
		return out.toString()
	}
	#current = []
	prepare(sql){
		this.#current.push(sql)
	}
	run(){
		var sql = this.#current.join(';')
		if(!(this instanceof Driver)){
			this.exec(sql)
		}else{
			return sql
		}
	}
	transaction(callback){
		return ((data)=>{
			this.#current = []
			callback(data)
			return this.run()
		})
	}
	close(){

	}
}
module.exports = Driver