import logging
import base64
import cStringIO

from flask import jsonify
from daak.backend.facade.scanner import Scanner

#TODO: inherit from enum
# from enum import Enum

#TODO: inherit from enum
class Status:
    OK = 0
    EROOR = 1

class Response(object):
    def __init__(self, data=None, status=None, message=None):
        self._data = data
        self._status = status
        self._message = message

    def set_data(self, data):
        self._data = data

    def set_status(self, status):
        self._status = status

    def set_message(self, message):
        self._message = message

    def json_serialize(self):
        return self.__dict__


def list_scanner_names():
    scanner = Scanner()
    data = None
    status = Status.OK
    message = None

    try:
        data = scanner.list_scanner_names()
    except Exception, exc:
        status = Status.EROOR
        message = exc
        logging.debug(exc)

    response = Response(data=data, status=status, message=message)
    return jsonify(response.json_serialize())


def scan(scanner_id):
    scanner = Scanner()
    data = None
    status = Status.OK
    message = None

    try:
        image = scanner.scan(scanner_id)
        buffer = cStringIO.StringIO()
        image.save(buffer, format="JPEG")
        data = base64.b64encode(buffer.getvalue())
    except Exception, exc:
        status = Status.EROOR
        message = exc
        logging.debug(exc)

    response = Response(data=data, status=status, message=message)
    return jsonify(response.json_serialize())

