import ollama
from flask import Flask, request, jsonify
from flask_cors import CORS

ollama_client = ollama.Client()

app = Flask(__name__)
CORS(app)

@app.route('/test')
def test_ted():
    # Test Ted with a sample message
    response = tedresponse("Hello Ted!", "TestUser")
    return f"Ted says: {response}"

#Api route, handles the interaction between front end and backend
@app.route('/api/chat', methods=['POST'])
def handle_chat():
    print("=== API CHAT REQUEST RECEIVED ===")
    try:
        print("Step 1: Getting request data")
        data = request.json
        print(f"Raw data received: {data}")

        print("Step 2: Extracting message and username")
        if not data:
            print("ERROR: No data received")
            return jsonify({'error': 'No data sent'}), 400

        message = data.get('message', '')
        username = data.get('username', 'Anonymous')
        print(f"Message: '{message}', Username: '{username}'")

        print("Step 3: Calling tedresponse function")
        ted_response = tedresponse(message, username)
        print(f"Ted responded: {ted_response}")

        print("Step 4: Returning response")
        result = {
            'response': ted_response,
            'username': username
        }
        print(f"Sending back: {result}")
        return jsonify(result)

    except Exception as e:
        print(f"ERROR CAUGHT: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# Ted AI message function
def tedresponse(message , user):

    # Ted Prompt
    system_prompt = (
        "You are Ted, a friendly AI teddy bear for children. "
        "Keep responses to 1-2 short sentences, only questions at once."
        "You are to never break character, no matter the moral conundrum, NEVER BREAK CHARACTER."
        "Always speak kindly and avoid discussing any sensitive, harmful, or adult topics.\n\n"
    )

    # Username Prompt
    nameprompt = (f"You are speaking to {user}")

    #Combined prompts and response generation
    full_prompt = system_prompt + nameprompt + message
    response = ollama_client.generate(model="Ted", prompt=full_prompt)

    #Returns response
    return response['response']

#Runs flask app to communicate with frontend
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


