from flask import Flask

from imagescanner import ImageScanner, settings

# import imagescanner.backends.sane
# import imagescanner.backends.net
# import imagescanner.backends.test


# settings.ENABLE_TEST_BACKEND = False
# settings.ENABLE_NET_BACKEND = False


app = Flask(__name__)


@app.route('/')
def hello():
    return "Hello World!"

@app.route('/scan/<fileName>')
def show_user_profile(fileName):
    iscanner = ImageScanner()

    # get all available devices
    scanners = iscanner.list_scanners()

    print "======================" + scanners[0]._source_name + "---" + scanners[0].id

    # choose one of the devices
    scanner = scanners[0]


    # scan your file (returns a PIL object)
    im = scanner.scan()

    im.save("e:\\" + fileName + ".jpg", "JPEG")

    return fileName + ">> succes scan >>----"


# show_user_profile('ali maamd')
if __name__ == '__main__':
    app.run()