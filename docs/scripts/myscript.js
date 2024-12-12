// add your JavaScript/D3 to this file

function print() {
  console.log("button works!");
  
}

// Define dimensions and margins for the SVG
const margin = {top: 20, right: 30, bottom: 70, left: 40},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("div#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
const dataPath = "data/joined-amazon-purchases.csv";
d3.csv(dataPath).then(function(data) {

    // Preprocess data: Group and aggregate
    const groupedData = d3.group(data, d => d["Q-demos-gender"], d => d["Category"]);
    console.log(groupedData);
    const processedData = [];

    for (const [gender, categories] of groupedData.entries()) {
        const categoryCounts = Array.from(categories, ([category, rows]) => ({
            category: category,
            count: rows.length
        }));

        // Sort by count and take the top 5
        const topCategories = categoryCounts.sort((a, b) => b.count - a.count).slice(0, 5);

        topCategories.forEach(d => {
            processedData.push({
                gender: gender,
                category: d.category,
                count: d.count
            });
        });
    }

    // Create scales
    const x0 = d3.scaleBand()
        .domain([...new Set(processedData.map(d => d.gender))])
        .range([0, width])
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain([...new Set(processedData.map(d => d.category))])
        .range([0, x0.bandwidth()])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.count)])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain([...new Set(processedData.map(d => d.category))])
        .range(d3.schemeCategory10);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add grouped bars
    svg.selectAll("g.gender-group")
        .data([...d3.group(processedData, d => d.gender)])
        .join("g")
        .attr("transform", d => `translate(${x0(d[0])},0)`)
        .selectAll("rect")
        .data(d => d[1])
        .join("rect")
        .attr("x", d => x1(d.category))
        .attr("y", d => y(d.count))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", d => color(d.category));

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, 0)`);

    const categories = [...new Set(processedData.map(d => d.category))];

    categories.forEach((category, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", color(category));

        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 10)
            .text(category)
            .attr("alignment-baseline", "middle");
    });
}).catch(function(error) {
    console.error("Error loading data:", error);
});