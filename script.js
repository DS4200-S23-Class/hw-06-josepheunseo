// set the dimensions and margins of the graphs
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 400;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const radius = 4;

// create SVG element
const svgScatter = d3.select('#length-scatterplot')
  .attr('width', width)
  .attr('height', height);

// load data and scatterplot
d3.csv('data/iris.csv', (d) => {
	// coerce data to numbers
	d.x = +d.Petal_Length;
	d.y = +d.Sepal_Length;
	d.id = +d.id;
	return d;
}).then((data) => {
	
	// get all species
	const species = Array.from(d3.group(data, d => d.Species).keys());
  
	// create color mapping
  const color = d3.scaleOrdinal()
    .domain(species)
    .range(["blue", "purple", "green"]);

	// create scales
	const xScale = d3.scaleLinear()
	.range([0, innerWidth])
	.domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])

	const yScale = d3.scaleLinear()
	.range([innerHeight, 0])
	.domain([d3.min(data, d => d.y), d3.max(data, d => d.y)]);

	// create axis
	const xAxis = d3.axisBottom(xScale)
	const yAxis = d3.axisLeft(yScale)

	// add axis to svgBar
	svgScatter.append('g')
		.attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
		.call(xAxis);

	svgScatter.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.call(yAxis);

	// add bars to svgBar
	svgScatter.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(d.x) + margin.left)
		.attr('cy', d => yScale(d.y) + margin.top)
		.attr('r', radius)
		.style('fill', function(d) {return color(d.Species); })
		.style('opacity', 0.5);

	// add legend
  const legend = svgScatter.selectAll(".legend")
    .data(species)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(20," + (20 + i * 20) + ")"; });
  legend.append("rect")
    .attr("x", margin.left)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);
  legend.append("text")
    .attr("x", margin.left + 20)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d) { return d; });
})

// create SVG element
const svgScatter2 = d3.select('#width-scatterplot')
  .attr('width', width)
  .attr('height', height);

// load data and scatterplot
d3.csv('data/iris.csv', (d) => {
	// coerce data to numbers
	d.x = +d.Sepal_Width;
	d.y = +d.Petal_Width;
	d.id = +d.id;
	return d;
}).then((data) => {
	
	// get all species
	const species = Array.from(d3.group(data, d => d.Species).keys());
  
	// create color mapping
  const color = d3.scaleOrdinal()
    .domain(species)
    .range(["blue", "purple", "green"]);

	// create scales
	const xScale = d3.scaleLinear()
	.range([0, innerWidth])
	.domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])

	const yScale = d3.scaleLinear()
	.range([innerHeight, 0])
	.domain([d3.min(data, d => d.y), d3.max(data, d => d.y)]);

	// create axis
	const xAxis = d3.axisBottom(xScale)
	const yAxis = d3.axisLeft(yScale)

	// add axis to svgScatter2
	svgScatter2.append('g')
		.attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
		.call(xAxis);
	
	svgScatter2.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`)
		.call(yAxis);

	// add points to svgScatter2
	svgScatter2.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', d => xScale(d.x) + margin.left)
		.attr('cy', d => yScale(d.y) + margin.top)
		.attr('r', radius)
		.style('fill', function(d) {return color(d.Species); })
		.style('opacity', 0.5);

	// add legend
  const legend = svgScatter2.selectAll(".legend")
    .data(species)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);
  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

	// add brush function and event listener
	svgScatter2.call(d3.brush()                 
		.extent([[0,0], [width, height]])
		.on("start brush", (e) => {
			const extent = e.selection;
			if (extent) {
				// Get the selected points in the second scatterplot
				const [[x0, y0], [x1, y1]] = extent;
				const selectedIds = data.filter(d => 
					xScale(d.x) + margin.left >= x0 && xScale(d.x) + margin.left <= x1 &&
					yScale(d.y) + margin.top >= y0 && yScale(d.y) + margin.top <= y1
				).map(d => d.id);

				// Highlight the corresponding points in the first scatterplot
				svgScatter.selectAll("circle")
    			.attr("stroke", d => selectedIds.includes(d.id) ? "orange" : "none")
    			.attr("stroke-width", d => selectedIds.includes(d.id) ? "2" : "none")
    			.style("opacity", d => selectedIds.includes(d.id) ? "1" : "0.5");
				
				svgScatter2.selectAll("circle")
    			.attr("stroke", d => selectedIds.includes(d.id) ? "orange" : "none")
    			.attr("stroke-width", d => selectedIds.includes(d.id) ? "2" : "none")
    			.style("opacity", d => selectedIds.includes(d.id) ? "1" : "0.5");

				// Highlight the corresponding bars in the bar chart
				svgBar.selectAll("rect")
					.attr("stroke", d => selectedIds.some(item => d.ids.includes(item)) ? "orange" : "none")
					.attr("stroke-width", d => selectedIds.some(item => d.ids.includes(item))  ? "4" : "none")
					.style("opacity", d => selectedIds.some(item => d.ids.includes(item))  ? "1" : "0.8");
			}
		})
	);
});

// create the data for the bar chart
const data = [
  { species: "setosa", count: 50, ids: Array.from({length: 50}, (_, i) => i + 1) },
  { species: "versicolor", count: 50, ids: Array.from({length: 50}, (_, i) => i + 51) },
  { species: "virginica", count: 50, ids: Array.from({length: 50}, (_, i) => i + 101) }
];

// create SVG element for bar chart
const svgBar = d3.select("#bar-chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

// create color mapping
const color = d3.scaleOrdinal()
  .domain(["setosa", "versicolor", "virginica"])
  .range(["blue", "purple", "green"]);

// create scales
const xScale = d3.scaleBand()
  .range([0, innerWidth])
  .domain(data.map(d => d.species))
  .padding(0.1);

const yScale = d3.scaleLinear()
  .range([innerHeight, 0])
  .domain([0, 60]);

// create axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// add axis to svgBar
svgBar.append("g")
	.attr('transform', `translate(${margin.left}, ${innerHeight + margin.top})`)
  .call(xAxis);

svgBar.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .call(yAxis);

// add bars to svgBar
svgBar.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => xScale(d.species) + margin.left)
  .attr("y", d => yScale(d.count) + margin.top)
  .attr("width", xScale.bandwidth())
  .attr("height", d => innerHeight - yScale(d.count))
  .style("fill", d => color(d.species))
	.style("opacity", 0.8);

