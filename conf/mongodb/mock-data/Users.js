db = db.getSiblingDB("wacc");
db.createCollection('Users');
db.Users.insertMany([
	{
		employee_id:"1",
		password:"password1",
		role:"Normal"
	},
	{
		employee_id:"2",
		password:"password2",
		role:"Normal"
	},
	{
		employee_id:"3",
		password:"password3",
		role:"Normal"
	},
	{
		employee_id:"4",
		password:"password4",
		role:"Normal"
	},
	{
		employee_id:"5",
		password:"password5",
		role:"Normal"
	},
	{
		employee_id:"admin",
		password:"admin",
		role:"Admin"
	}
]);