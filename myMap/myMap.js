async function draw() {
  // loading the json file
  const topology = await d3.json("data.json");

  // defining the map projection type
  const mapProjection = d3.geoMercator()
    .center([25,-10])
    .scale(1500)
    .rotate([0,10]);

  // drawing the map area
  const svg = d3.select("#map")
    .append("svg")
    .classed("svgArea", true)

  // creating the geographic path generator
  const pathGenerator = d3.geoPath()
    .projection(mapProjection);

  // drawing the chart area for the map
  const chart = svg.append("g");

  // displaying the map
  chart.selectAll("path")
    .data(topojson.feature(topology, topology.objects.countries).features)
    .join("path")
    .attr("d", pathGenerator)
    .attr("fill", d => (d.id === 716) ? "black" : "rgb(172, 168, 128)");

  chart.append("text") // append text
    .attr("x", mapProjection([25.2565256525653, -17.73903531053105])[0])
    .attr("y", mapProjection([25.2565256525653, -17.73903531053105])[1])
    .attr("dy", -10) 
    .classed("text", true)
    .attr("text-anchor", "middle") 
    .text("Victoria Falls"); 

  chart.append("circle")
    .attr("cx",  mapProjection([25.2565256525653, -17.73903531053105])[0])
    .attr("cy",  mapProjection([25.2565256525653, -17.73903531053105])[1])
    .attr("r", 5)
    .style("fill", "green");
  


}

draw()