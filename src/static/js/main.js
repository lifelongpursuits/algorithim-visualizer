document.addEventListener('DOMContentLoaded', () => {
    const algorithmCategories = document.querySelectorAll('.algorithm-category li');
    const startBtn = document.getElementById('start-btn');
    const stepBtn = document.getElementById('step-btn');
    const resetBtn = document.getElementById('reset-btn');
    const svg = d3.select('#algorithm-svg');
    const algorithmName = document.getElementById('algorithm-name');
    const algorithmExplanation = document.getElementById('algorithm-explanation');
    const algorithmCodeSnippet = document.getElementById('algorithm-code-snippet');
    const timeComplexityDetails = document.getElementById('time-complexity-details');
    const spaceComplexityDetails = document.getElementById('space-complexity-details');

    let currentAlgorithm = null;
    let currentAlgorithmKey = null;

    // Comprehensive Algorithm Details
    const algorithmDetails = {
        'bubble-sort': {
            name: 'Bubble Sort',
            description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
            codeSnippet: `
                def bubble_sort(arr):
                    n = len(arr)
                    for i in range(n):
                        # Last i elements are already in place
                        for j in range(0, n-i-1):
                            # Swap if the element found is greater
                            if arr[j] > arr[j+1]:
                                arr[j], arr[j+1] = arr[j+1], arr[j]
                    return arr

                # Example usage
                numbers = [64, 34, 25, 12, 22, 11, 90]
                sorted_numbers = bubble_sort(numbers)
                print(sorted_numbers)  # Output: [11, 12, 22, 25, 34, 64, 90]
            `,
            complexity: {
                time: 'O(n²)',
                space: 'O(1)'
            },
            data: [64, 34, 25, 12, 22, 11, 90],
            steps: [
                'Compare adjacent elements',
                'Swap if in wrong order',
                'Repeat until no swaps needed'
            ],
            visualization: 'comparison-sort'
        },
        'quick-sort': {
            name: 'Quick Sort',
            description: 'Quick Sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy by selecting a pivot and partitioning the array.',
            codeSnippet: `
                def quick_sort(arr):
                    if len(arr) <= 1:
                        return arr
    
                    # Choose the rightmost element as pivot
                    pivot = arr[-1]
    
                    # Partition the array
                    smaller = [x for x in arr[:-1] if x <= pivot]
                    larger = [x for x in arr[:-1] if x > pivot]
    
                    # Recursively sort sub-arrays
                    return quick_sort(smaller) + [pivot] + quick_sort(larger)

                # Example usage
                numbers = [64, 34, 25, 12, 22, 11, 90]
                sorted_numbers = quick_sort(numbers)
                print(sorted_numbers)  # Output: [11, 12, 22, 25, 34, 64, 90]
            `,
            complexity: {
                time: 'O(n log n)',
                space: 'O(log n)'
            },
            data: [64, 34, 25, 12, 22, 11, 90],
            steps: [
                'Choose a pivot element',
                'Partition array around pivot',
                'Recursively sort sub-arrays'
            ],
            visualization: 'divide-conquer'
        },
        'merge-sort': {
            name: 'Merge Sort',
            description: 'Merge Sort is a divide-and-conquer algorithm that breaks down an array into smaller subarrays, sorts them, and then merges them back together.',
            codeSnippet: `
                def merge_sort(arr):
                    # Base case: if array has 1 or fewer elements, it's already sorted
                    if len(arr) <= 1:
                        return arr
    
                    # Divide the array into two halves
                    mid = len(arr) // 2
                    left = arr[:mid]
                    right = arr[mid:]
    
                    # Recursively sort both halves
                    left = merge_sort(left)
                    right = merge_sort(right)
    
                    # Merge the sorted halves
                    return merge(left, right)

                def merge(left, right):
                    result = []
                    i, j = 0, 0
    
                    # Compare and merge elements from both lists
                    while i < len(left) and j < len(right):
                        if left[i] <= right[j]:
                            result.append(left[i])
                            i += 1
                        else:
                            result.append(right[j])
                            j += 1
    
                    # Add remaining elements
                    result.extend(left[i:])
                    result.extend(right[j:])
    
                    return result

                # Example usage
                numbers = [64, 34, 25, 12, 22, 11, 90]
                sorted_numbers = merge_sort(numbers)
                print(sorted_numbers)  # Output: [11, 12, 22, 25, 34, 64, 90]
            `,
            complexity: {
                time: 'O(n log n)',
                space: 'O(n)'
            },
            data: [64, 34, 25, 12, 22, 11, 90],
            steps: [
                'Divide array into two halves',
                'Recursively sort each half',
                'Merge sorted halves'
            ],
            visualization: 'divide-conquer'
        },
        'binary-search': {
            name: 'Binary Search',
            description: 'Binary Search is an efficient algorithm for finding an item in a sorted array by repeatedly dividing the search interval in half.',
            codeSnippet: `
                def binary_search(arr, target):
                    left, right = 0, len(arr) - 1
    
                    while left <= right:
                        # Find the middle index
                        mid = (left + right) // 2
        
                        # Check if target is present at mid
                        if arr[mid] == target:
                            return mid
        
                        # If target is greater, ignore left half
                        elif arr[mid] < target:
                            left = mid + 1
        
                        # If target is smaller, ignore right half
                        else:
                            right = mid - 1
    
                    # Target was not found
                    return -1

                # Example usage
                sorted_array = [11, 22, 25, 34, 64, 90]
                target = 34
                index = binary_search(sorted_array, target)
                print(f"Target {target} found at index: {index}")  # Output: Target 34 found at index: 4
            `,
            complexity: {
                time: 'O(log n)',
                space: 'O(1)'
            },
            data: [11, 22, 25, 34, 64, 90],
            steps: [
                'Find the middle element',
                'Compare target with middle',
                'Eliminate half of the array',
                'Repeat until found'
            ],
            visualization: 'search'
        },
        'insertion-sort': {
            name: 'Insertion Sort',
            description: 'Insertion Sort builds the final sorted array one item at a time, efficiently sorting small datasets.',
            codeSnippet: `
                def insertion_sort(arr):
                    for i in range(1, len(arr)):
                        key = arr[i]
                        j = i - 1
        
                        # Move elements of arr[0..i-1] that are greater than key
                        # to one position ahead of their current position
                        while j >= 0 and arr[j] > key:
                            arr[j + 1] = arr[j]
                            j -= 1
                        arr[j + 1] = key
                    return arr
            `,
            complexity: {
                time: 'O(n²)',
                space: 'O(1)'
            },
            data: [64, 34, 25, 12, 22, 11, 90],
            steps: [
                'Insert each element into sorted portion',
                'Shift elements greater than key',
                'Repeat until all elements inserted'
            ],
            visualization: 'insertion-sort'
        },
        'selection-sort': {
            name: 'Selection Sort',
            description: 'Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist, repeatedly finding the minimum element.',
            codeSnippet: `
                def selection_sort(arr):
                    for i in range(len(arr)):
                        # Find the minimum element in remaining unsorted array
                        min_idx = i
                        for j in range(i+1, len(arr)):
                            if arr[min_idx] > arr[j]:
                                min_idx = j
        
                        # Swap the found minimum element with the first element
                        arr[i], arr[min_idx] = arr[min_idx], arr[i]
                    return arr
            `,
            complexity: {
                time: 'O(n²)',
                space: 'O(1)'
            },
            data: [64, 34, 25, 12, 22, 11, 90],
            steps: [
                'Find the minimum element',
                'Swap with the first element',
                'Repeat until all elements sorted'
            ],
            visualization: 'selection-sort'
        },
        'linear-search': {
            name: 'Linear Search',
            description: 'Linear Search sequentially checks each element in the list until a match is found or the whole list has been searched.',
            codeSnippet: `
                def linear_search(arr, target):
                    for i in range(len(arr)):
                        if arr[i] == target:
                            return i
                    return -1
            `,
            complexity: {
                time: 'O(n)',
                space: 'O(1)'
            },
            data: [64, 34, 25, 12, 22, 11, 90],
            steps: [
                'Check each element in the list',
                'Return index if match found',
                'Return -1 if not found'
            ],
            visualization: 'linear-search'
        },
        'depth-first-search': {
            name: 'Depth-First Search (DFS)',
            description: 'Depth-First Search is an algorithm for traversing or searching tree or graph data structures by exploring as far as possible along each branch before backtracking.',
            codeSnippet: `
                def dfs(graph, start, visited=None):
                    if visited is None:
                        visited = set()
                    visited.add(start)
    
                    for next in graph[start] - visited:
                        dfs(graph, next, visited)
                    return visited
            `,
            complexity: {
                time: 'O(V + E)',
                space: 'O(V)'
            },
            data: {
                'A': ['B', 'C'],
                'B': ['A', 'D', 'E'],
                'C': ['A', 'F'],
                'D': ['B'],
                'E': ['B', 'F'],
                'F': ['C', 'E']
            },
            steps: [
                'Start at a given node',
                'Explore as far as possible',
                'Backtrack and explore other branches'
            ],
            visualization: 'dfs'
        }
    };

    class AlgorithmVisualizer {
        constructor(svg, algorithmKey) {
            this.svg = svg;
            this.algorithmKey = algorithmKey;
            this.details = algorithmDetails[algorithmKey];
            this.width = parseInt(svg.style('width'));
            this.height = parseInt(svg.style('height'));
            this.margin = { top: 50, right: 20, bottom: 50, left: 50 };
            this.currentView = 'complexity';
            this.currentStepIndex = 0;
        }

        clearVisualization() {
            this.svg.selectAll("*").remove();
        }

        renderComplexityGraph() {
            this.clearVisualization();
            
            const width = this.width - this.margin.left - this.margin.right;
            const height = this.height - this.margin.top - this.margin.bottom;

            const g = this.svg.append('g')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

            // Complexity data
            const complexityData = [
                { type: 'Time', complexity: this.details.complexity.time, value: this.mapComplexity(this.details.complexity.time) },
                { type: 'Space', complexity: this.details.complexity.space, value: this.mapComplexity(this.details.complexity.space) }
            ];

            // X Scale
            const x = d3.scaleBand()
                .domain(complexityData.map(d => d.type))
                .range([0, width])
                .padding(0.1);

            // Y Scale
            const y = d3.scaleLinear()
                .domain([0, 6])
                .range([height, 0]);

            // Bars
            const bars = g.selectAll('.complexity-bar')
                .data(complexityData)
                .enter().append('g');

            bars.append('rect')
                .attr('x', d => x(d.type))
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value))
                .attr('fill', d => d.type === 'Time' ? '#4a90e2' : '#2ecc71');

            // Bar labels
            bars.append('text')
                .attr('x', d => x(d.type) + x.bandwidth() / 2)
                .attr('y', d => y(d.value) - 10)
                .attr('text-anchor', 'middle')
                .style('fill', 'white')
                .text(d => d.complexity);

            // X Axis with labels
            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .style('fill', 'white');

            // Y Axis with labels
            g.append('g')
                .call(d3.axisLeft(y)
                    .tickFormat(d => {
                        const complexityMap = {
                            1: 'O(1)',
                            2: 'O(log n)',
                            3: 'O(n)',
                            4: 'O(n log n)',
                            5: 'O(n²)'
                        };
                        return complexityMap[d] || '';
                    })
                )
                .selectAll('text')
                .style('fill', 'white');

            // Title
            this.svg.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.margin.top / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('fill', 'white')
                .text(`${this.details.name} Complexity`);
        }

        renderAlgorithmSteps() {
            this.clearVisualization();

            const width = this.width - this.margin.left - this.margin.right;
            const height = this.height - this.margin.top - this.margin.bottom;

            const g = this.svg.append('g')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

            // Steps visualization
            const stepData = this.details.steps.map((step, i) => ({
                step: step,
                index: i + 1,
                active: i < this.currentStepIndex + 1
            }));

            // Y Scale
            const y = d3.scaleBand()
                .domain(stepData.map(d => d.index))
                .range([0, height])
                .padding(0.1);

            // Steps
            const steps = g.selectAll('.algorithm-step')
                .data(stepData)
                .enter().append('g')
                .attr('class', 'algorithm-step')
                .attr('transform', d => `translate(0,${y(d.index)})`);

            // Step Circles
            steps.append('circle')
                .attr('cx', 10)
                .attr('cy', y.bandwidth() / 2)
                .attr('r', 10)
                .attr('fill', d => d.active ? '#4a90e2' : '#666');

            // Step Text
            steps.append('text')
                .attr('x', 30)
                .attr('y', y.bandwidth() / 2)
                .attr('dy', '.35em')
                .style('fill', d => d.active ? 'white' : '#999')
                .text(d => d.step);

            // Title
            this.svg.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.margin.top / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('fill', 'white')
                .text(`${this.details.name} Steps`);
        }

        renderInitialVisualization(data) {
            this.clearVisualization();

            const width = this.width - this.margin.left - this.margin.right;
            const height = this.height - this.margin.top - this.margin.bottom;

            const g = this.svg.append('g')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

            // Data visualization
            const x = d3.scaleBand()
                .domain(data.map((d, i) => i))
                .range([0, width])
                .padding(0.1);

            // Bars
            const bars = g.selectAll('.data-bar')
                .data(data)
                .enter().append('rect')
                .attr('x', (d, i) => x(i))
                .attr('width', x.bandwidth())
                .attr('y', height - 10)
                .attr('height', 10)
                .attr('fill', '#4a90e2');

            // Title
            this.svg.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.margin.top / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('fill', 'white')
                .text(`${this.details.name} Data`);
        }

        mapComplexity(complexity) {
            switch(complexity) {
                case 'O(1)': return 1;
                case 'O(log n)': return 2;
                case 'O(n)': return 3;
                case 'O(n log n)': return 4;
                case 'O(n²)': return 5;
                default: return 3;
            }
        }

        start() {
            // Toggle between complexity and steps visualization
            if (this.currentView === 'complexity') {
                this.renderAlgorithmSteps();
                this.currentView = 'steps';
            } else {
                this.renderComplexityGraph();
                this.currentView = 'complexity';
                this.currentStepIndex = 0;
            }
        }

        step() {
            // Progress through algorithm steps
            if (this.currentView === 'steps') {
                if (this.currentStepIndex < this.details.steps.length - 1) {
                    this.currentStepIndex++;
                    this.renderAlgorithmSteps();
                }
            }
        }

        reset() {
            // Reset to initial state
            if (this.currentView === 'steps') {
                this.currentStepIndex = 0;
                this.renderAlgorithmSteps();
            } else {
                this.renderComplexityGraph();
            }
        }

        initialize() {
            this.renderComplexityGraph();
        }
    }

    // Algorithm selection
    algorithmCategories.forEach(algo => {
        algo.addEventListener('click', () => {
            const algorithmKey = algo.dataset.algo;
            
            // Update description
            if (algorithmDetails[algorithmKey]) {
                const details = algorithmDetails[algorithmKey];
                
                // Update algorithm name and explanation
                algorithmName.textContent = details.name;
                algorithmExplanation.textContent = details.description;
                
                // Update code snippet
                algorithmCodeSnippet.textContent = details.codeSnippet;
                
                // Update complexity details
                timeComplexityDetails.innerHTML = `
                    <li>
                        <strong>Time Complexity:</strong>
                        <p>${details.complexity.time}</p>
                    </li>
                `;
                spaceComplexityDetails.innerHTML = `
                    <li>
                        <strong>Space Complexity:</strong>
                        <p>${details.complexity.space}</p>
                    </li>
                `;
                
                // Initialize visualization immediately
                currentAlgorithm = new AlgorithmVisualizer(svg, algorithmKey);
                
                // Render initial complexity graph
                currentAlgorithm.renderComplexityGraph();
            } else {
                console.error(`Algorithm ${algorithmKey} not found`);
            }
        });
    });

    // Visualization controls
    startBtn.addEventListener('click', () => {
        if (currentAlgorithm) {
            currentAlgorithm.start();
        }
    });

    stepBtn.addEventListener('click', () => {
        if (currentAlgorithm) {
            currentAlgorithm.step();
        }
    });

    resetBtn.addEventListener('click', () => {
        if (currentAlgorithm) {
            currentAlgorithm.reset();
        }
    });
});
