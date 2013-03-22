#!/usr/bin/env python

from navigator import *
import os
import urllib
import locale
from xmlrpclib import *


class LliureXLTSPAdmin:
    server = ''
    connection_user = ''
    username=''
    password=''
    language=locale.getdefaultlocale()[0] # Gettins system language
    
    # Temp data that we will extract from n4d-ltsp
    jsonclients='{"clients":[{"mac":"11:22:33:44:55:66","name":"PC01","desc":"ordinador 1","session":"gnome","monitor":"auto","autologin":"checked","username":"lliurex"},{"mac":"11:aa:bb:cc:55:66","name":"PC02","desc":"ordinador 2","session":"gnome","monitor":"auto","autologin":"","username":"alu02"},{"mac":"11:22:33:aa:bb:cc","name":"PC03","desc":"ordinador 3","session":"lubuntu","monitor":"auto","autologin":"checked","username":"profe03"}]}'
    
    # Init Bindings
    binding={}
    binding[("ltsp", "login")] = 'onLogin';
    binding[("ltsp", "MirrorManager")] = 'onMirrorManager';
    binding[("ltsp", "ImageManager")] = 'onImageManager';
    binding[("ltsp", "ClientManager")] = 'onClientManager';
    binding[("ltsp", "ClientSaveConfig")] = 'ClientSaveConfig';
    
    def __init__(self):
        print ("Created LliureX LTSP Admin")
        self.server = ServerProxy("https://localhost:9779")
        
    def on_navigation_requested(self, view, frame, req, data=None):
        # Procedure that routes the webkit navigation request
        uri = req.get_uri()
        url=uri.split(':')
        scheme=url[0]
        args=url[1].split('/')
        function=args[2]
        
        if (scheme, function) in self.binding:
            eval("self."+self.binding[(scheme, function)])(args)
            return True
            
            
        return False
    

    #Event Handling
    def onLogin(self, args):
        self.username=urllib.unquote(args[3])
        self.password=urllib.unquote(args[4])
        #print urllib.unquote(username)
        #print urllib.unquote(password)
        
        # n4d has to validate username and password for sudo
        #if (self.username,self.password)==("lliurex", "lliurex"):
        if (self.username,self.password)==("", ""):
            self.connection_user = (self.username,self.password)
            browser.execute_script("loginSuccess()")
            return True
        else:
            browser.execute_script("loginFail('"+self.username+"')")
            return False
        

    def onMirrorManager(self, args):   
        file = os.path.abspath('webgui/MirrorManager.html')
        uri = 'file://' + urllib.pathname2url(file)
        browser.open_url(uri)
        #browser.execute_script("alert('tralari');")


    def onImageManager(self, args):   
        file = os.path.abspath('webgui/ImageManager.html')
        uri = 'file://' + urllib.pathname2url(file)
        browser.open_url(uri)

    def onClientManager(self, args):   
        file = os.path.abspath('webgui/ClientManager.html')
        uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonclients
        browser.open_url(uri)

    def ClientSaveConfig(self, args):
        print urllib.unquote(args[3])
        self.jsonclients=urllib.unquote(args[3])
        file = os.path.abspath('webgui/ClientManager.html')
        uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonclients
        browser.open_url(uri)
    
if __name__ == "__main__":
    
   ltspadmin = LliureXLTSPAdmin() 
   browser = Browser(language=ltspadmin.language)
   
   browser.connectEvents("navigation-requested", ltspadmin.on_navigation_requested)
   file = os.path.abspath('webgui/login.html')
   #uri = 'file://' + urllib.pathname2url(file)+"?lang="+ltspadmin.language
   uri = 'file://' + urllib.pathname2url(file)
   ## print ("Goint to "+uri)
   print uri
   browser.open_url(uri)
   
   print ">>"+browser.lang

    #browser.open_url("file:///home/joamuran/appjs/nav/n4d_appjs/data/content/index.html")   
   Gtk.main()
    #gtk.gdk.threads_init()
    #thread.start_new_thread(gtk.main, ())
    #browser.webview.execute_script('saluda()')