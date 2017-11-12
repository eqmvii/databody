// test the linnear regression math
const regression = require('regression');

var result = regression.linear([[0, 1], [32, 67], [12, 79]]);
const gradient = result.equation[0];
const yIntercept = result.equation[1];


console.log(result);

//slope
console.log(result.equation[0]);
console.log(gradient);

//constant
console.log(result.equation[1]);


var test_data = [
    [144, 0.47],
    [142.6, 0.51],
    [144, 0.64],
    [144, 0.70],
    [144, 0.83],
    [142.8, 1.33],
    [143.0, 1.33],
    [142.8, 1.41],
    [144.8, 1.83],
    [142.6, 2.29],
    [140.8, 2.53],
    [140.6, 2.55],
    [144.0, 2.81],
    [141.4, 3.33],
    [142.6, 3.46],
    [141.4, 3.52],
    [143.6, 3.84],
    [142.8, 4.38],
    [141.6, 4.48],
    [141.6, 4.62],
    [141.2, 4.64],
    [144.4, 4.86],
    [141.8, 5.31],    
    [140.6, 5.46],
    [139.6, 5.61],
    [139.4, 5.70],
    [143.0, 6.05],
    [141.4, 6.36],
    [140.6, 6.69],
    [141.8, 7.51],
    [141.2, 7.33]   
]

// reverse data pairs because I am dumb
for (let i = 0; i < test_data.length; i++){
    let holder = test_data[i][0];
    test_data[i][0] = test_data[i][1];
    test_data[i][1] = holder;   
}

result = regression.linear(test_data, {precision: 6});

console.log(result);

//slope
console.log(result.equation[0]);

//constant
console.log(result.equation[1]);



var data_summary = {
    username: "Test",
    userid: -1,
    height: 69,
    age: 30,
    activity: -1,
    weights: [],
    progress: -1,
    daily_kcal_needs: -1,
    daily_kcal_burn: -1,
    kcal_delta: -1,
    cur_weight: 140,
    weight_delta: -1,
    error: false,
    error_message: '',
    status_message: 'Insufficient weight data. Keep adding more!',
    alert_class: 'alert alert-warning'
}



// calculate Harris Benedict Equation - BMR * activity factor
// pounds to kg

var kg = data_summary.cur_weight * 0.45359237;
console.log(kg);
// inches to cm
var cm = data_summary.height * 2.54;
console.log(cm);

// averaged Men/Women formula from Mifflin/St Jeor 1990 paper
data_summary.daily_kcal_needs = (10 * kg) + (6.25 * cm) + (5 * data_summary.age) - 75;

// get user's weight history 

// If less than 30 data points, return

// If more than 30 data points, 

// Run calculations on the resulting data:
// y = mx + B

// current weight

console.log(new Date() - new Date())























console.log(data_summary);