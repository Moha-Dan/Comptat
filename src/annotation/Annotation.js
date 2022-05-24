class A extends Symbol{
	constructor(value,name,attrs){
		super(`${value}@${name}(${attrs})`)
	}
	get name(){
		return value.split('@')[0]
	}
	[Symbol.toStringTag](){
		return "Annotation"
	}
}

function Annotation(name,attrs){
	return (value,...attrs)=>{
		return new A(value,name,attrs)
	}
}

module.exports = Annotation