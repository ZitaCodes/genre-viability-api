from flask import Flask, request, jsonify
from scraper import get_amazon_search_results

app = Flask(__name__)

@app.route("/check-genre", methods=["POST"])
def check_genre():
    data = request.get_json()
    query = data.get("query")
    subject = data.get("subject", None)

    if not query:
        return jsonify({"error": "Query is required"}), 400

    results = get_amazon_search_results(query, subject)
    return jsonify({"books": results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
