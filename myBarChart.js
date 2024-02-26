// defining an object for the margin for the chart area
const margin = {top: 75, right: 50, bottom: 25, left: 50};

// defining the variables for the dimensions for the svg area
const svgWidth = 1050,
      svgLength = 750;

// defining the variable for the width of each bar 
const barWidth = 80;

// defining and storing dataset in a variable
const dataSet = [5, 12, 19, 3, 9, 23, 5, 15, 11];

// defining the domain and range of the chart
const scale = d3.scaleLinear()
  .domain([3, 23])
  .range([0, 500]);

  console.log(scale(5));

// creating the svg area on the page
const svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgLength)
  .attr("class", "svgCanvas");

// binding and adding the data to the svg
svg.selectAll("rect")
  .data(dataSet)
  .enter()
  .append("rect")
  .attr("x", rectXpos)
  .attr("y", (d) => 750 - 30 * d)
  .attr("width", barWidth)
  .attr("height", barHeight)
  .attr("fill", barColor)
  .attr("class", "bar");

// draw and label x-axis
const xScale = d3.scaleLinear()
  .domain(d3.extent(dataSet, (d, i) => i))
  .range([0,1000]);

svg.append("g")
  .call(d3.axisBottom(xScale))
  .attr("transform", "translate(70, 650)");
 
svg.append("text")
  .text("Quarter")
  .attr("transform", `translate(${500},${710})`)

  // function to calculate the height of each data point on the graph
  function barHeight(d) {
    return d * 30;
  }

  //  function to place each data point along the x-axis
  function rectXpos(d, i) {
    return i * 100 + 20;
  }

  function barColor(d) {
    if (d >= 10) {
      return "red";
    } return "green";
  }