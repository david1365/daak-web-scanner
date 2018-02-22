from flask import Flask
from daak.backend import web
from daak.backend.helper.decorator import crossdomain

app = Flask(__name__)


@app.route('/scanner/list')
@crossdomain(origin='*')
def list_scanner_names():
    return web.list_scanner_names()


@app.route('/scanner/<scanner_id>')
@crossdomain(origin='*')
def scan(scanner_id):
    return web.scan(scanner_id)