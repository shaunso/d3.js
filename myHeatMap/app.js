async function draw() {
  // parsing the data used to draw the map
  const data = await d3.csv("data.csv");

  // setting the dimensions and margins of the chart area
  const margin = {top: 30, right: 20, bottom: 30, left: 70};
  const width = 900 - margin.left - margin.right;
  const height = 250 - margin.top - margin.bottom;

  // append the svg element to the body of the page by selecting the element with the #heatmap id
  const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom +60)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom +60])
    .attr("style", "max-width: 100%; height: auto;");

  // creating a chart group to draw the map
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, 60)`);

  // defining the colour scale
  const colourScale = d3.scaleThreshold()
    .domain([1,5,10,15,20,25,30])
    .range(d3.schemeBuGn[8])

  // defining the labels for the x-axis
  // Set makes an object of unique day values, returning an array-like object of length 7 instead of 245
  // Array.from turns the set into an array
  const xLabels =  Array.from(new Set (data.map( d => d.week )))

  // defining and calling the y-axis
  const xScale = d3.scaleBand()
    .domain(xLabels)
    .range([0, width])
    .padding(0)
    .paddingOuter(0.15)
    .paddingInner(0.125);

  chart.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0).tickPadding(8))

  // defining the labels for the y-axis
  // Set makes an object of unique day values, returning an array-like object of length 35 instead of 245
  // Array.from turns the set into an array
  const yLabels =  Array.from(new Set (data.map( d => d.day )))
  
  // defining and calling the x-axis
  const yScale = d3.scaleBand()
    .domain(yLabels)
    .range([0, height])
    .padding(0)
    .paddingOuter(0.15)
    .paddingInner(0.125);

  chart.append("g")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(yScale).tickSizeOuter(0).tickPadding(8))

  // drawing the rectangles on the chart
  chart.selectAll("rect")
    .data(data)
    .join("rect")
    .attr('stroke', 'rgb(2, 36, 2, 0.85)')
    .attr('stroke-width', 0.25)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr('x', d => xScale(d.week))
    .attr('y', d => yScale(d.day))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colourScale(d.value))
  
  // adding x-axis title to chart
  chart.append("g")
    .append("text")
    .text("Week")
    .classed('axis-label', true)
    .attr("transform", `translate(${width / 2},${height + 45})`)

    // adding the legend

    // Copyright 2021, Observable Inc.
  // Released under the ISC license.
  // https://observablehq.com/@d3/color-legend
  function Legend(color, {
    title,
    tickSize = 6,
    width = 320, 
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {}) {
  
  
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;
  
    // Threshold
    if (color.invertExtent) {
      const thresholds
          = color.thresholds ? color.thresholds() // scaleQuantize
          : color.quantiles ? color.quantiles() // scaleQuantile
          : color.domain(); // scaleThreshold
  
      const thresholdFormat
          = tickFormat === undefined ? d => d
          : typeof tickFormat === "string" ? d3.format(tickFormat)
          : tickFormat;
  
      x = d3.scaleLinear()
          .domain([-1, color.range().length - 1])
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.range())
        .join("rect")
          .attr("x", (d, i) => x(i - 1))
          .attr("y", marginTop)
          .attr("width", (d, i) => x(i) - x(i - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", d => d)
          ;
  
      tickValues = d3.range(thresholds.length);
      tickFormat = i => thresholdFormat(thresholds[i], i);
    }
  
    // Ordinal
    else {
      x = d3.scaleBand()
          .domain(color.domain())
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
          .attr("x", x)
          .attr("y", marginTop)
          .attr("width", Math.max(0, x.bandwidth() - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", color);
  
      tickAdjust = () => {};
    }
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
          .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("class", "title")
          .text(title));
  
      return svg.node();
    }
  // adding the legend to the chart
  Legend(d3.scaleThreshold([1,5,10,15,20,25,30], d3.schemeBuGn[8]), {
    title: "No. of sales",
    tickSize: 3
  })


  
  
}

draw()