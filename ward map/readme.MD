# Choropleth map

**01-04-24**
Simple choropleth map of zimbabwe with zero frills, no thrills & as plain as oyinbos

**13-04-24**
-Changed the colour scale to now use the interpolate() function as the population densities will be mapped using log base 2. This allows for finer descrepincies to be properly showcase as this is ward data with nearl two thousand data points to the choropleth

-Added a click event that console logs the district name, ward number and ward population density

-Added a legend

-Legend and scale courtesy of `https://observablehq.com/@jake-low/how-well-does-population-density-predict-u-s-voting-outcome`

-Deleted most of the CSS but added a few items

-Added the topojson package file for offline usage
