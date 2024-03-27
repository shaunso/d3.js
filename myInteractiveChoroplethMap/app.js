async function draw() {
  // load the JSON file with the data that draws the map
  const topology = await d3.json("zwe_admbnda_adm_level_1_and_level_2.json");

  // setting the dimensions for the map area
  // map will be responsive
  const margin = {top: 20, right: 40, bottom: 20, left: 40};
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // defining the map projection type
  const mapProjection = d3.geoMercator()
    .center([0, 5]) 
    .scale(350)
    .rotate([0,0]); 

  // defining the domain and range
  // discrete input and discrete output where the bands for the domain are varying, hence d3.scaleThreshold() is used
  const colorScale = d3.scaleThreshold()
  .domain([10, 50, 500, 1000, 5000])
  .range(d3.schemeRdYlGn[6])

  // drawing the svg area for where d3 will draw the map
  const svg = d3.select("#map-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
    .attr("style", "max-width: 100%; height: auto;")





}

draw()