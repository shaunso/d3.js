async function draw() {

  // load the JSON file with the data that draws the map for the provinces and districts
  const topology = await d3.json("wardMap-min.json");  

  // loading the data retrieved from the .CSV, dependent on the user input
  // variable is called in the next block, which is an if statement
  // default option shall be _population density_
  const data = await d3.csv("wardData.csv");
  console.log(data)

  // const administrativeLevel = "district"
  
  ///////////////////
  // setting the dimensions for the map area
  // map will be responsive
  const width = 900;
  const height = 700;  

  // defining the map projection type
  const mapProjection = d3.geoMercator()
    .center([0, 28]) 
    .scale(300)
    .rotate([0, 0, -4]); 

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
      
  // create a map object in order to store the population density per square kilometre per district using the ADM2_PCODE & POPULATION_DENSITY in key:value pairs
  // map will be used to select the colour of each district using the thresholds defined by the colorScale variable
  const valueMap = new Map(data.map( d => [d.ADM3_PCODE, +d3.format(".1f")(d.POPULATION)]));
  
  
  // storing the area of each district in a separate array to be used to assign each district a colour as defined by the thresholds in the colour scale
  const areaData = data.map( d => +d3.format(".1f")(d.POPULATION));

  // defining the domain and range
  // discrete input and discrete output where the bands for the domain are varying, hence d3.scaleThreshold() is used
  const colorScale = d3.scaleQuantile()
  .domain(areaData)
  .range(d3.schemePRGn[11]);

  // drawing the map on the web page
  chart.selectAll("path")
    .data(topojson.feature(topology, topology.objects.land).features)
    .join("path")
    .attr("d", pathGenerator)
    .attr("fill", d => colorScale(valueMap.get(d.properties.ADM3_PCODE)));  


  ///////////////////////////////////////////////
    // zoom function
  ///////////////////////////////////////////////

  // adding zoom functionality to the map using event listeners created by d3.zoom
  // map can also be panned using the mouse
  // 
  // the extenet of the zoom behaviour is determined by the chained function .scaleExtent([x,y]) 
  // Then we instruct the computer, when it “sees” a “zoom” event, to carry out another function (.on("zoom",function(event) {).
  // 
  // that function firstly selects all our paths g.selectAll('path') and then applies a transform to them based on the event (.attr('tran
  const zoom = d3.zoom()
    .scaleExtent([1,4])
    .on("zoom", function (event) {
      chart.selectAll("path")
        .attr("transform", event.transform);
    });

  // calling the zoom function
  svg.call(zoom);

    
}

draw()
