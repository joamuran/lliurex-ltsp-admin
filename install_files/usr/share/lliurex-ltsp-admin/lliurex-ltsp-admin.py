#!/usr/bin/env python

from navigator import *
import os
import urllib

class LliureXLTSPAdmin:
    def __init__(self):
        print ("Created LliureX LTSP Admin")

    def on_navigation_requested(self, view, frame, req, data=None):
        uri = req.get_uri()
        #scheme, path=uri.split(':', 1)
        url=uri.split(':')
        scheme=url[0]
        print "scheme: "
        print scheme
        args=url[1].split('/')
        print "args: "
        print args
        #args=path.split('/', 1)
        if scheme == 'ltsp':
            if args[2] == 'setValue':
                browser.webview.execute_script("saluda()")
                #self.on_combo_selected(path) 
                return True
            else:
                if args[2] == 'getValue':
                    browser.webview.execute_script("alert("+args[1]+")")
                
                
        else:
            return False


if __name__ == "__main__":
    browser = Browser()
    ltspadmin = LliureXLTSPAdmin()
    # abrimos la pagina de inicio (opcional)
    browser.webview.connect("navigation-requested", ltspadmin.on_navigation_requested)
    
    file = os.path.abspath('index.html')
    uri = 'file://' + urllib.pathname2url(file)
    print ("Goint to "+uri)
    browser.open_url(uri)   
    #browser.open_url("file:///home/joamuran/appjs/nav/n4d_appjs/data/content/index.html")   
    gtk.main()
    #gtk.gdk.threads_init()
    #thread.start_new_thread(gtk.main, ())
    #browser.webview.execute_script('saluda()')


