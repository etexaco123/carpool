db = db.getSiblingDB("wacc");
db.createCollection('Employees');
db.Employees.insertMany([
	{
		employee_id:"1",
		first_name:"John",
		last_name:"Smith",
		address:"Groningen",
		job_title:"Software Engineer",
		email:"john.smith@gmail.com",
		age:25,
		driver_license:true
	},
	{
		employee_id:"2",
		first_name:"John2",
		last_name:"Smith2",
		address:"Groningen",
		job_title:"Software Engineer",
		email:"john.smith2@gmail.com",
		age:25,
		driver_license:true
	},
	{
		employee_id:"3",
		first_name:"John3",
		last_name:"Smith3",
		address:"Groningen",
		job_title:"Software Engineer",
		email:"john.smith3@gmail.com",
		age:25,
		driver_license:false
	},
	{
		employee_id:"4",
		first_name:"John4",
		last_name:"Smith4",
		address:"Groningen",
		job_title:"Software Engineer",
		email:"john.smith4@gmail.com",
		age:25,
		driver_license:false
	},
	{
		employee_id:"5",
		first_name:"John5",
		last_name:"Smith5",
		address:"Groningen",
		job_title:"Software Engineer",
		email:"john.smith5@gmail.com",
		age:25,
		driver_license:false
	}
]);