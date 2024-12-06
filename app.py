import os
import sys
from flask import Flask, render_template, send_from_directory, jsonify
from flask_cors import CORS

# Add project root to Python path
project_root = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, project_root)

app = Flask(__name__, 
            static_folder=os.path.join(project_root, 'src', 'static'), 
            template_folder=os.path.join(project_root, 'src', 'templates'))
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/algorithms')
def list_algorithms():
    algorithms = {
        'sorting': ['Bubble Sort', 'Quick Sort', 'Merge Sort'],
        'searching': ['Binary Search', 'Linear Search'],
        'graph': ['BFS', 'DFS']
    }
    return jsonify(algorithms)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('src/static', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("Starting Algorithm Visualizer...")
    print(f"Static folder: {app.static_folder}")
    print(f"Template folder: {app.template_folder}")
    app.run(debug=True, host='0.0.0.0', port=port)
