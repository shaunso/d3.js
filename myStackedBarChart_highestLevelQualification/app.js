async function draw() {
  // parse the data for the chart from the .csv file
  const data = await d3.csv("data.csv");

  // define the margins and dimensions of the svg area
  const margin = {top: 50, right: 30, bottom: 50, left: 50};
  const width = 950 - margin.left - margin.right;
  const height = 650 - margin.top - margin.bottom;

  // create and append the svg element to the html body by selecting the empty div with id #bar-chart
  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;");

  // define a group to house the actually chart, labels, axis, titles, etc.
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  // list of value keys
  const typeKeys = data.columns.slice(1);

  // list of axis labels
  const labels = data.map(d => d.qualification);

  // define the stack generator and stacked data
  const stackGenerator = d3.stack()
    .keys(typeKeys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);    

  // stack the data
  const stackedData = stackGenerator(data)

  // define the x-axis scale
  const xScale = d3.scaleBand()
    .domain(labels)
    .range([0, width])
    .padding(0.4);

  // define the y-axis scale
  const yScale = d3.scaleLinear()
    .domain([0, 250000])
    .range([height, 0])

  // define the colour scale
  const colorScale = d3.scaleOrdinal()
    .domain(typeKeys)
    .range(['#949398FF','#F95700FF'])
    .unknown("#ccc")

  // append the x-axis to the chart group
  const xAxis = d3.axisBottom(xScale)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(8);

  const xAxisGroup = chart.append("g")
    .call(xAxis)
    .attr("transform", `translate(0, ${height})`)

  // append the y-axis to the chart group
  const yAxis = d3.axisLeft(yScale)
  .ticks(5, "s")
  .tickSize(0)
  .tickSizeOuter(0)
  .tickPadding(24);

  const yAxisGroup = chart.append("g")
    .call(yAxis)

  yAxisGroup.select(".domain").remove();

  // draw the gridlines for the chart
  const gridLines = d3.axisRight(yScale);

  chart.append("g")
    .classed("grid-lines", true)
    .call(gridLines.tickSize(width ).ticks(5).tickFormat(""))
    .call(d => d.select(".domain").remove())
    .attr("transform",`translate(0,0)`);
  

  // draw the bars for the chart
  chart.append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => xScale(d.data.qualification))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth())

}

draw()