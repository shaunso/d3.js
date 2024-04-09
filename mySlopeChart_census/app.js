async function draw() {
  // parse the .csv file with the data to draw the graph
  const data = await d3.csv("data.csv");

  const electricity = [[2012, data[0][2012]], [2022, data[0][2022]]];
  const lpg = [[2012, data[1][2012]], [2022, data[1][2022]]];
  const water = [[2012, data[2][2012]], [2022, data[2][2022]]];
  const toilets = [[2012, data[3][2012]], [2022, data[3][2022]]];

  // define the margins and dimensions of the chart area
  const margin = {top: 24, right: 60, bottom: 60, left: 172};
  const width = 950 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#slope-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;");

  // define the chart area to house the drawings
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);  

  // define the accessor functions
  const xAccessor = d => d[0]
  const yAccessor = d => d[1]

  
// define the line generator
const lineGenerator = d3.line()
.x(d => xScale(xAccessor(d)))
.y(d => yScale(yAccessor(d)))

  // define the scales for the axes
  // x-axis
  const xScale = d3.scalePoint()
    .domain([2012,2022])
    .range([0,width])
    .padding(0.05);
  // y-axis
  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  // draw the axes
  // x-axis
  const xAxis = d3.axisBottom(xScale) 
    .tickPadding([20])
    .tickSize([11])
    .tickSizeOuter(0);
    

  const xAxisGroup = chart.append("g")
    .call(xAxis)
  xAxisGroup.attr("transform",`translate(0,${height})`);
    
  // y-axis
  const yAxis = d3.axisRight(yScale) 
    .tickPadding([10])
    .tickFormat(d3.format(".0%"))
    .tickSize(0)
    .ticks(5);    

  const yAxisGroup = chart.append("g")
    .call(yAxis)
  yAxisGroup.attr("transform",`translate(${width},0)`);

  yAxisGroup.select(".domain").remove();

  // draw the path and circles
  // electricity
  chart.append("g")
    .append("path")
    .datum(electricity)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "#589BE5")
    .attr("stroke-width", 2);


  // lpg
  chart.append("g")
    .append("path")
    .datum(lpg)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "#589BE5")
    .attr("stroke-width", 2);


  // water
  chart.append("path")
    .datum(water)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "#589BE5")
    .attr("stroke-width", 2);


  // toilets
  chart.append("path")
    .datum(toilets)
    .attr("d", lineGenerator)
    .attr("fill", "none")
    .attr("stroke", "#589BE5")
    .attr("stroke-width", 2);

}

draw()