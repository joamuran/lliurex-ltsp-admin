#!/usr/bin/env python

from navigator import *
import os
import urllib
from xmlrpclib import *


class LliureXLTSPAdmin:
    server = ''
    connection_user = ''
    
    def __init__(self):
        print ("Created LliureX LTSP Admin")
        self.server = ServerProxy("https://localhost:9779")
        self.connection_user = ("joamuran","lliurex")

    def on_navigation_requested(self, view, frame, req, data=None):
        uri = req.get_uri()
        url=uri.split(':')
        scheme=url[0]
        print "scheme: "
        print scheme
        args=url[1].split('/')
        print "args: "
        print args

        if scheme == 'ltsp':
            function=args[2]
            print "function:"
            print function
            if function == 'getValue':
                status=self.server.getStatus(self.connection_user,"LliureXLTSP")
                browser.view.execute_script
                browser.execute_script("setStatus('"+status+"')")
                return True
            else:
                if function == 'setValue':
                    status=args[3]
                    self.server.setStatus(self.connection_user,"LliureXLTSP",status)
                    browser.execute_script("setStatus('')")
                    return True
                else:
                    return False
            return False;


if __name__ == "__main__":
    
    
   browser = Browser()
   ltspadmin = LliureXLTSPAdmin()
   
   browser.connectEvents("navigation-requested", ltspadmin.on_navigation_requested)
   #browser.view.connect("navigation-requested", ltspadmin.on_navigation_requested)
    
   file = os.path.abspath('index.html')
   uri = 'file://' + urllib.pathname2url(file)
   ## print ("Goint to "+uri)
   print uri
   browser.open_url(uri)   
    #browser.open_url("file:///home/joamuran/appjs/nav/n4d_appjs/data/content/index.html")   
   Gtk.main()
    #gtk.gdk.threads_init()
    #thread.start_new_thread(gtk.main, ())
    #browser.webview.execute_script('saluda()')


