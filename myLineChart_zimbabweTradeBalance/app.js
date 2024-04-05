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
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  ///////////////////////////////
  // define the time parse function -> this tells d3 the format of the year in the .csv file
  const parseDate = d3.timeParse("%b %Y");

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
    .range([0, width])
    // .nice();

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, y2Accessor)])
    .range([height, 0])
    .nice();

  ///////////////////////////////
  // draw the x-axis
  const xAxis = d3.axisBottom(xScale)

  chart.append("g")
    .call(xAxis.tickSizeOuter(0).tickPadding(8))
    .attr("transform", `translate(0, ${height})`)

  // draw the y-axis
  const yAxis = d3.axisLeft(yScale)

  chart.append("g")
    .call(yAxis)


  ///////////////////////////////
  // define the line generator functions 
  const exportsLineGenerator = d3.line()
    .x( d => xScale(xAccessor(d)))
    .y( d => yScale(y1Accessor(d)))
    // .curve(d3.curveBasis);

  const importsLineGenerator = d3.line()
    .x( d => xScale(xAccessor(d)))
    .y( d => yScale(y2Accessor(d)))
    // .curve(d3.curveBasis);

  /////////////////////////////// 
  //  draw the exports line on the page
  chart.append("path")
    .datum(data)
    .attr("d", exportsLineGenerator)
    .attr("fill", "none")
    .attr("stroke", "crimson")
    .attr("stroke-width", 2)

  //  draw the imports line on the page
  chart.append("path")
    .datum(data)
    .attr("d", importsLineGenerator)
    .attr("fill", "none")
    .attr("stroke", "darkcyan")
    .attr("stroke-width", 2);
    
}

draw()