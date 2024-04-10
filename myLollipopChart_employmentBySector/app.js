async function draw() {
  // parse the data from the .csv file
  const data = await d3.csv("data.csv");

  // define dimensions and margins
  const margin = {top:40, right: 100, bottom: 60, left: 100};

  const height = 600 - margin.top - margin.bottom;
  const width = 950 - margin.left - margin.right;

  // define the svg area and append it to the body of the page
  const svg = d3.select("#lollipop-chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right+150)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;");


  // define the chart area
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left + 150},${margin.top})`);

  // Add X axis
  const xScale = d3.scaleLinear()
    .domain([0,400000])
    .range([ 0, width])
    .nice();

  const xAxis = d3.axisBottom(xScale) 
    .tickPadding(12)
    .tickSize(0)
    .tickFormat(d => d / 1000);
 
  const xAxisGroup = chart.append("g")
    .call(xAxis);
    
  xAxisGroup.attr("transform",`translate(0,${height})`);

  // Y axis
  const yScale = d3.scaleBand()
    .range([ 0, height])
    .domain(data.map(d => d.industry))
    .padding(1);

  const yAxis = d3.axisLeft(yScale) 
    .tickPadding(10)
    .tickSize(6);   

  const yAxisGroup = chart.append("g")
    .call(yAxis);
    
  yAxisGroup.select(".domain").remove();

  // adding grid lines
  const gridLines = d3.axisTop(xScale);

  chart.append("g")
  .classed("grid-lines", true)
  .call(gridLines.tickSize(height-10).tickFormat(""))
  .call(d => d.select(".domain").remove())
  .attr("transform",`translate(0,${height})`);


  // Lines
  chart.selectAll("lines")
    .data(data)
    .join("line")
      .attr("x1", d => xScale(d.men))
      .attr("x2", d => xScale(d.women))
      .attr("y1", d => yScale(d.industry))
      .attr("y2", d => yScale(d.industry))
      .attr("stroke", "#E7E8D1")
      .attr("stroke-width", "2px");

  // Circles of men
  chart.selectAll("circles")
  .data(data)
  .join("circle")
    .attr("cx", d => xScale(d.men))
    .attr("cy", d => yScale(d.industry))
    .attr("r", "6")
    .style("fill", "#F93822FF");

  // Circles of women
  chart.selectAll("circles")
  .data(data)
  .join("circle")
    .attr("cx", d => xScale(d.women))
    .attr("cy", d => yScale(d.industry))
    .attr("r", "6")
    .style("fill", "#FDD20EFF");
}

draw()