async function draw() {
  // parse the data to draw the pie chart
  const data = await d3.csv("data.csv");

  // define the dimensions and margins of the svg and chart
  const margin = {top:50, right: 75, bottom: 50, left: 75};
  const height = 750 - margin.top - margin.bottom;
  const width = 950 - margin.left - margin.right;

  // - append an svg element to the body of the html page by selecting the div with id 'donut-chart'
  // - set the dimensions of the svg element by setting its width and height attributes
  // - the svg element (and all of its contents) is made responsive by setting the viewBox attribute
  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;");

  // - create a group where the actual chart will be drawn
  // - move this group to ensure that any labels are not cut off
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${0})`);

  // define the radius of the donut
  const radius = Math.min(width, height) / 2 - margin.left;

  // define the scale for the donut
  const pie = d3.pie()
    .value( d => +d.value);

  const slices = pie(data) ;

  const arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(radius / 1.45)
    .padAngle(0.025)
    .cornerRadius(20);

  const colorScale = d3.scaleOrdinal()
    .domain(data.map(d => d.response))
    .range(["#00203FFF","#EEA47FFF"])

  // position the center of the circle from where to start drawing the shapes
  const arcsGroup = chart.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)

  arcsGroup.selectAll("path")
    .data(slices)
    .join("path")
    .attr("d", arc)
    .attr("fill", d => colorScale(d.data.response))
}

draw()