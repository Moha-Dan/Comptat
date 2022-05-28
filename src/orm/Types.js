const Annotation = require("../Reflect/Annotation")

const NULL = Symbol.for("NULL")
const INTEGER = Symbol.for("INTEGER")
const SHORT = Symbol.for("SHORT")
const LONG = Symbol.for("LONG")
const FLOAT = Symbol.for("FLOAT")
const STRING = Symbol.for("STRING")
const RAW = Symbol.for("RAW")
const BOOLEAN = Symbol.for("BOOLEAN")

const int = Annotation("int")
const float = Annotation("float")
const string = Annotation("string")
const raw = Annotation("raw")
const boolean = Annotation("boolean")
const date = Annotation("date")

module.exports = {
	int,float,string,raw,boolean,date,

	INTEGER,FLOAT,STRING,SHORT,LONG,RAW,BOOLEAN
}