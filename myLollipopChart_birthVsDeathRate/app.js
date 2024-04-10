async function draw() {
  // parse the data from the .csv file
  const data = await d3.csv("data.csv");

  // define dimensions and margins
  const margin = {top:0, right: 100, bottom: 40, left: 100};

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
    .attr("transform", `translate(${margin.left + 100},${margin.top})`);

  // Add X axis
  const xScale = d3.scaleLinear()
    .domain([0,40])
    .range([ 0, width]);

  const xAxis = d3.axisBottom(xScale) 
    .tickPadding(12)
    .tickSize(0);
 
  const xAxisGroup = chart.append("g")
    .call(xAxis);
    
  xAxisGroup.attr("transform",`translate(0,${height})`);

  // Y axis
  const yScale = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(d => d.province))
    .padding(1);

  const yAxis = d3.axisLeft(yScale) 
    .tickPadding(10)
    .tickSize(0);   

  const yAxisGroup = chart.append("g")
    .call(yAxis);
    
  yAxisGroup.select(".domain").remove();

  // adding grid lines
  const gridLines = d3.axisTop(xScale);

  chart.append("g")
  .classed("grid-lines", true)
  .call(gridLines.tickSize(height-30).tickFormat(""))
  .call(d => d.select(".domain").remove())
  .attr("transform",`translate(0,${height})`);


  // Lines
  chart.selectAll("lines")
    .data(data)
    .join("line")
      .attr("x1", d => xScale(d.death_rate))
      .attr("x2", d => xScale(d.birth_rate))
      .attr("y1", d => yScale(d.province))
      .attr("y2", d => yScale(d.province))
      .attr("stroke", "#E7E8D1")
      .attr("stroke-width", "4px");

  // Circles of death rate
  chart.selectAll("circles")
  .data(data)
  .join("circle")
    .attr("cx", d => xScale(d.death_rate))
    .attr("cy", d => yScale(d.province))
    .attr("r", "10")
    .style("fill", "#101820FF");

  // Circles of birth rate
  chart.selectAll("circles")
  .data(data)
  .join("circle")
    .attr("cx", d => xScale(d.birth_rate))
    .attr("cy", d => yScale(d.province))
    .attr("r", "10")
    .style("fill", "#2BAE66FF");
}

draw()