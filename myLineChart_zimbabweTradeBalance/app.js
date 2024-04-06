async function draw() {
  // parse the .csv file with the data to draw the lines for the chart
  const data = await d3.csv("data.csv");
  
  // define the dimensions and margins of the svg and chart area
  const margin = {top: 60, right: 30, bottom: 30, left: 90};
  const width = 850 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  ///////////////////////////////
  // create and append the svg element to the body of the html page by selecting the div with id = line-chart
  // set the dimensions of the svg
  // the svg is also made responsive by adding the viewBox attribute
  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;");

  ///////////////////////////////
  // append a group to the svg element to draw the graph
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left-20}, ${margin.top-20})`)

  ///////////////////////////////
  // define the time parse function -> this tells d3 the format of the year in the .csv file
  const parseDate = d3.timeParse("%b %y");

  // define the x-accessor function
  const xAccessor = d => parseDate(d.year);

  // define the y-accessor function for exports
  const y1Accessor = d => +d.exports;

  // define the y-accessor function for exports
  const y2Accessor = d => +d.imports;

  ///////////////////////////////
  // define the x-scale
  const xScale = d3.scaleUtc()
    .domain(d3.extent(data, xAccessor))
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 1400000000])
    .range([height, 0])
    .nice();

  ///////////////////////////////
  // draw the x-axis
  const xAxis = d3.axisBottom(xScale).ticks(15)

  chart.append("g")
    .call(xAxis.tickSize(5).tickPadding(12).tickSizeOuter(5))
    .attr("transform", `translate(0, ${height})`)

  // draw the y-axis
  const yAxis = d3.axisLeft(yScale).tickFormat(d => d3.format("$,.2s")(d).replace("G","B"))

  chart.append("g")
    .call(yAxis.ticks(5).tickSizeOuter(0).tickPadding(8).tickSize(0))
    .call(d => d.select(".domain").remove());


  ///////////////////////////////
  // define the line generator functions 
  const exportsLineGenerator = d3.line()
    .x( d => xScale(xAccessor(d)))
    .y( d => yScale(y1Accessor(d)))
    .curve(d3.curveCardinal.tension(0.7));

  const importsLineGenerator = d3.line()
    .x( d => xScale(xAccessor(d)))
    .y( d => yScale(y2Accessor(d)))
    .curve(d3.curveCardinal.tension(0.7));


  ////////////////////////////////////////////////// 
  // adding grid-line to the y-axis
  const horizontalGridLine = d3.axisRight(yScale);

  chart.append("g")
  .classed("grid-lines", true)
  .call(horizontalGridLine.tickSize(width).tickFormat("").ticks(5))
  .call(d => d.select(".domain").remove());


  //////////////////////////////////////////////////
  // define the area generator used to add a fill between the two lines
  // 
  const areaGenerator = d3.area() 
    .x( d => xScale(xAccessor(d)))
    .y0( d => yScale(y1Accessor(d)))
    .y1( d => yScale(y2Accessor(d)))
    .curve(d3.curveCardinal.tension(0.7));

  // draw the area graph with no stroke
  chart.append("path")
    .datum(data)
    .attr("d", areaGenerator)
    .attr("fill", "lightgrey")
    .attr("stroke", "none")
    .attr("stroke-width", 0)


  ////////////////////////////////////////////////////
  // drawing the lines for the line graph after the area grapgh so that the lines are on top of the area
  /////////////////////////////// 
  //  draw the exports line on the page
  chart.append("path")
    .datum(data)
    .attr("d", exportsLineGenerator)
    .attr("fill", "none")
    .attr("stroke", "crimson")
    .attr("stroke-width", 1.5)

  //  draw the imports line on the page
  chart.append("path")
    .datum(data)
    .attr("d", importsLineGenerator)
    .attr("fill", "none")
    .attr("stroke", "darkcyan")
    .attr("stroke-width", 1.5);

  // adding a label to the y-axis
  chart.append("text")
    .text("USD")
    .classed("axis-label", true)
    .attr("transform", `translate(${-37}, ${-20})`)

}

draw()