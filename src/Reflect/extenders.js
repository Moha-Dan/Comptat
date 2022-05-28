class SuperParent{
	static extend(){
		
	}
}
module.exports = function extender(...super_parent_classes){
	var sp = new SuperParent()
	super_parent_classes.reduce((p,o)=>{
		return SuperParent.extend(p,o)
	},sp)
	return 
}