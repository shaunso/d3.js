async function draw() {
  // parse the Data
const data = await d3.csv("https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/change_over_time/area_stacked_d3.csv");

// set the dimensions and margins of the graph
const margin = {top: 100, right: 20, bottom: 50, left: 40};
const width = 450 - margin.left - margin.right;
const height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#viz_container")
  .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 450 350")
    .attr("preserveAspectRatio", "xMinYMin")
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// list of value keys
const typeKeys = data.columns.slice(1);
const monthKeys = data.map(d => d.months);

// stack the data
const stack = d3.stack()
   .keys(typeKeys)
   .order(d3.stackOrderNone)
   .offset(d3.stackOffsetNone)
const stackedData = stack(data)

// X scale and Axis
const xScale = d3.scalePoint()
  .domain(monthKeys)
  .range([0, width])
  .padding(.2);
  
svg
  .append('g')
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(xScale).tickSize(0).tickPadding(8))

// Y scale and Axis
const yScale = d3.scaleLinear()
    .domain([0, 500])
    .range([height, 0]);

svg
  .append('g')
  .call(d3.axisLeft(yScale).ticks(9).tickSize(0).tickPadding(6))
  .call(d => d.select(".domain").remove());

// define the stacked area generator
const areaGenerator = d3.area()
  .x(d => xScale(d.data.months))
  .y0(d => yScale(+d[0]))
  .y1(d => yScale(+d[1]));

// color palette
const color = d3.scaleOrdinal()
  .domain(typeKeys)
  .range(["#18375F", "#0072BC", "#8EBEFF", "#00B398"])

// set horizontal grid line
const GridLine = () => d3.axisLeft().scale(yScale);

svg
  .append("g")
    .attr("class", "grid")
  .call(GridLine()
    .tickSize(-width,0,0)
    .tickFormat("")
);

// // create a tooltip
// const tooltip = d3.select("body")
//   .append("div")
//     .attr("id", "chart")
//     .attr("class", "tooltip");

// // tooltip events
// const mouseover = function(d) {
//     tooltip
//       .style("opacity", .8)

//     d3.select(this)
//       .style("opacity", .5)
// }
// const mouseleave = function(d) {
//     tooltip
//       .style("opacity", 0)
//     d3.select(this)
//       .style("opacity", 1)}

svg
.append("g")
.selectAll("g")
.data(stackedData)
.join("path")
    .attr("fill", d => color(d.key))
    .attr("d", areaGenerator)
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    // .on("mouseover", mouseover)
    // .on("mouseleave", mouseleave)
    

// // set title
// svg
//   .append("text")
//     .attr("class", "chart-title")
//     .attr("x", -(margin.left)*0.6)
//     .attr("y", -(margin.top)/1.5)
//     .attr("text-anchor", "start")
//   .text("Evolution of funding in West Africa region | 2020")

// // set Y axis label
// svg
//   .append("text")
//     .attr("class", "chart-label")
//     .attr("x", -(margin.left)*0.6)
//     .attr("y", -(margin.top/8))
//     .attr("text-anchor", "start")
//   .text("USD millions")

// // set source
// svg
//   .append("text")
//     .attr("class", "chart-source")
//     .attr("x", -(margin.left)*0.6)
//     .attr("y", height + margin.bottom*0.7)
//     .attr("text-anchor", "start")
//   .text("Source: UNHCR Refugee Data Finder")

// // set copyright
// svg
//   .append("text")
//     .attr("class", "copyright")
//     .attr("x", -(margin.left)*0.6)
//     .attr("y", height + margin.bottom*0.9)
//     .attr("text-anchor", "start")
//   .text("©UNHCR, The UN Refugee Agency")
  

// //set legend
// svg
//     .append("rect")
//         .attr("x", -(margin.left)*0.6)
//         .attr("y", -(margin.top/2))
//         .attr("width", 13)
//         .attr("height", 13)
//         .style("fill", "#18375F")
// svg
//     .append("text")
//         .attr("class", "legend")
//         .attr("x", -(margin.left)*0.6+20)
//         .attr("y", -(margin.top/2.5))
//     .text("Earmarked")
// svg
//     .append("rect")
//         .attr("x", 60)
//         .attr("y", -(margin.top/2))
//         .attr("width", 13)
//         .attr("height", 13)
//         .style("fill", "#0072BC")
// svg
//     .append("text")
//         .attr("class", "legend")
//         .attr("x", 80)
//         .attr("y", -(margin.top/2.5))
//     .text("Softly earmarked")
// svg
//     .append("rect")
//         .attr("x", 170)
//         .attr("y", -(margin.top/2))
//         .attr("width", 13)
//         .attr("height", 13)
//         .style("fill", "#8EBEFF")
// svg
//     .append("text")
//         .attr("class", "legend")
//         .attr("x", 190)
//         .attr("y", -(margin.top/2.5))
//     .text("Tightly earmarked")
// svg
//     .append("rect")
//         .attr("x", 290)
//         .attr("y", -(margin.top/2))
//         .attr("width", 13)
//         .attr("height", 13)
//         .style("fill", "#00B398")
// svg
//     .append("text")
//         .attr("class", "legend")
//         .attr("x", 310)
//         .attr("y", -(margin.top/2.5))
//     .text("Unearmarked")


}

draw()