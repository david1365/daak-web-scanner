from flask import Flask, request, jsonify

from daak.backend.helper.decorator import crossdomain

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello Test'

@app.route('/get', methods=['GET'])
@crossdomain(origin='*')
def get():
    return "ok"


@app.route('/get_params', methods=['GET'])
@crossdomain(origin='*')
def get_with_params():
    return request.args.get('test1');


@app.route('/post', methods=['POST'])
@crossdomain(origin='*')
def post():
    return "ok"


@app.route('/post_params', methods=['POST'])
@crossdomain(origin='*')
def post_with_params():
    return request.form.get('test1');


@app.route('/json', methods=['GET'])
@crossdomain(origin='*')
def json():
    return jsonify({'a': 21, 'b': 'ali'})



if __name__ == '__main__':
    app.run(debug=True, port=1010)