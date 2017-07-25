// set the dimensions
var margin = {top: 20, right: 20, bottom: 100, left: 100},
width = 1270- margin.left - margin.right,
height = 450 - margin.top - margin.bottom;

// set the ranges
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

// define the axis
var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");
var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(5)
.tickFormat(d3.format("s"));

function educationCategoryWiseData(){
  // load the data
  d3.json("./JSONData/educationCategoryData.json", function(error, data) {

    document.getElementById("heading").innerHTML = "<h2>Education Category wise - all India data combined together</h2>";
    document.getElementById("Chart").innerHTML = "";
    // add the SVG element
    var svg = d3.select("#Chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

    // Tooltip for Bars
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<div><span>" + d.educationLevel + "</span></div><strong>Total:</strong> <span>" + d.totalNumber + "</span>";
    })
    svg.call(tip);
    x.domain(data.map(function(d) { return d.educationLevel; }));
    y.domain([0, d3.max(data, function(d) { return d.totalNumber; })]);

    // add axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("dx", "-.5em")
    // .attr("dy", "-.35em")
    // .attr("transform", "rotate(-90)" )
    .call(wrap, x.rangeBand());

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Total Number");

    // Add bar chart
    svg.selectAll("bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.educationLevel); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.totalNumber); })
    .attr("height", function(d) { return height - y(d.totalNumber); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
  });
}

// Method to wrap Label text


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
    words = text.text().split(/\s+/).reverse(),
    word,
    line = [],
    lineNumber = 0,
    lineHeight = 1.1, // ems
    y = text.attr("y"),
    dy = parseFloat(text.attr("dy")),
    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
