// JavaScript Code

// Set dimensions and margins
const margin = { top: 60, right: 30, bottom: 80, left: 100 },
width = 800 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// Append the SVG object
const svg = d3.select("div#plot")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

function changeData(demographic) {
    svg.selectAll("*").remove();
    const url = "https://raw.githubusercontent.com/briannata/shopping-analysis/refs/heads/main/d3data/" + demographic.toLowerCase() + "_top_categories.csv";
    
    // Load the data
    d3.csv(url).then(data => {
    // Convert to numbers
    data.forEach(d => d.Value = +d.Value);
  
    // List of groups and categories
    var groups = [...new Set(data.map(d => d.Group))];
    const subgroups = [...new Set(data.map(d => d.Category))];

    if(demographic == "Income") {
        groups = ["Less than $25,000", "$25,000 - $49,999", "$50,000 - $74,999", "$75,000 - $99,999", "$100,000 - $149,999", "$150,000 or more", "Prefer not to say"]
    }
    else if(demographic == "Race") {
        groups = ["Caucasian", "African American", "Asian", "American Indian/Native American/Alaska Native", "Other"]
    }
    else if(demographic == "Education") {
        groups = ["< High school", "High school/GED", "Bachelor's", "Graduate/professional", "Prefer not to say"]
    }
  
    // Scales
    const x0 = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding(0.1);
  
    const x1 = d3.scaleBand()
        .domain(subgroups)
        .range([0, x0.bandwidth()])
        .padding(0);
  
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Value)])
        .nice()
        .range([height, 0]);
  
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(d3.schemeCategory10);
  
    // Add plot title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Top Amazon Purchase Categories by " + demographic);
  
    // Add X axis
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .style("text-anchor", "middle") 
    .attr("dy", "1em")
    .attr("transform", "rotate(0)");
  
    // Add X axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(demographic);
  
    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(y));
  
    // Add Y axis label
    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Number of Purchases");
  
    // Add grouped bars
    const barGroups = svg.selectAll(".bar-group")
        .data(groups)
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", d => `translate(${x0(d)},0)`);
  
    barGroups.each(function(group) {
        const groupData = data.filter(d => d.Group === group);
  
        d3.select(this)
            .selectAll("rect")
            .data(groupData)
            .enter()
            .append("rect")
            .attr("x", d => x1(d.Category))
            .attr("y", d => y(d.Value))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.Value))
            .attr("fill", d => color(d.Category));
    });
  
    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 150},0)`);
  
    // Add legend title
    legend.append("text")
        .attr("x", -10)
        .attr("y", -10)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Categories");
  
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
}


changeData("Age");