async function draw() {
  // parse the .csv file with the data contained for drawing the bar chart
  const data = await d3.csv("data.csv");
  console.log(data)

  // define the margins and dimensions of the chart area
  const margin = {top: 24, right: 40, bottom: 24, left: 172};
  const width = 900 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;"); // .attr('preserveAspectRatio','xMinYMin')

  // define the chart area to house the drawings
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    

  // create a formatter for the number
  const formatter = d3.format(".2s");

  // define x-scale
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.value)])
    .nice()
    .range([0, width]);

  // set the x-axis
  chart.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale)
      .tickSize(0)
      .tickPadding(6)
      .tickFormat(formatter)
      .ticks(4)
    )
    .call(d => d.select(".domain")
      .remove());
    
  // define the y-scale
  const yScale = d3.scaleBand()
    .domain(data.map( d => d.item))
    .range([0, height])
    .padding(.25)

  // set the y-axis
  chart.append("g")
    .call(d3.axisLeft(yScale)
      .tickSize(0)
      .tickPadding(6)
    )
    .call(d => d.select(".domain")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 2));

  // set vertical grid line
  const GridLine = () => d3.axisBottom().scale(xScale);
  chart
    .append("g")
      .attr("class", "grid")
    .call(GridLine()
      .tickSize(height,0,0)
      .tickFormat("")
      .ticks(4));


  // drawing the bars onto the chart
  chart.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("fill", "#69b3a2")
    .attr("x", xScale(0) )
    .attr("y", d => yScale(d.item))
    .attr("width", d => xScale(d.value))
    .attr("height", yScale.bandwidth())


}

draw()