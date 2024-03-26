async function draw() {
  // loading the topographic data
  const topology = await d3.json("provincialMap.json");
  console.log(topology.objects.land);

  // loading population data
  const population = await d3.csv("population.csv");
  
  // storing the population of each province in a separate array to be used for the colour scale
  const populationDataset = population.map(d => +d.POPULATION);

  // creating a map object to store the population by province in key-value pairs using the ADM1_PCODE
  // will be used with the scale to give the approptiate province its correct colour
  const valueMap = new Map(population.map(d => [d.ADM1_PCODE, +d.POPULATION]))

  console.log(valueMap)

  // setting the dimensions and margins of the graph
  const margin = {top: 20, right: 40, bottom: 20, left: 40}
  const width = 780 - margin.left - margin.right;
  const height = 540 - margin.top - margin.bottom;

  // defining the map projection type
  const mapProjection = d3.geoMercator()
  .center([0, 5]) 
  .scale(350)
  .rotate([0,0]);

  // defining the domain and range
  // discrete input and discrete output, hence d3.scaleOrdinal() is used
  const colorScale = d3.scaleQuantile()
  .domain(populationDataset)
  .range(d3.schemeRdYlGn[10])


  // drawing the svg area
  const svg = d3.select('#map')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;")
    .classed("svgArea", true);

  // creating the geographic path generator
  const pathGenerator = d3.geoPath()
    .projection(mapProjection);

  // drawing the chart area for where the map shall be drawn
  const chart = svg.append("g");

  // displaying the map
  chart.selectAll("path")
    .data(topojson.feature(topology, topology.objects.land).features)
    .join("path")
    .attr("d", pathGenerator)
    .attr("fill", d => colorScale(valueMap.get(d.properties.ADM1_PCODE)))
    
    // ADM1_EN
  
  // adding the text of each province to the chart
  const g = chart.selectAll("text")
    .data(population)
    .join("text")
    .style("fill", "black")
    .attr("text-anchor", "middle")
    .text(d => d.ADM1_NAME)
    .attr("transform", "translate(20,30)")
    .attr("x", d => console.log(d.Shape_Area))
    .attr("y", d => d.Shape_Leng)
    


// 
const zoom = d3.zoom()
.scaleExtent([1, 20])
.on('zoom', function(event) {
  chart.selectAll('path')
    .attr('transform', event.transform)
});

// Calling the zoom function.
svg.call(zoom);



}

draw ()