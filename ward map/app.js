async function draw() {

  // load the JSON file with the data that draws the map for the provinces and districts
  const topology = await d3.json("w.json");  

  // loading the data retrieved from the .CSV, dependent on the user input
  // variable is called in the next block, which is an if statement
  // default option shall be _population density_
  const data = await d3.csv("wardData.csv");
  
  ///////////////////
  // setting the dimensions for the map area
  // map will be responsive
  const width = 900;
  const height = 700;  

  // defining the map projection type
  const mapProjection = d3.geoMercator()
    .center([27, -20]) 
    .scale(4380)
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
  const valueMap = new Map(data.map( d => [d.ADM3_PCODE, +d3.format(".1f")(d.POPULATION_DENSITY)]));
  console.log(valueMap)
  
  // defining the domain and colour scale
  const domain = [0.1, Math.max(...data.map(d => d.POPULATION_DENSITY))];

  const color =  d3.scaleLog()
    .base(2)
    .domain(domain)
    .interpolate(() => d3.interpolatePlasma);

  // drawing the map on the web page
  chart.selectAll("path")
    .data(topojson.feature(topology, topology.objects.ward).features)
    .join("path")
    .attr("d", pathGenerator)
    .attr("fill", d => color(valueMap.get(d.properties.ADM3_PCODE)))
    .on("click", function(d, i) {
      console.log(`The population density for ${i.properties.ADM2_EN} ward ${i.properties.ADM3_EN} is ${d3.format(",")(valueMap.get(i.properties.ADM3_PCODE))} people per square kilometer`);
    });
  
/////////////////////////////////
// renders the provincial boundaries
    // chart.append("path")
    //   .datum(topojson.mesh(provinceTopology, provinceTopology.objects.province, (a, b) => a !== b))
    //   .attr("fill", "none")
    //   .attr("stroke", "white")
    //   .attr("stroke-linejoin", "round")
    //   .attr("d", pathGenerator);

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
  // 
  const zoom = d3.zoom()
    .scaleExtent([1, 20])
    .on('zoom', function(event) {
      chart.selectAll('path')
        .attr('transform', event.transform)
    });

  // Calling the zoom function.
  svg.call(zoom);

  ///////////////////////////////////////////////
  // legend
  ///////////////////////////////////////////////
  // render legend
  
  const thresholds = d3.range(-3, 16).map(x => 2 ** x);
  
  const x = d3.scaleLog()
    .base(2)
    .domain(domain)
    .rangeRound([0, 260]);

  const legend = chart.append("g")
      .style("font-size", "0.8rem")
      .style("font-family", "sans-serif")
      .attr("transform", "translate(20,40)");
  
  const label = legend.append("text")
      .style("font-weight", "bold")
      .text("Population density (persons / km²)")
      .attr("transform", "translate( 198, -8)");
  
  const scale = legend.append("g");
  
  scale.selectAll("rect")
    .data(thresholds)
    .join("rect")
      .attr("height", 10)
      .attr("x", d => x(d))
      .attr("width", d => x(2 * d) - x(d))
      .attr("fill", d => color(d));
  
  scale.call(
    d3.axisBottom(x)
      .tickSize(15)
      .tickFormat(v => v > 9999 ? d3.format(".2s")(v) : v > 999 ? d3.format(".1s")(v) : String(v))
    )
    .select(".domain")
      .remove(); 
}

draw()
