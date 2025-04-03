from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

@app.route('/update_table', methods=['POST'])
def update_table():
    try:
        data = request.get_json()
        print("Received table data:", data)  # Debugging
        return jsonify({"message": "Table updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
