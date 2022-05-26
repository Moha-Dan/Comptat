const Driver = require("./driver");
var isWin = process.platform === "win32";
const sqlite = isWin?__dirname.split('\\').slice(0,-3).join('\\')+`\\libs\\sqlite3.exe`:"sqlite3"

class Database extends Driver{
	#database
	constructor(file){
		super()
		this.#database = file
	}
	exec(sql){
		var cmd = `${sqlite} ${this.#database} "${sql}" -csv`
		console.log(sql)
		return super.exec(cmd)
	}
}
module.exports = Database