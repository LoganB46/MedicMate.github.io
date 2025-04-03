from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Store table data in memory (Replace with database or Google Sheets in production)
table_data = [
    ["Hospital", "Status", "Notes"],
    ["Saraland Freestanding ED", "Clear", "N/A"],
    ["University Hospital", "Clear", "Notes"],
    ["Mobile Infirmary", "Clear", "Notes"],
    ["Springhill Hospital", "Clear", "NO ORTHO"],
    ["Providence", "Clear", "Notes"]
]

# Route to get table data
@app.route('/get_table', methods=['GET'])
def get_table():
    return jsonify({"tableData": table_data})  # Return updated table data

# Route to update table data
@app.route('/update_table', methods=['POST'])
def update_table():
    global table_data  # Allow updates
    try:
        data = request.get_json()
        table_data = data["tableData"]  # Update stored table data
        print("Updated table data:", table_data)
        return jsonify({"message": "Table updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
