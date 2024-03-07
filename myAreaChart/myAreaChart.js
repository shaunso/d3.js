async function draw() {
  // store the dataset
  const dataset = await d3.csv("data.csv")

  // set the dimensions and margins for the graph & graph area
  const margin = {top: 48, right: 64, bottom: 48, left: 64};
  const width = 450 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // 
  // define accessor functions
  // 
  // create the time parse function
  const parseDate = d3.timeParse("%q-%y");

  // x-accessor
  const xAccessor = d => parseDate(d.date);

  // y-accessor
  const yAccessor = d => (d.subscribers);



  // 
  // define the scales
  // 
  // x-scale
  const xScale = d3.scaleUtc()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, width])
    .nice()
    ;

  // y-scale
  const yScale = d3.scaleLinear()
  .domain([6000000, (d3.max(dataset, yAccessor))])
  .range([height, 0])
  .nice();


  // 
  // define the area generator
  // 
  const areaGenerator = d3.area() 
    .x( d => xScale(xAccessor(d)))
    .y0(yScale(6000000))
    .y1( d => yScale(yAccessor(d)));
  



  //
  // drawing the chart
  // 
  // add the svg element on the html body
  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    ;

  // create the chart area on the svg element
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    ;

  // draw the area graph
  chart.append("path")
    .datum(dataset)
    .attr("d", areaGenerator)
    .attr("fill", "#49CFB4")
    .attr("stroke", "#00B398")
    .attr("stroke-width", 2)




  // 
  // generate the axes
  // 
  // x-axis
  const xAxisGenerator = d3.axisBottom(xScale)
  ;
  xAxisGenerator.tickSize(3)
  .tickPadding(-5)
  ;

  // y-axis
  const yAxisGenerator = d3.axisRight(yScale);

  yAxisGenerator.tickFormat(d => d / 1000000)
    .tickSize(-width)


  // 
  // call the axes
  // 
  // x-axis
  const xAxis = chart.append("g")
    .call(xAxisGenerator)
    ;
 // customise the x-axis generator
  xAxis.attr("transform",`translate(${0},${height})`);

  xAxis.select(".domain")
    .attr("stroke", "#666666");

  xAxis.selectAll(".tick text")
    .attr("color", "#666666")
    .attr("font-weight", 500)
    .attr("transform", "translate(0, 20) rotate(-90)");
  
   xAxis.selectAll(".tick line")
    .attr("stroke", "#666666");  

  xAxis.select("g.tick:nth-child(12) > text:nth-child(2)")
    .attr("fill", "#none");

    
  // y-axis
  const yAxis = chart.append("g")
    .call(yAxisGenerator);
  // customise the y-axis generator
  yAxis.attr("transform", `translate(${width}, 0)`);

  yAxis.select(".domain")
    .attr("stroke", "none");

  yAxis.selectAll(".tick text")
  .attr("color", "#666666")
  .attr("font-weight", 500)
  .attr("transform", `translate(${-2},${-5})`)
  .attr("text-anchor", "end");

  yAxis.selectAll(".tick line")
  .attr("stroke", "#666666")
  .attr("opacity", 0.4); 


// 
// drawing the labels
// 
// y-scale-label
chart.append("g")
  .attr("transform", `translate(${width-11},${-20})`)
  .attr("fill", "#666666")
  .append("text")
  .text("millions")
  .attr("font-size", 11)
  .attr("font-weight", 500)
  .attr("text-anchor", "start");

chart.append("g")
  .append("text")
  .text("Number of active subscribers")
  .attr("fill", "#00B398")
  .attr("transform", `translate(${width + margin.right / 2},${height / 6}) rotate(90)`)

// chart title
chart.append("g")
  .append("text")
  .text("Econet Wireless Subscriber Growth")
  .attr("transform", `translate(${0}, ${-25})`)
  .attr("fill", "#00B398")
  .attr("font-weight", 700);
  
  chart.append("text")
  .text("2014-2023")
  .attr("transform", "translate(0,-5)")
  .attr("fill", "#00B398")
  .attr("font-weight", 500)
 

}

draw()