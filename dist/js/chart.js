var data = [
  {day: "Monday", water: 0},
  {day: "Tuesday", water: 0},
  {day: "Wednesday", water: 0},
  {day: "Thursday", water: 0},
  {day: "Friday", water: 0},
  {day: "Saturday", water: 0},
  {day: "Sunday", water: 0},
];

// Mike Bostock "margin conventions"
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

y.domain([0, 250]);

// D3 Axis - renders a d3 scale in SVG
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "L");

var color = d3.scale.linear().domain([1,200])
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb("#40de6d"), d3.rgb('#de3b3e')]);

// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("class", "container")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")

svg.append("g")
    .attr("class", "y axis")
  .append("text") // just for the title (ticks are automatic)
    .attr("transform", "rotate(-90)") // rotate the text!
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Water [L]");

svg.append("rect")
  .attr("class", "max-line")
  .attr("y", y(160))
  .attr("height", 5)
  .attr("width", 900)
  .style("fill", "#de3b3e");

var barGroup = svg.append("g");

svg.append("rect")
    .attr("class", "average")
    .attr("y", y(0))
    .attr("height", 5)
    .attr("width", 900)
    .style('fill', color(0));

replay(data);

// d3.tsv is a wrapper around XMLHTTPRequest, returns array of arrays (?) for a TSV file
// type function transforms strings to numbers, dates, etc.

function type(d) {
  // + coerces to a Number from a String (or anything)
  d.water = +d.water;
  return d;
}

function replay(data) {
  var slices = [];
  for (var i = 0; i < data.length; i++) {
    slices.push(data.slice(0, i+1));
  }
  slices.forEach(function(slice, index){
    setTimeout(function(){
      draw(slice);
    }, index * 10);
  });
}

function draw(data) {
  // measure the domain (for x, unique letters) (for y [0,maxFrequency])
  // now the scales are finished and usable
  x.domain(data.map(function(d) { return d.day; }));
  //y.domain([0, d3.max(data, function(d) { return d.water; })]);
  //y.domain([0, 250]);

  // another g element, this time to move the origin to the bottom of the svg element
  // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
  //   for everything in the selection\
  // the end result is g populated with text and lines!
  svg.select('.x.axis').transition().duration(300).call(xAxis);

  // same for yAxis but with more transform and a title
  svg.select(".y.axis").transition().duration(300).call(yAxis)

  // THIS IS THE ACTUAL WORK!
  var bars = barGroup.selectAll(".bar").data(data, function(d) { return d.day; }) // (data) is an array/iterable thing, second argument is an ID generator function

  // Calculate average
  var averageNumber = 0;
  for(var i = 0; i <= user.currentDay; i++) {
    averageNumber += data[i].water;
  }
  averageNumber /= user.currentDay + 1;
  console.log(averageNumber);

  var average = svg.select(".average");

  bars.exit()
    .transition()
      .duration(300)
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();

  // data that needs DOM = enter() (a set/selection, not an event!)
  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("y", y(0))
    .attr("height", height - y(0))
    // .style('fill', function (d) {
    //   return color(d.water);
    // })
    ;

  // the "UPDATE" set:
  bars.transition().duration(300).attr("x", function(d) { return x(d.day); }) // (d) is one item from the data array, x is the scale object from above
    .attr("width", x.rangeBand()) // constant, so no callback function(d) here
    .attr("y", function(d) { return y(d.water); })
    .attr("height", function(d) { return height - y(d.water); }) // flip the height, because y's domain is bottom up, but SVG renders top down
    // .style('fill', function (d) {
    //   return color(d.water);
    // })
    ;

  average.transition().duration(300)
    .attr("y", y(averageNumber))
    .style('fill', color(averageNumber));
}

function WaterUser() {
  this.basicConsumption = [
    0,  // 00:00 Sleep
    0,  // 01:00 Sleep
    0,  // 02:00 Sleep
    0,  // 03:00 Sleep
    0,  // 04:00 Sleep
    0,  // 05:00 Sleep
    60, // 06:00 Shower
    10, // 07:00 Breakfast
    0,  // 08:00 ?
    3,  // 09:00 Coffee
    0,  // 10:00 ?
    1,  // 11:00 Glass of water
    40, // 12:00 Lunch
    30, // 13:00 Dishes
    0,  // 14:00 ?
    10, // 15:00 Coffee/fika
    0,  // 16:00 ?
    0,  // 17:00 ?
    40, // 18:00 Dinner
    40, // 19:00 Dishes
    0,  // 20:00 ?
    0,  // 21:00 ?
    10, // 22:00 Bedtime
    0   // 23:00 Sleep
  ];

  this.lastAmount = 0;
  this.currentHour = 0;
  this.currentDay = 0;
  this.currentWeek = 0;
  this.totalConsumption = 0;

  this.maxConsumption = 160;

  this.getLastHour = function() {
    var correction = Math.random() * 1.5 - 1;
    let bc = this.basicConsumption[this.currentHour];
    var amount = bc + bc * correction;
    this.totalConsumption += amount;
    this.currentHour++;
    if(this.currentHour >= 24) {
      this.totalConsumption = 0;
      this.currentHour = 0;
      this.currentDay++;
    }
    if(this.currentDay >= 7) {
      this.currentDay = 0;
      this.currentWeek++;
    }
    return amount;
  }
}
var user = new WaterUser();
function update(data) {
  user.getLastHour();
  data[user.currentDay].water = user.totalConsumption;
  if(user.currentDay === 0) {
    for(var i = 1; i < data.length; i++) {
      data[i].water = 0;
    }
  }
  draw(data);
}

window.setInterval(function() {
  update(data);
}, 300);
