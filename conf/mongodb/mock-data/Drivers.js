db = db.getSiblingDB("wacc");
db.createCollection('Drivers');
db.Drivers.insertMany([
	{
		employee_id:"1",
		first_name:"John",
		last_name:"Smith",
		car_make: "BMW",
		car_image_id: "image1"
	},
	{
		employee_id:"2",
		first_name:"John2",
		last_name:"Smith2",
		car_make: "BMW",
		car_image_id: "image2"
	}
]);