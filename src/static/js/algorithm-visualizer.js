class AlgorithmVisualizer {
    constructor(svgElement, algorithmType) {
        // Ensure svgElement is a D3 selection
        this.svgElement = d3.select(svgElement.node ? svgElement.node() : svgElement);
        this.algorithmType = algorithmType;
        this.currentStep = 0;
        this.steps = [];
        this.isRunning = false;
        this.viewMode = 'default'; // 'default' or 'step-by-step'
        
        // DOM elements
        this.stepListContainer = document.getElementById('step-list-container');
        this.stepList = document.getElementById('step-list');

        // Ensure SVG is properly set up
        this.setupSVG();

        // Initialize based on algorithm type
        this.initialize();
    }

    setupSVG() {
        // Ensure SVG has proper dimensions and is ready for rendering
        this.svgElement
            .attr('width', '100%')
            .attr('height', 300)
            .attr('viewBox', '0 0 600 300')
            .style('background-color', '#1e1e1e');
    }

    initialize() {
        // Clear previous visualization and step list
        this.svgElement.selectAll('*').remove();
        if (this.stepList) {
            this.stepList.innerHTML = '';
        }
        if (this.stepListContainer) {
            this.stepListContainer.style.display = 'none';
        }
        this.currentStep = 0;
        this.viewMode = 'default';

        // Set up initial state based on algorithm type
        switch(this.algorithmType) {
            case 'bubble-sort':
                this.initializeBubbleSort();
                break;
            case 'quick-sort':
                this.initializeQuickSort();
                break;
            case 'merge-sort':
                this.initializeMergeSort();
                break;
            case 'binary-search':
                this.initializeBinarySearch();
                break;
            default:
                console.error('Unknown algorithm type');
        }
    }

    initializeBubbleSort() {
        // Sample data for bubble sort visualization
        this.data = [64, 34, 25, 12, 22, 11, 90];
        this.steps = this.generateBubbleSortSteps(this.data);
        this.renderComplexityGraph();
        this.renderInitialVisualization(this.data);
    }

    initializeQuickSort() {
        // Sample data for quick sort visualization
        this.data = [64, 34, 25, 12, 22, 11, 90];
        this.steps = this.generateQuickSortSteps(this.data);
        this.renderComplexityGraph();
        this.renderInitialVisualization(this.data);
    }

    initializeMergeSort() {
        // Sample data for merge sort visualization
        this.data = [64, 34, 25, 12, 22, 11, 90];
        this.steps = this.generateMergeSortSteps(this.data);
        this.renderComplexityGraph();
        this.renderInitialVisualization(this.data);
    }

    initializeBinarySearch() {
        // Sample sorted data for binary search
        this.data = [11, 12, 22, 25, 34, 64, 90];
        this.target = 34;
        this.steps = this.generateBinarySearchSteps(this.data, this.target);
        this.renderComplexityGraph();
        this.renderInitialVisualization(this.data);
    }

    renderInitialVisualization(data) {
        // Time complexity visualization
        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

        // Clear previous visualization
        this.svgElement.selectAll('*').remove();

        // Complexity data based on algorithm type
        const complexityData = this.getComplexityData(this.algorithmType);

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, complexityData.length - 1])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(complexityData, d => d.complexity)])
            .range([height - margin.bottom, margin.top]);

        // Create line generator
        const line = d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d.complexity));

        // Add X axis
        this.svgElement.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickFormat((d, i) => complexityData[i].inputSize)
            )
            .selectAll('text')
            .style('fill', '#e0e0e0');

        // Add Y axis
        this.svgElement.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .style('fill', '#e0e0e0');

        // Add line path
        this.svgElement.append('path')
            .datum(complexityData)
            .attr('fill', 'none')
            .attr('stroke', '#4a90e2')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Add data points
        this.svgElement.selectAll('.dot')
            .data(complexityData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', (d, i) => xScale(i))
            .attr('cy', d => yScale(d.complexity))
            .attr('r', 5)
            .attr('fill', '#4a90e2');

        // Add title
        this.svgElement.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top)
            .attr('text-anchor', 'middle')
            .style('fill', '#e0e0e0')
            .style('font-size', '16px')
            .text(`Time Complexity: ${this.algorithmType.replace('-', ' ').toUpperCase()}`);

        // X-axis label
        this.svgElement.append('text')
            .attr('x', width / 2)
            .attr('y', height)
            .attr('text-anchor', 'middle')
            .style('fill', '#e0e0e0')
            .text('Input Size');

        // Y-axis label
        this.svgElement.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .style('fill', '#e0e0e0')
            .text('Time Complexity');
    }

    renderComplexityGraph() {
        // Time complexity visualization
        const width = 600;
        const height = 300;
        const margin = { top: 40, right: 20, bottom: 50, left: 70 };

        // Clear previous visualization
        this.svgElement.selectAll('*').remove();

        // Complexity data based on algorithm type
        const complexityData = this.getComplexityData(this.algorithmType);

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, complexityData.length - 1])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLog()
            .domain([1, d3.max(complexityData, d => d.complexity)])
            .range([height - margin.bottom, margin.top]);

        // Create line generator
        const line = d3.line()
            .x((d, i) => xScale(i))
            .y(d => yScale(d.complexity));

        // Create SVG group
        const g = this.svgElement.append('g');

        // Add X axis
        g.append('g')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(xScale)
                .tickFormat((d, i) => complexityData[i].inputSize)
            )
            .selectAll('text')
            .style('fill', '#e0e0e0');

        // Add Y axis (log scale)
        g.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale)
                .tickFormat(d3.format('.0f'))
            )
            .selectAll('text')
            .style('fill', '#e0e0e0');

        // Add line path
        g.append('path')
            .datum(complexityData)
            .attr('fill', 'none')
            .attr('stroke', '#4a90e2')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Add data points
        g.selectAll('.dot')
            .data(complexityData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', (d, i) => xScale(i))
            .attr('cy', d => yScale(d.complexity))
            .attr('r', 5)
            .attr('fill', '#4a90e2');

        // Add title
        this.svgElement.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('fill', '#e0e0e0')
            .style('font-size', '16px')
            .text(`Time Complexity: ${this.algorithmType.replace('-', ' ').toUpperCase()}`);

        // X-axis label
        this.svgElement.append('text')
            .attr('x', width / 2)
            .attr('y', height)
            .attr('text-anchor', 'middle')
            .style('fill', '#e0e0e0')
            .text('Input Size');

        // Y-axis label
        this.svgElement.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .style('fill', '#e0e0e0')
            .text('Time Complexity (log scale)');
    }

    getComplexityData(algorithmType) {
        // Generate complexity data based on algorithm type
        switch(algorithmType) {
            case 'bubble-sort':
            case 'selection-sort':
            case 'insertion-sort':
                return [
                    { inputSize: '10', complexity: 100 },
                    { inputSize: '100', complexity: 10000 },
                    { inputSize: '1000', complexity: 1000000 },
                    { inputSize: '10000', complexity: 100000000 }
                ];
            case 'quick-sort':
            case 'merge-sort':
                return [
                    { inputSize: '10', complexity: 30 },
                    { inputSize: '100', complexity: 660 },
                    { inputSize: '1000', complexity: 9900 },
                    { inputSize: '10000', complexity: 132000 }
                ];
            case 'binary-search':
            case 'linear-search':
                return [
                    { inputSize: '10', complexity: 10 },
                    { inputSize: '100', complexity: 100 },
                    { inputSize: '1000', complexity: 1000 },
                    { inputSize: '10000', complexity: 10000 }
                ];
            case 'depth-first-search':
                return [
                    { inputSize: '10', complexity: 50 },
                    { inputSize: '100', complexity: 5000 },
                    { inputSize: '1000', complexity: 500000 },
                    { inputSize: '10000', complexity: 50000000 }
                ];
            default:
                return [
                    { inputSize: '10', complexity: 10 },
                    { inputSize: '100', complexity: 100 },
                    { inputSize: '1000', complexity: 1000 },
                    { inputSize: '10000', complexity: 10000 }
                ];
        }
    }

    // Step-by-step methods
    step() {
        if (this.currentStep < this.steps.length) {
            this.applyStep(this.steps[this.currentStep]);
            this.currentStep++;
            return true;
        }
        return false;
    }

    start() {
        this.isRunning = true;
        while (this.step()) {}
        this.isRunning = false;
    }

    reset() {
        this.initialize();
    }

    // View mode toggle
    showStepView() {
        this.viewMode = 'step-by-step';
        this.stepListContainer.style.display = 'block';
        
        // Populate step list
        this.stepList.innerHTML = '';
        this.steps.forEach((step, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = step.description || `Step ${index + 1}`;
            
            // Highlight current step
            if (index === this.currentStep - 1) {
                listItem.style.fontWeight = 'bold';
                listItem.style.color = 'orange';
            }
            
            this.stepList.appendChild(listItem);
        });

        this.highlightCurrentStep();
    }

    highlightCurrentStep() {
        // Add visual indication of current step
        this.svgElement.selectAll('rect')
            .attr('fill', 'steelblue');

        if (this.currentStep > 0 && this.currentStep <= this.steps.length) {
            const currentStepData = this.steps[this.currentStep - 1];
            
            // Highlight elements involved in the current step
            if (currentStepData.highlight) {
                currentStepData.highlight.forEach(index => {
                    this.svgElement.selectAll('rect')
                        .filter((d, i) => i === index)
                        .attr('fill', 'orange');
                });
            }
        }
    }

    // Step generation methods (simplified examples)
    generateBubbleSortSteps(arr) {
        const steps = [];
        const n = arr.length;
        const copyArr = [...arr];

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                steps.push({
                    type: 'compare',
                    highlight: [j, j+1],
                    description: `Comparing ${copyArr[j]} and ${copyArr[j+1]}`
                });

                if (copyArr[j] > copyArr[j+1]) {
                    steps.push({
                        type: 'swap',
                        highlight: [j, j+1],
                        description: `Swapping ${copyArr[j]} and ${copyArr[j+1]}`
                    });
                    
                    // Swap
                    [copyArr[j], copyArr[j+1]] = [copyArr[j+1], copyArr[j]];
                }
            }
        }

        return steps;
    }

    // Placeholder methods for other sorting/searching algorithms
    generateQuickSortSteps(arr) { 
        return [{
            type: 'info',
            description: 'Quick Sort implementation coming soon'
        }]; 
    }

    generateMergeSortSteps(arr) { 
        return [{
            type: 'info',
            description: 'Merge Sort implementation coming soon'
        }]; 
    }

    generateBinarySearchSteps(arr, target) { 
        return [{
            type: 'info',
            description: 'Binary Search implementation coming soon'
        }]; 
    }

    applyStep(step) {
        // Visual representation of the current step
        console.log(step.description);
        this.highlightCurrentStep();

        // Update step list if in step-by-step mode
        if (this.viewMode === 'step-by-step') {
            this.showStepView();
        }
    }
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlgorithmVisualizer;
}
