var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Hawkeye321",
  database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  console.log('');
	 inquirer
    .prompt([
    {
      type: "list",
      name: "action",
      message: "Menu options:",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
    ])
    .then(function(answer) {
     
      console.log(answer.action);
      if(answer.action == "View Products for Sale"){
      	view();
      }else if(answer.action == "View Low Inventory"){
      	low();
      }else if(answer.action == "Add to Inventory"){
      	add();
      }else if(answer.action == "Add New Product"){
      	addProduct();
      }

    });
}

function view(){
	console.log('');
	connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Id: " + res[i].id + " || Product Name: " + res[i].productName + " || Department Name: " + res[i].departmentName + " || Price: " + res[i].price + " || Quantity: " + res[i].quantity);
     
    }

  	console.log('');
    // start();
    
  });
}

function low(){
	console.log('');
	var query = "SELECT * FROM products WHERE quantity < '5'";
	connection.query(query, function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Id: " + res[i].id + " || Product Name: " + res[i].productName + " || Department Name: " + res[i].departmentName + " || Price: " + res[i].price + " || Quantity: " + res[i].quantity);
     
    }

    if(res.length == 0){
      console.log('No low inventory at this time.')
    }
  	console.log('');
    // start();
    
  });
}

function add(){
	console.log('');
	 inquirer
    .prompt([
    {
      type: "input",
      name: "id",
      message: "What is the id of item you want to update?", 
    },
    {
      type: "input",
      name: "quantity",
      message: "How much would you like to add?", 
    }
    ])
    .then(function(answer) {
    	var id = answer.id;
    	var addQuantity = answer.quantity;

    	var query = "SELECT productName, quantity FROM products WHERE ?";
  		connection.query(query, {id : id}, function(err, res) {
    		if (err) throw err;
    		// console.log(res);
    		var item = res[0].productName;
    		var current  = res[0].quantity;
    		var updateWith = parseInt(current) + parseInt(addQuantity);
    		update(updateWith, item);
 		 });

  		function update(updateWith, item) {
  			var query = "UPDATE products SET ?  WHERE ?";
  			connection.query(query,[{quantity: updateWith}, {id : id}], function(err, res) {
    			if (err) throw err;
    			console.log('');
    			console.log('Success! You added ' + addQuantity + ' more ' + item + 's.')
    			// displayUpdate();
 			});
  		}
    });
}

function addProduct(){
	console.log('');
	// console.log('');
	 inquirer
    .prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the product?", 
    },
    {
      type: "input",
      name: "department",
      message: "What department does it belong too?", 
    },
    {
      type: "input",
      name: "price",
      message: "What is the price of the product?", 
    },
    {
      type: "input",
      name: "quantity",
      message: "What is the quantity of the product?", 
    }
    ])
    .then(function(answer) {

    	var name = answer.name;
    	var department = answer.department;
    	var price = parseFloat(answer.price);
    	var quantity = parseInt(answer.quantity);
    	console.log('');
    	var query = "INSERT INTO products SET ?";
  		connection.query(query, {productName: name, departmentName: department, price: price, quantity: quantity}, function(err, res) {
    		console.log('Sucess you added ' + name + ' to the product table.');
    		// start();
  		});
    });
}