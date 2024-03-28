async function draw() {

  // load the JSON file with the data that draws the map
  const topology = await d3.json("zwe_admbnda_adm_level_1_and_level_2.json");

  // load the CSV file which contains the dataset for this graph
  const data = await d3.csv("districtData.csv");

  // storing the area of each district in a separate array to be used to assign each district a colour as defined by the thresholds in the colour scale
  const areaData = data.map( d => +d3.format(".1f")(d.POPULATION_DENSITY))

  // create a map object in order to store the population density per square kilometre per district using the ADM2_PCODE & POPULATION_DENSITY in key:value pairs
  // map will be used to select the colour of each district using the thresholds defined by the colorScale variable
  const valueMap = new Map(data.map( d => [d.ADM2_PCODE, +d3.format(".1f")(d.POPULATION_DENSITY)]));

  ///////////////////

  // setting the dimensions for the map area
  // map will be responsive
  const width = 900;
  const height = 600;

  // defining the map projection type
  const mapProjection = d3.geoMercator()
    .center([0, 6]) 
    .scale(400)
    .rotate([0, 0, -4]); 

  // defining the domain and range
  // discrete input and discrete output where the bands for the domain are varying, hence d3.scaleThreshold() is used
  const colorScale = d3.scaleQuantile()
  .domain(areaData)
  .range(d3.schemePuBu[9]);
  // schemeGnBu, schemePuBuGn, schemeBuGn

  // drawing the svg area for where d3 will draw the map
  const svg = d3.select("#map-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // defining the geographic path generator used to draw the map
  const pathGenerator = d3.geoPath()
    .projection(mapProjection);

  // create a group to house the elements for the map projection
  const chart = svg.append("g");

  // drawing the map on the web page
  chart.selectAll("path")
    .data(topojson.feature(topology, topology.objects.   zwe_admbnda_adm2_zimstat_ocha_20180911).features)
    .join("path")
    .attr("d", pathGenerator)
    .attr("fill", d => colorScale(valueMap.get(d.properties.ADM2_PCODE)));    

  // tooltip
  chart.selectAll("title")
    .data(topojson.feature(topology, topology.objects.   zwe_admbnda_adm2_zimstat_ocha_20180911).features)
    .join("title")
    .text( d => console.log(d.properties.ADM2_EN, +valueMap.get(d.properties.ADM2_PCODE)))
    .attr("fill", "black")





    
}

draw()