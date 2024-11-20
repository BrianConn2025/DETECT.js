import * as d3 from 'd3';

let xChart: d3.Selection<SVGSVGElement, unknown, null, undefined>;
let yChart: d3.Selection<SVGSVGElement, unknown, null, undefined>;
let gazeDirectionChart: d3.Selection<SVGSVGElement, unknown, null, undefined>;

let xData: number[] = []; // Store X data points (horizontal gaze position)
let yData: number[] = []; // Store Y data points (vertical gaze position)
let gazeDirectionData: { x: number, y: number }[] = []; // Store gaze direction points (both X and Y)

const MAX_POINTS = 100; // Maximum number of points to display

// Function to create the X chart with white titles and labels
export function createXChart(container: HTMLElement) {
  const width = 640, height = 480;

  const xScale = d3.scaleLinear().domain([-1, 1]).range([0, width]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

  xChart = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Add title to the graph
  xChart.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .attr('fill', 'white')  // White color for the title
    .text('Horizontal Gaze Movement (X)');

  // Add X-axis
  xChart.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height - 20})`)
    .call(d3.axisBottom(xScale));

  // Add Y-axis
  xChart.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(40, 0)`)
    .call(d3.axisLeft(yScale));

  // Add Y-axis label
  xChart.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .attr('fill', 'white')  // White color for Y-axis label
    .text('Gaze Position (Y)');

  // Add path for the line
  xChart.append('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .attr('stroke-width', 2);
}

// Function to create the Y chart with white titles and labels
export function createYChart(container: HTMLElement) {
  const width = 640, height = 480;

  const xScale = d3.scaleLinear().domain([0, MAX_POINTS - 1]).range([0, width]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

  yChart = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Add title to the graph
  yChart.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .attr('fill', 'white')  // White color for the title
    .text('Vertical Gaze Movement (Y)');

  // Add X-axis
  yChart.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height - 20})`)
    .call(d3.axisBottom(xScale));

  // Add Y-axis
  yChart.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(40, 0)`)
    .call(d3.axisLeft(yScale));

  // Add Y-axis label
  yChart.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .attr('fill', 'white')  // White color for Y-axis label
    .text('Gaze Position (Y)');

  // Add path for the line
  yChart.append('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2);
}

// Function to create the Gaze Direction chart
export function createGazeDirectionChart(container: HTMLElement) {
  const width = 640, height = 480;

  const xScale = d3.scaleLinear().domain([-1, 1]).range([0, width]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

  gazeDirectionChart = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Add title to the graph
  gazeDirectionChart.append('text')
    .attr('x', width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .attr('fill', 'white')  // White color for the title
    .text('Gaze Direction');

  // Add X-axis
  gazeDirectionChart.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height - 20})`)
    .call(d3.axisBottom(xScale));

  // Add Y-axis
  gazeDirectionChart.append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(40, 0)`)
    .call(d3.axisLeft(yScale));

  // Add path for the line
  gazeDirectionChart.append('path')
    .attr('class', 'line')
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 2);
}

// Function to update the X chart
export function updateXChart(dataPoint: number) {
  xData.push(dataPoint);

  if (xData.length > MAX_POINTS) {
    xData.shift(); // Remove the oldest data point
  }

  const width = 640, height = 480;

  const xScale = d3.scaleLinear().domain([0, MAX_POINTS - 1]).range([0, width]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

  const line = d3.line<number>()
    .x((_, i) => xScale(i))
    .y(d => yScale(d));

  // Update the line path with new data
  xChart.select('.line')
    .datum(xData)
    .attr('d', line);
}

// Function to update the Y chart
export function updateYChart(dataPoint: number) {
  yData.push(dataPoint);

  if (yData.length > MAX_POINTS) {
    yData.shift(); // Remove the oldest data point
  }

  const width = 640, height = 480;

  const xScale = d3.scaleLinear().domain([0, MAX_POINTS - 1]).range([0, width]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

  const line = d3.line<number>()
    .x((_, i) => xScale(i))
    .y(d => yScale(d));

  // Update the line path with new data
  yChart.select('.line')
    .datum(yData)
    .attr('d', line);
}

// Function to update the Gaze Direction chart
export function updateGazeDirectionChart(gazeX: number, gazeY: number) {
  gazeDirectionData.push({ x: gazeX, y: gazeY });

  if (gazeDirectionData.length > MAX_POINTS) {
    gazeDirectionData.shift(); // Remove the oldest data point
  }

  const width = 640, height = 480;

  const xScale = d3.scaleLinear().domain([-1, 1]).range([0, width]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

  const line = d3.line<{ x: number, y: number }>()
    .x(d => xScale(d.x))  // Gaze X position
    .y(d => yScale(d.y)); // Gaze Y position

  gazeDirectionChart.select('.line')
    .datum(gazeDirectionData)
    .attr('d', line);
}

export function resetCharts() {
  // Reset data arrays
  xData = [];
  yData = [];
  gazeDirectionData = [];

  // Remove entire chart SVG elements
  if (xChart) {
    xChart.remove(); // Remove the entire X chart
    xChart = null; // Reset reference to null
  }

  if (yChart) {
    yChart.remove(); // Remove the entire Y chart
    yChart = null; // Reset reference to null
  }

  if (gazeDirectionChart) {
    gazeDirectionChart.remove(); // Remove the entire Gaze Direction chart
    gazeDirectionChart = null; // Reset reference to null
  }

  console.log("Charts have been reset and removed.");
}


