from daak.backend.facade.scanner import Scanner


def check_scanner_id(scanner_id):
    scanner = Scanner()
    scanners = scanner.list_scanner_names()

    result = False
    for scanner in scanners:
        if scanner['id'] == scanner_id:
            result = True
            break

    return result
