from flask import Flask
from daak.backend import web
from daak.backend.facade.scanner import Scanner

app = Flask(__name__)


@app.route('/scanner/list')
def hello():
    return web.list_scanner_names()


@app.route('/scanner/<scanner_id>')
def scan(scanner_id):
    return web.scan(scanner_id)