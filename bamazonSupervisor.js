var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

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
      name: "action",
      type: "list",
      message: "Menu Options:",
      choices: ["View Product Sales by Department", "Create New Department"]
    }
    ])
    .then(function(answer) {
      if(answer.action == 'View Product Sales by Department'){
        view();
      }else{
        create();
      }

    });
  
}

function view(){
  console.log('');

  connection.query("SELECT * FROM products", function(err, res) {
    var totalsArr = [];
    var currentDepartment;
    var total4Department = 0;

    for (var i = 0; i < res.length; i++) {
      var department = res[i].departmentName;
      // currentDepartment =res.departmentName[i];
      // console.log(department);
      if(currentDepartment != department){
        currentDepartment = department;
        if(i != 0){
          totalsArr.push(total4Department);
        }
        total4Department = 0;
        total4Department = total4Department + parseFloat(res[i].sales);
        if(i+1 == res.length){
          totalsArr.push(total4Department);
        }
      }else if(currentDepartment == department){
        total4Department = total4Department + parseFloat(res[i].sales);
      }
      

    }
    // console.log(totalsArr);
    setTable(totalsArr);
  });

  function setTable(totalsArr){
    console.log(totalsArr);
    connection.query("SELECT * FROM departments", function(err, res) {
      console.log('');
      var table = new Table({
        head: ['Id', 'Department', 'Overhead', 'Total Sales', 'Profit']
      });
      for (var i = 0; i < res.length; i++) {
        var arr = [];
        var total = parseFloat(totalsArr[i]);
        console.log(total);
        if(!total){
          total = 0; 
          console.log(total);
        }
        var totalSales = total - parseInt(res[i].over_head);
        arr.push(res[i].departmentid, res[i].departmentName, res[i].over_head, total, totalSales);
        table.push(arr);
      }
      console.log('');
      console.log(table.toString());
    });
  }
}

function create(){
  console.log('');
  // console.log('');
   inquirer
    .prompt([
    {
      type: "input",
      name: "department",
      message: "What is the name of the department?", 
    },
    {
      type: "input",
      name: "overhead",
      message: "What is the overhead?", 
    }
    ])
    .then(function(answer) {

      var department = answer.department;
      var overhead = parseInt(answer.overhead);
      // console.log(name, department, price, quantity);
      var query = "INSERT INTO departments SET ?";
      connection.query(query, {over_head: overhead, departmentName: department}, function(err, res) {
        console.log('');
        console.log('Success! You added ' + department + ' to the table');
        // start();
      });
    });
}