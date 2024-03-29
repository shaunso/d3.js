async function draw() {
  // Data
  const dataset = await d3.json('data.json');

  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  const labelsGroup = ctr.append('g')
    .classed('bar-labels', true)

  const xAxisGroup = ctr.append("g")
    .style(
      "transform", `translateY(${dimensions.ctrHeight}px)`
    )

  // the function to repurpose the histogram
  function histogram(metric) {
    const xAccessor = d => d.currently[metric]
    const yAccessor = d => d.length

    // Create Scale
    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.ctrWidth])
      .nice()

    const bin = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(10)

    const newDataset = bin(dataset)

    const padding = 1

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(newDataset, yAccessor)])
      .range([dimensions.ctrHeight, 0])
      .nice()

    // Draw Bars
    const exitTransition = d3.transition().duration(500)
    const updateTransition = exitTransition.transition().duration(500)

    ctr.selectAll('rect')
      .data(newDataset)
      .join(
        (enter) => enter.append('rect')
          .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
          .attr("height", 0)
          .attr('x', d => xScale(d.x0))
          .attr("y", dimensions.ctrHeight)
          .attr('fill', '#b8de6f'),          
        (update) => update,
        (exit) => exit.attr('fill', '#f39233')
        .transition(exitTransition)
          .attr('y', dimensions.ctrHeight)
          .attr('height', 0)
          .remove()
      )
      .transition(updateTransition)
      .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - padding]))
      .attr("height", d => dimensions.ctrHeight - yScale(yAccessor(d)))
      .attr('x', d => xScale(d.x0))
      .attr("y", d => yScale(yAccessor(d)))
      .attr('fill', '#01c5c4')

      // placing the labels
      labelsGroup.selectAll("text")
      .data(newDataset)
      .join(
        enter => enter.append('text')
          .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
          .attr("y", dimensions.ctrHeight)
          .attr('fill', '#b8de6f')
          .text(yAccessor),
        update => update,
        exit => exit.attr('fill', '#f39233')
          .transition(exitTransition)
          .attr("y", dimensions.ctrHeight)
          .remove()
      )
      .transition(updateTransition)
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 10)
      .attr("fill", "black")
      .text(yAccessor)

    // Draw Axis
    const xAxis = d3.axisBottom(xScale)

    xAxisGroup.transition()
      .call(xAxis)
  }

  // event listener
  d3.select("#metric").on('change', function (e) {
    e.preventDefault()

    histogram(this.value)
  })

  histogram('humidity')
}

draw();