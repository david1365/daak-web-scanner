import logging
import base64
import cStringIO

# from flask import send_file

from daak.backend.facade.scanner import Scanner
from daak.backend.helper.decorator import to_json
from enum import Enum

from daak.backend.helper.validation import check_scanner_id


class Status(Enum):
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


@to_json
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

    return Response(data=data, status=status, message=message)

@to_json
def scan(scanner_id):
    scanner = Scanner()
    data = None
    status = Status.OK
    message = None

    if not scanner_id or scanner_id == 'undefined':
        return Response(data=data, status=Status.EROOR, message='Please set scanner id!')

    if not check_scanner_id(scanner_id):
        return Response(data=data, status=Status.EROOR, message='Scanner Id is incorrect!')

    try:
        image = scanner.scan(scanner_id)
        buffer = cStringIO.StringIO()
        image.save(buffer, format="PNG")
        data = base64.b64encode(buffer.getvalue())

    #TODO: select one of them
    # buffer.seek(0)
    # return send_file(buffer, mimetype='image/png')
    except Exception, exc:
        status = Status.EROOR
        message = exc
        # logging.debug(exc)

    return Response(data=data, status=status, message=message)

