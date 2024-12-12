// add your JavaScript/D3 to this file

function print() {
  console.log("button works!");
  
}
// Set dimensions and margins
const margin = { top: 30, right: 30, bottom: 50, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the SVG object to the body of the page
const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.csv("https://raw.githubusercontent.com/briannata/shopping-analysis/refs/heads/main/d3data/age_top_categories.csv").then(data => {
    // Convert numerical values to numbers
    data.forEach(d => d.Value = +d.Value);

    // List of groups (unique age groups) and subgroups (categories)
    const groups = [...new Set(data.map(d => d.Group))];
    const subgroups = [...new Set(data.map(d => d.Category))];

    // Scales
    const x0 = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding(0.1);

    const x1 = d3.scaleBand()
        .domain(subgroups)
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)])
        .nice()
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeCategory10);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-40)");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add bars
    svg.selectAll(".bar-group")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(${x0(d.Group)},0)`)
        .selectAll("rect")
        .data(d => subgroups.map(key => ({ key, value: d.Value, group: d.Group })))
        .enter()
        .append("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100},0)`);

    subgroups.forEach((subgroup, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(subgroup));

        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 12)
            .text(subgroup)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");
    });
});