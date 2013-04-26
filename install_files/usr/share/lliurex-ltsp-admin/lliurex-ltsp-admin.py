#!/usr/bin/env python

from navigator import *
import os
import sys
import urllib
import locale
from xmlrpclib import *


class LliureXLTSPAdmin:
    server = ''
    srv_ip= ''
    connection_user = ''
    ConnectionStatus='off'
    username=''
    password=''
    mirror_installed='false'
    language=locale.getdefaultlocale()[0] # Gettins system language
    
    # Temp data that we will extract from n4d-ltsp
    jsonclients=''
    #jsonclients='{"clients":[{"mac":"11:22:33:44:55:66","type": "thin","name":"PC01","desc":"ordinador 1","session":"gnome","monitor":"auto","autologin":"checked","username":"lliurex"},{"mac":"11:aa:bb:cc:55:66","type": "thin", "name":"PC02","desc":"ordinador 2","session":"gnome","monitor":"auto","autologin":"","username":"alu02"},{"mac":"11:22:33:aa:bb:cc","type": "fat","name":"PC03","desc":"ordinador 3","session":"lubuntu","monitor":"auto","autologin":"checked","username":"profe03"}]}'
    #jsonimagesoft='{"meta":[{"name": "infantil", "lliurex_version": "cdd, desktop, edu, lliurex, 13.06.0.138","last_update": "10/01/12","chroot":"/opt/ltsp/infantil","imagepath":"/opt/ltsp/images","metapackage":"cdd-edu-gdesktop-infantil", "packages":[{"name":"gedit", "version":"1.1", "installed":"no"},{"name":"gimp", "version":"2.8", "installed":"yes"},{"name":"gcompris", "version":"3.2", "installed":"no"}] }, {"name": "desktop", "lliurex_version": "cdd, desktop, edu, lliurex, 13.06.0.138","last_update": "10/01/12","chroot":"/opt/ltsp/infantil","imagepath":"/opt/ltsp/images","metapackage":"cdd-edu-gdesktop-infantil", "packages":[{"name":"gedit", "version":"1.1", "installed":"no"},{"name":"inkscape", "version":"2.8", "installed":"yes"},{"name":"mono", "version":"3.2", "installed":"no"}] }]}'
   
    # Init Bindings
    binding={}
    binding[("ltsp", "login")] = 'onLogin';
    binding[("ltsp", "MirrorManager")] = 'onMirrorManager';
    binding[("ltsp", "ImageManager")] = 'onImageManager';
    binding[("ltsp", "ClientManager")] = 'onClientManager';
    binding[("ltsp", "SoftwareManager")] = 'onSoftwareManager';
    binding[("ltsp", "ImageAdvanced")] = 'onImageAdvanced';
    binding[("ltsp", "ClientSaveConfig")] = 'ClientSaveConfig';
    binding[("ltsp", "GetMacFromN4d")] = 'GetMacFromN4d';
    binding[("ltsp", "ExecuteInChroot")] = 'onExecuteInChroot';
    binding[("ltsp", "reconnectN4D")] = 'onreconnectN4D';

    
    def __init__(self):
        ''' Init LTSP Admin and connects to N4D '''
        
        try:
            # Connecto to n4s-server to get SRV_IP
            localserver=ServerProxy("https://localhost:9779")
            self.srv_ip=localserver.get_variable("", 'VariablesManager', 'SRV_IP')
            print ("srv_ip:"+self.srv_ip)
            # Now connect to n4s server on SRV_IP
                       
            self.ConnectionStatus='on'
            
            # n4d connection done in login
            
            ## self.server = ServerProxy("https://"+self.srv_ip+":9779")
            ## TODO !!!!!!!!!!!!!!!!
            #user = "joamuran"
            #password = "lliurex"
            #connection_user = (user,password)
            #self.jsonclients=self.server.get_ltsp_conf(connection_user,'LtspClientConfig')
            ######################################
            
            
            print "***"
            print self.jsonclients
        except Exception:
            print Exception
            self.ConnectionStatus='off'
            pass
        
    def onreconnectN4D(self, args):
        import subprocess
        import time
        subprocess.Popen(["gksudo", "n4d-server"])
        
        # Reconnectant...
        time.sleep(3)
        
        
        # WIP HERE
        #localserver=ServerProxy("https://localhost:9779")
        #self.srv_ip=localserver.get_variable("", 'VariablesManager', 'SRV_IP')
        #print ("srv_ip:"+self.srv_ip)
        # Now connect to n4s server on SRV_IP
                       
        #self.ConnectionStatus='on'        
        
                        
        #file = os.path.abspath('webgui/login.html')
        #uri = 'file://' + urllib.pathname2url(file)+'?server='+ltspadmin.srv_ip;
        #print uri
        #browser.open_url(uri)
        # END WIP HERE...
        
        # REMEMBER TO CHANGE DATA.JSON!!!!
       
        #op = subprocess.popen("gksudo n4d-server")
        pass
    
    
    def on_navigation_requested(self, view, frame, req, data=None):
        ''' Procedure that routes the webkit navigation request '''
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
        self.srv_ip=urllib.unquote(args[5])
        
        # n4d connection to server
                    
        try:
            # Connection
            self.server = ServerProxy("https://"+self.srv_ip+":9779")
            
            # Authentication        
            groups=self.server.validate_user(self.username,self.password)
            print groups
        
            if (('adm' in groups[1])or('admins' in groups[1])or('teachers' in groups[1])):
                print "User Validated"  
            #if (self.username,self.password)==("", ""):
                self.connection_user = (self.username,self.password)
                self.jsonclients=self.server.get_ltsp_conf(self.connection_user,'LtspClientConfig')
                ## TODO: Modify when get_status return a dictionary...
                self.mirror_installed=self.server.get_status("","LliurexMirror")[11:20]
                
                
                browser.execute_script("loginSuccess('"+self.mirror_installed+"')")
                #print "*******"+self.mirror_installed
                #print self.server.get_status('LliurexMirror')
                
                return True
            else:
                browser.execute_script("loginFail('"+self.username+"')")
                return False
            

            #connection_user = (self.username,self.password)
            #self.jsonclients=self.server.get_ltsp_conf(connection_user,'LtspClientConfig')
        except Exception:
            print "Exception:"
            print Exception
            file = os.path.abspath('webgui/ServerError.html')
            uri = 'file://' + urllib.pathname2url(file)
            browser.open_url(uri)            
            pass
            
        
        # n4d has to validate username and password for sudo
        #if (self.username,self.password)==("lliurex", "lliurex"):
        
        

    def onMirrorManager(self, args):
        file = os.path.abspath('webgui/MirrorManager.html')
        uri = 'file://' + urllib.pathname2url(file)
        browser.open_url(uri)
        #browser.execute_script("alert('tralari');")


    def onImageManager(self, args):
        import simplejson as json
        #from pprint import pprint
        
        ##########
        fd=open('webgui/data.json')
        json_data=fd.read();
        fd.close()
        json_obj=json.loads(json_data)
        ###########        
        #dic=self.server.get_json_images("","LtspChroot")
        #print dic["status"]
        #print json.dumps(dic["images"])
        ##############
        
        file = os.path.abspath('webgui/ImageManager.html')
        #uri = 'file://' + urllib.pathname2url(file)+'?imageData='+json.dumps(dic["images"])+'&amp;mirror_installed='+self.mirror_installed
        
        uri = 'file://' + urllib.pathname2url(file)+'?imageData='+json.dumps(json_obj)
        print uri
        browser.open_url(uri)

    def onClientManager(self, args):   
        file = os.path.abspath('webgui/ClientManager.html')
        uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonclients+'&amp;mirror_installed='+self.mirror_installed
        browser.open_url(uri)
        
    def onSoftwareManager(self, args):
        ## TO DELETE!!!!!!
        file = os.path.abspath('webgui/SoftwareManager.html')
        #uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonimagesoft+'&amp;mirror_installed='+self.mirror_installed
        browser.open_url(uri)
        
    def onImageAdvanced(self, args):
        file = os.path.abspath('webgui/ImageAdvanced.html')
        print args
        uri = 'file://' + urllib.pathname2url(file)+'?meta='+urllib.unquote(args[3])+'&amp;mirror_installed='+self.mirror_installed
        browser.open_url(uri)


    def ClientSaveConfig(self, args):
        #print urllib.unquote(args[3])
        self.jsonclients=urllib.unquote(args[3])
        print self.jsonclients
        user = "joamuran" ##
        password = "lliurex" ###        
        connection_user = (user,password)
        self.server.set_ltsp_conf(connection_user,'LtspClientConfig',self.jsonclients)
        
        file = os.path.abspath('webgui/ClientManager.html')
        uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonclients++'&amp;mirror_installed='+self.mirror_installed
        browser.open_url(uri)
    
    def GetMacFromN4d(self, args):
        #Maybe we'll want to comunicate remotely with other server instead of localhost...
        #server = ServerProxy("https://server:9779")
        
        # We use self-server, not need to define server twice
        #server = ServerProxy("https://localhost:9779")
        mac=self.server.getClipboard("","LTSPClipboard")
        
        try:
            hostname=self.server.has_name("","Dnsmasq", "'"+mac+"'")
        except Exception:
            pass
            
        #print mac
        #print hostname
        
        if hostname==None:
            hostname="client-no-registrat"
            
        browser.execute_script("setMac('"+mac+"','"+hostname+"')")
        
        
        
        
    
        
        
    def onExecuteInChroot(self, args):
        sys.stdout = open('/tmp/stdout.txt', 'a')
        print "Executing "+args[3]
        
        if args[3]!="lxde":
            import os
            p = os.popen("sudo "+args[3],"r")
            while 1:
                line = p.readline()
                if not line: break
                print line
        else:
            from subprocess import Popen, PIPE
            
            
            p = Popen(['ping', 'localhost', '-c', '3'], stdout=PIPE)
            while True:
                line = p.stdout.readline()
                if not line:
                    break
                print line;
                browser.execute_script("ShowConsole('"+urllib.pathname2url(line)+"')");
                
                
    def update_config_images(self, imageData):
        
        pass
    
    
if __name__ == "__main__":
    ltspadmin = LliureXLTSPAdmin() 
    browser = Browser(language=ltspadmin.language)
   
    if ltspadmin.ConnectionStatus=='off':
        file = os.path.abspath('webgui/LocalServerError.html')
        pass
    else:
        file = os.path.abspath('webgui/login.html')
        print "CONECTION:"+ltspadmin.ConnectionStatus
        pass
    
    browser.connectEvents("navigation-requested", ltspadmin.on_navigation_requested)
    
    #uri = 'file://' + urllib.pathname2url(file)+"?lang="+ltspadmin.language
   
    uri = 'file://' + urllib.pathname2url(file)+'?server='+ltspadmin.srv_ip;
   
    ## print ("Goint to "+uri)
    print uri
    browser.open_url(uri)
   
    print ">>"+browser.lang

     #browser.open_url("file:///home/joamuran/appjs/nav/n4d_appjs/data/content/index.html")   
    Gtk.main()
     #gtk.gdk.threads_init()
     #thread.start_new_thread(gtk.main, ())
     #browser.webview.execute_script('saluda()')    