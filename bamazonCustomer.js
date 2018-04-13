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
  var run = 0;
  // console.log('called');
  // var query = "SELECT * FROM products";
  connection.query("SELECT * FROM products", function(err, res) {
    console.log('');
    for (var i = 0; i < res.length; i++) {
      console.log("Id: " + res[i].id + " || Product Name: " + res[i].productName + " || Department Name: " + res[i].departmentName + " || Price: " + res[i].price + " || Quantity: " + res[i].quantity);
      run += 1;
    }

    if(run == 10){
      console.log('');
      ask();
    }
  });

  // ask();
  
}


function ask() {
  inquirer
    .prompt([
    {
      name: "id",
      type: "input",
      message: "What is the id of the product you'd like to buy?"
    },
    {
      name: "amount",
      type: "input",
      message: "How many would you like to buy?"
    }
    ])
    .then(function(answer) {
      // console.log(answer.id, answer.amount)
      search(answer.id, answer.amount);

    });

}

function search(id, amount){
  var query = "SELECT * FROM products WHERE ?";
  connection.query(query, {id : id}, function(err, res) {
    if (err) throw err;
    var price = res[0].price;
    var inDatabse = res[0].quantity;
    var totalSales = res[0].sales;
    var payment = 0;
    var updateWith = 0;
    var updateSales = 0;
    console.log('totalSales: ' + totalSales);
    if(inDatabse < amount){
      console.log('Insuficient quantity!')
    }else{
      payment = price * amount;
      
      updateWith = inDatabse - amount;

      updateSales = payment + totalSales;
      // console.log('updateSales: ' + updateSales);
      update(id, updateWith, payment, updateSales);
    }

  });
}

function update(id, updateWith, payment, updateSales){
  // console.log(id, updateWith);
  console.log('updateSales: ' + updateSales);
  var query = "UPDATE products SET ?  WHERE ?";
  connection.query(query, [{quantity: updateWith, sales: updateSales}, {id : id}], function(err, res) {
    console.log('');
    console.log('Your order was sucessfull! You owe $' + payment + '.');
    console.log('');
    start();
  });
}