import requests
import json
import os
import argparse

LOGIN_TOKEN_URL = "/profile_info/"
LOGIN_URL = "/login"
DASHBOARD_URL = "/admin/"

class Uploader:

    def __init__(self, verify, domain):
        self.session = requests.session()
        self.verify = True
        self.domain = domain

    def connectionTest(self):
        try:
            r = self.session.get(self.domain+"/profile_info", verify=self.verify)
            return r.status_code
        except Exception:
            return 500

    def login(self, username, password):
        r = self.session.get(self.domain+LOGIN_TOKEN_URL, verify=self.verify)
        content = r.json()
        login_token = content["token"]

        payload = {'_csrf_token': login_token, 'username': username, 'password': password}
        r = self.session.post(self.domain + LOGIN_URL, data=payload, verify=self.verify)
        return r.status_code

    def createCategory(self, name):
        r = self.session.get(self.domain + DASHBOARD_URL + "category/new", verify=self.verify)
        category_token = r.text

        payload = {'_token': category_token, 'name': name, 'public': 'true'}
        r = self.session.post(self.domain + DASHBOARD_URL + "category/new", data=payload, verify=self.verify)

        return r.status_code

    def getCategoryId(self, name):
        r = self.session.get(self.domain + DASHBOARD_URL + "categories", verify=self.verify)
        categories = r.json()
        ids = [c['id'] for c in categories if c["name"] == name]
        return ids[0] if len(ids) > 0 else -1

    def createPhoto(self, catId, path, title):
        r = self.session.get(self.domain + DASHBOARD_URL + "photo/new", verify=self.verify)
        photo_token = r.text

        file = {'path': open(path, 'rb')}
        payload = {'_token': photo_token, 'title': title, 'category': catId, 'description': "", "original": "true", "quality": "100"}
        r = self.session.post(self.domain + DASHBOARD_URL + "photo/new", data=payload, files=file, verify=self.verify)

        return r.status_code


if __name__ == '__main__':

    parser = argparse.ArgumentParser(prog="Images uploader", description="Upload photos to the website. Every subfolder correspond to a new category, and all photos inside are imported within this category.")
    parser.add_argument("-c", "--collection", required=True, help="The path to the collection folder containing the categories' subfolder.")
    parser.add_argument("-d", "--domain", required=True, help="The Ip address of the domain name of the website. E.g. '192.168.50.122' or 'my-domain.com'")
    parser.add_argument("-s", "--security-certificate", help="The path to the certificate needed to verify the secured transaction. If not verification is disabled.")
    parser.add_argument("-v", "--verbose", action="store_true", help="Display progression of the uploading process.")
    parser.add_argument("-u", "--username", required=True, help="Username of the admin account.")
    parser.add_argument("-p", "--password", required=True, help="Password of the admin account.")

    args = parser.parse_args()

    verbose = args.verbose

    if verbose: print("starting : Images uploader\n")

    if args.security_certificate:
        verify = args.security_certificate
    else:
        verify=False
        print("No certificate : no verification of the server's certificate will be done.\n")

    if verbose: print("Starting connection to the webserver https://"+args.domain)
    uploader = Uploader(verify, "https://"+args.domain)
    code = uploader.connectionTest()
    if code >= 400:
        print("Error while contacting the webserver. ("+str(code)+")")
        exit(1)


    if verbose: print("Connection as : "+args.username)
    uploader.login(args.username, args.password)
    if code >= 400:
        print("Error while login in. ("+code+")")
        exit(1)

    if verbose: print("Scanning Collection folder")
    curentDir = args.collection

    # collection = {}

    for dir in os.listdir(args.collection):
        curentDir = args.collection+dir
        if os.path.isdir(curentDir):
            # collection[dir] = []
            catId = uploader.getCategoryId(dir)
            if catId == -1:
                if uploader.createCategory(dir) >= 400:
                    print("Error while creating the category : "+dir)
                    exit(1)
                catId = uploader.getCategoryId(dir)
            for f in os.listdir(curentDir):
                currentFile = curentDir+'/'+f
                if os.path.isfile(currentFile):
                    # collection[dir].append({"name":f, "path": currentFile})
                    if uploader.createPhoto(catId, currentFile, f) >= 400:
                        print("Error while creating the photo : "+currentFile)
                        exit(1)



    # TODO: progress bar

    # for category, photos in collection:
    #     catId = uploader.getCategoryId(category)
    #     if catId == -1:
    #         uploader.createCategory(category)
    #         catId = uploader.getCategoryId(category)

    #     for photo in photos:
    #         uploader.createPhoto(catId, photo["path"], photo["name"])
            