from daak.backend.imagescanner.core._imagescanner import ImageScanner


class Scanner(object):
    def __init__(self, **kwargs):
        self.imagescanner = ImageScanner()

    def list_scanners(self):
        return self.imagescanner.list_scanners()

    def get_scanner(self, scanner_id):
        return self.imagescanner.get_scanner(scanner_id)

    def scan(self, scanner_id):
        return self.imagescanner.scan(scanner_id)

    def list_scanner_names(self):
        scanner_names = []
        scanners = self.imagescanner.list_scanners()

        for scanner in scanners:
            scanner_names.append({"id": scanner.id, "name": scanner._source_name})

        return scanner_names