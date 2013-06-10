#!/usr/bin/env python

from Browser import *
import os
import sys
import urllib
import locale
from xmlrpclib import *
#from ltsp_X11_environment import *
from LTSPX11Environment import *

import gobject

#from gi.repository import GLib,Gdk
#GLib.threads_init()

#import gtk
#gtk.gdk.threads_init()

class LliureXLTSPAdmin:
    server = ''             # Efective n4d-ltsp server
    localserver='127.0.0.1' # Local n4d server (to getting server ip)
    srv_ip= ''              # Class server IP
    connection_user = ''
    ConnectionStatus='off'
    username=''
    password=''
    mirror_installed='false'
    abstract=''
    date=None
    language=locale.getdefaultlocale()[0] # Gettins system language
    imagelist=None; # List of images installed, chroots, etc
    
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
    binding[("ltsp", "UpdateMirrorCommand")] = 'onUpdateMirrorCommand';
    binding[("ltsp", "CreateNewClient")] = 'onCreateNewClient';
    binding[("ltsp", "UpdateImageClient")] = 'onUpdateImageClient';
    binding[("ltsp", "DeleteClient")] = 'onDeleteClient';
    binding[("ltsp", "ApplyChangesToImage")] = 'onApplyChangesToImage';

    def __init__(self):
        ''' Init LTSP Admin and connects to N4D '''
        
        try:
            # Connecto to n4s-server to get SRV_IP
            self.localserver=ServerProxy("https://localhost:9779")
            self.srv_ip=self.localserver.get_variable("", 'VariablesManager', 'SRV_IP')
            if (type(self.srv_ip=='NoneType')):
                self.srv_ip='127.0.0.1'           
            print ("srv_ip:"+self.srv_ip)
            # Now connect to n4s server on SRV_IP
                       
            self.ConnectionStatus='on'
            
            # n4d connection done in login
            
            print (self.jsonclients)
        except Exception:
            print (Exception)
            self.ConnectionStatus='off'
            pass
             
    def readlog(self, n4dclass, logname):
        import os.path
        import time
        
        try:
            browser.execute_script("setStatus('working');")
            # Is log prepared?
            server = ServerProxy("https://"+self.srv_ip+":9779")
            
            log_prepared=server.exist_log_file("", n4dclass);
            print ("Log_Prepared=*"+log_prepared[0:4])
            
            if (log_prepared[0:4]!='True'):
                print ("[LliureX-LTSP-Admin] Log File "+logname+" does not exists. Waiting...")
                return True
            
            # When Log is prepared, read it
            print ("[LliureX-LTSP-Admin] Log File "+logname+" File Exists. Reading...")
            
            loglines=server.read_n4dr_log("", "N4dRemoteLog", logname, self.initline, self.numlines)
            self.initline=self.initline+len(loglines['file'])
            print (loglines)
            
            if len(loglines['file'])>0:
                length=len(str(loglines['file']))
                parsed_string=(str(loglines['file'])[2:length]).replace('\\n','<br />').replace('\', \'', '').replace('\', \"', '').replace('\", \"', '').replace('\']','').replace('\\t','').replace("\t","<span style='display:inline; white-space:pre;'>    </span>").replace("\t","<span style='display:inline; white-space:pre;'>    </span>").replace("[ LliureX Mirror ]","<span style='color:#0000ff;'>[ LliureX Mirror ]</span>") 
                browser.execute_script("add_text_to_output('"+urllib.quote(parsed_string, '')+"')")
                    
            status=server.get_status("", n4dclass)
            print ("STATUS: ")
            print status
            print ("SERVER CLASS STATUS: "+status[11:20])

                               # working 18
            #if (status[11:20]!='available'):
            if ((status[11:18]=='working')or(status[11:15]=='busy')):
                print ("is WORKING")
                return True
            elif (status[11:20]=='available'):
                browser.execute_script("setStatus('available');")
                browser.execute_script("alert('Operation has finished');")
                print ("is available (Finished work!)")
                return False
            else: # status!=working and !=available ->> error!
                browser.execute_script("setStatus('available');")
                browser.execute_script("alert('It has produced an error in operation!');")
                print ("Finished work with errors. Status: "+str(status))
                
        #code
        except Exception as e:
            print ("Exception reading log. Message: "+str(e))
            return False

    def n4updatemirror(self):
        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("Updating Mirror")
        connection_user = (self.username,self.password)
        print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4dupdate(connection_user,"LliurexMirror")
        print ("End Mirror")
        
        return False
        
    def onUpdateMirrorCommand(self, args):
        import threading
        
        self.initline=0;
        self.numlines=1000;
        self.endline=0;
        
        self.count=0;
        
        try:
            connection_user = (self.username,self.password)
            #print ("Connection user: "+str(connection_user))
            # n4d connection to server
            # Delete Mirror Log
            self.server.prepare_log(connection_user,"LliurexMirror")
            
            print ("Setting timer log")
            gobject.timeout_add(500, self.readlog,"LliurexMirror", "mirror")
            print ("Set timer log")
            
            print ("Setting timer mirror")
        
            #self.n4updatemirror()
            t = threading.Thread(target=self.n4updatemirror) 
            t.daemon=True
            t.start()
            
            #self.n4updatemirror()
            #gobject.timeout_add(100, n4dupdatemirror)
            print ("Set timer mirror")
            
        except Exception as e:
            print str(e)
            
            
        return True
           
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
        #print (uri)
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
        
        #import time
        #win = Browser(language=ltspadmin.language)
        #win.load_html_string('<h1>Hello Mars</h1>')
        #time.sleep(5)
        
        
        
        self.username=urllib.unquote(args[3])
        self.password=urllib.unquote(args[4])
        self.srv_ip=urllib.unquote(args[5])
        
        # n4d connection to server
                    
        try:
            # Connection
            self.server = ServerProxy("https://"+self.srv_ip+":9779")
            # Authentication        
            groups=self.server.validate_user(self.username,self.password)
            print (groups)
        
            if (('adm' in groups[1])or('admins' in groups[1])or('teachers' in groups[1])):
                print ("User Validated")
            
                self.connection_user = (self.username,self.password)
                self.jsonclients=self.server.get_ltsp_conf(self.connection_user,'LtspClientConfig')
                
                #status
                try:
                    exec("status="+self.server.get_status("","LliurexMirror"))
                except Exception:
                    status={'status':'uninstalled','msg':'LliureX Mirror is not installed'}
                #print (":::::::::::"+status)
                self.mirror_installed=status['status']
                ######################
                ##self.mirror_installed='unavailable'
                print (self.mirror_installed)
                #print (":::::::::::"+status)
                
                if self.mirror_installed=='available':
                    
                    # Abstract
                    try:
                        file = open('/var/log/lliurex/lliurex-mirror.log', 'r')
                        self.abstract=file.read()
                    except Exception:
                        self.abstract="Mirror log file not found."
                        pass
        
                    # Date
                    exec("datestatus="+self.server.n4d_get_unix_date("", "LliurexMirror"))
                    if datestatus['status']:
                        self.date=datestatus['date']
                    else:
                        self.date=""
                
                elif self.mirrot_installed=='uninstalled':
                    self.abstract="Mirror Not Installed"
                else: # i.e. Busy
                    self.abstract="LliureX Mirror is Working"
                    #self.date=""
                
                # Launch browser    
                browser.execute_script("loginSuccess('"+self.mirror_installed+"')")

                    
                # END if self.mirror_installed=="available":
                
                return True
            else:
                browser.execute_script("loginFail('"+self.username+"')")
                return False
            
            #connection_user = (self.username,self.password)
            #self.jsonclients=self.server.get_ltsp_conf(connection_user,'LtspClientConfig')
        except Exception:
            print ("Exception:")
            print (Exception)
            file = os.path.abspath('webgui/ServerError.html')
            uri = 'file://' + urllib.pathname2url(file)
            browser.open_url(uri)            
            pass
            
    def onMirrorManager(self, args):
        file = os.path.abspath('webgui/MirrorManager.html')
        uri = 'file://' + urllib.pathname2url(file)+'?mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip+'&amp;mirror_abstract='+self.abstract+'&amp;mirror_date='+self.date
        browser.open_url(uri)

    def onImageManager(self, args):
        import simplejson as json
        #from pprint import pprint
        
        '''
        TO USE WITH FILE...
        fd=open('webgui/data.json')
        json_data=fd.read();
        fd.close()
        json_obj=json.loads(json_data)
        print "TYPE: "+str(type(json_obj))'''

        try:
        
            json_obj=self.server.get_json_images("","LtspChroot")
            print "TYPE: "+str(type(json_obj))
            self.imagelist=json_obj;
            
            print ("CONTAINS:")
            print str(self.imagelist)
    
            file = os.path.abspath('webgui/ImageManager.html')
            
            uri = 'file://' + urllib.pathname2url(file)+'?imageData='+json.dumps(json_obj)+'&amp;mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip
            
            print (uri)
            browser.open_url(uri)
        except Exception as e:
            print ("[LTSP Exception]"+str(e))

    def onClientManager(self, args):   
        file = os.path.abspath('webgui/ClientManager.html')
        print ('&amp;srv_ip='+self.srv_ip)
        uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonclients+'&amp;mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip
        browser.open_url(uri)
        
    def onSoftwareManager(self, args):
        ## TO DELETE!!!!!!
        file = os.path.abspath('webgui/SoftwareManager.html')
        #uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonimagesoft+'&amp;mirror_installed='+self.mirror_installed
        browser.open_url(uri)
        
    def onImageAdvanced(self, args):
        '''
        Opens The Advanced Window for a concrete id
        '''
        file = os.path.abspath('webgui/ImageAdvanced.html')
        id=args[3]
        print ("ARGS: "+str(args))
        #print ("IMAGELIST: "+str(self.getChrootFromImageList(id)))
        uri = 'file://' + urllib.pathname2url(file)+'?meta='+urllib.unquote(id)+'&amp;mirror_installed='+self.mirror_installed+'&amp;chroot='+str(self.getChrootFromImageList(id))
        browser.open_url(uri)

    def getChrootFromImageList(self, id):
        '''
        Returns the chroot directory corresponding to the image with a concrete id
        '''
        for element in self.imagelist['images']:
            if element['id']==id:
                return element['squashfs_dir']

        return None

    def ClientSaveConfig(self, args):
        #print (urllib.unquote(args[3]))
        self.jsonclients=urllib.unquote(args[3])
        print (self.jsonclients)
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
            
        #print (mac)
        #print (hostname)
        
        if hostname==None:
            hostname="client-no-registrat"
            
        browser.execute_script("setMac('"+mac+"','"+hostname+"')")

    ## OPERATIONS WITH CHROOT via N4D
        
    def n4dGenerateImg(self, img_chroot):
        '''
        Regenerates img file from a chroot via n4d
        '''
        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("Updating Image")
        connection_user = (self.username,self.password)
        print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.regenerate_img(connection_user,"LtspImage",img_chroot)
        print ("End Regenerating image")
        
        return False

    def n4dCreateClient(self, img_id, img_chroot):
        '''
        Creates a new chroot for img_id into img_chroot, and an img file
        '''
        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("[n4dCreateClient] Creating client...")
        connection_user = (self.username,self.password)
        print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4d_create_client(connection_user,"LtspImage",img_id, img_chroot)
        print ("[n4dCreateClient] End Creating client...")
        
        return False

    def n4dUpdateClient(self, img_id, img_chroot):
        '''
        Performs an lliurex-upgrade by n4d into a chroot
        '''
        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("[n4dUpdateClient] Updating client...")
        connection_user = (self.username,self.password)
        print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4d_update_client(connection_user,"LtspImage",img_id, img_chroot)
        print ("[n4dUpdateClient] End Updating Client client...")
        
        return False

    def n4dDeleteClient(self, img_id, img_chroot):
        '''
        Deletes img and chroot for a client
        '''

        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("[n4dDeleteClient] Deleting client...")
        connection_user = (self.username,self.password)
        print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4d_delete_client(connection_user,"LtspImage",img_id, img_chroot)
        print ("[n4dDeleteClient] End Deleting Client client...")
        
        return False


    def n4dInstallXFCE(self, img_id, img_chroot):
        '''
        Installs XFCE into chroot through N4D
        '''
        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("[n4dModifyClient] Installing XFCE...")
        connection_user = (self.username,self.password)
        print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4d_install_xfce(connection_user,"LtspImage",img_id, img_chroot)
        print ("[n4dModifyClient] Installing XFCE...")
        
        return False

    ## Operations with chroot (main, uses n4d functions specified up)

    def onApplyChangesToImage(self, args):
        '''
        Regenerates img file from a chroot via n4d, calls n4dGenerateImg
        '''
        
        import threading

        #print ("Apply Changes.")
        #print (args)
        #print ("End Updating Image.")

        # Getting chroot
        imgchroot=str(urllib.unquote(args[4]))
        #print "id="+id
        print ("Image is: "+imgchroot)

        # Prepare log
        print ("Returns: ")
        print (self.server.prepare_log("","LtspImage"))
        print (self.server.exist_log_file("","LtspImage"))
        
        self.initline=0;
        self.numlines=1000;
        self.endline=0;        
        self.count=0;
        
        try:
            #connection_user = (self.username,self.password)
            #self.server.prepare_log(connection_user,"LtspImage")
            
            print ("Setting timer log")
            # for self.readlog: LtspImage is the class name that is logging and lstpimages, the log name
            gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            print ("Set timer log")
            
            print ("Setting timer n4dGenerateImg")
        
            t = threading.Thread(target=self.n4dGenerateImg, args=(imgchroot,))
            t.daemon=True
            t.start()
            
            print ("Set timer n4dGenerateImg")
            
        except Exception as e:
            print str(e)
            

    '''
    DEPRECATED:
    def updateImage(self, image):
        print "********Updating: "+image
        connection_user = (self.username,self.password)
        ##print ("Connection user: "+str(connection_user))
        ## n4d connection to server
        ## Delete Mirror Log
        print ("Returns: ")
        print self.server.prepare_log("","LtspChroot")
        print self.server.exist_log_file("","LtspChroot")

        # TODO: CALL N4D CHROOT TO APPLY CHANGES TO IMAGE!!
        
        #self.server.prepare_log(connection_user,"LtspChroot")
        #
        #print ("Setting timer log")
        #gobject.timeout_add(500, self.readlog,"LliurexMirror", "mirror")
        #print ("Set timer log")
        #   
        #print ("Setting timer mirror")
        #
        ##self.n4updatemirror()
        #t = threading.Thread(target=self.n4updatemirror) 
        #t.daemon=True
        #t.start()
        return True
    '''
    
    def installXFCEonClient(self, args):
        '''
        Installx XFCE into chroot. Uses n4dInstall XFCE
        '''
      
        import threading

        print ("Installing XFCE:")
        print (args)

        # Getting chroot
        id=args[3]
        
        # Getting chroot
        imgchroot=str(self.getChrootFromImageList(id))
        #print "id="+id
        print ("Image is: "+imgchroot)

        print ("Returns: ")
        print self.server.prepare_log("","LtspImage")
        print self.server.exist_log_file("","LtspImage")
        
        self.initline=0;
        self.numlines=1000;
        self.endline=0;        
        self.count=0;
        
        try:
            print ("[LliureX LTSP] Setting timer log")
            # for self.readlog: LtspImage is the class name that is logging and lstpimages, the log name
            gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            #print ("Set timer log")
            
            print ("[LliureX LTSP] Setting timer for n4d Create Client")
        
            t = threading.Thread(target=self.n4dInstallXFCE, args=(id, imgchroot,))
            t.daemon=True
            t.start()
            
        except Exception as e:
            print str(e)
            


    def onCreateNewClient(self, args):
        '''
        Creates a new chroot and img file. Uses n4dCreateClient.
        '''
        import threading

        print ("Create Image. Args:")
        print (args)

        # Getting chroot
        id=args[3]
        
        # Getting chroot
        imgchroot=str(self.getChrootFromImageList(id))
        #print "id="+id
        print ("Image is: "+imgchroot)

        print ("Returns: ")
        print self.server.prepare_log("","LtspImage")
        print self.server.exist_log_file("","LtspImage")
        
        self.initline=0;
        self.numlines=1000;
        self.endline=0;        
        self.count=0;
        
        try:
            print ("[LliureX LTSP] Setting timer log")
            # for self.readlog: LtspImage is the class name that is logging and lstpimages, the log name
            gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            #print ("Set timer log")
            
            print ("[LliureX LTSP] Setting timer for n4d Create Client")
        
            t = threading.Thread(target=self.n4dCreateClient, args=(id, imgchroot,))
            t.daemon=True
            t.start()
            
        except Exception as e:
            print str(e)
            

    def onUpdateImageClient(self, args):
        '''
        Performs a lliurex-upgrade into client. Uses n4dUpdateClient.
        '''
        import threading

        print ("Update Image. Args:")
        print (args)

        # Getting chroot
        id=args[3]
        
        # Getting chroot
        imgchroot=str(self.getChrootFromImageList(id))
        #print "id="+id
        print ("Image is: "+imgchroot)

        print ("Returns: ")
        print self.server.prepare_log("","LtspImage")
        print self.server.exist_log_file("","LtspImage")
        
        self.initline=0;
        self.numlines=1000;
        self.endline=0;        
        self.count=0;
        
        try:
            print ("[LliureX LTSP] Setting timer log")
            # for self.readlog: LtspImage is the class name that is logging and lstpimages, the log name
            gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            #print ("Set timer log")
            
            print ("[LliureX LTSP] Setting timer for n4d Create Client")
        
            t = threading.Thread(target=self.n4dUpdateClient, args=(id, imgchroot,))
            t.daemon=True
            t.start()
            
            #print ("Set timer ")
            
        except Exception as e:
            print str(e)


    def onDeleteClient(self, args):
        '''
        Delete img file and chroot. Uses n4dDeleteClient.
        '''
        import threading

        print ("Deleting Image. Args:")
        print (args)

        # Getting chroot
        id=args[3]
        
        # Getting chroot
        imgchroot=str(self.getChrootFromImageList(id))
        print ("Image is: "+imgchroot)

        print ("Returns: ")
        print self.server.prepare_log("","LtspImage")
        print self.server.exist_log_file("","LtspImage")
        
        self.initline=0;
        self.numlines=1000;
        self.endline=0;        
        self.count=0;
        
        try:
            print ("[LliureX LTSP] Setting timer log")
            # for self.readlog: LtspImage is the class name that is logging and lstpimages, the log name
            gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            #print ("Set timer log")
            
            print ("[LliureX LTSP] Setting timer for n4d Create Client")
        
            t = threading.Thread(target=self.n4dDeleteClient, args=(id, imgchroot,))
            t.daemon=True
            t.start()
            
            #print ("Set timer ")
            
        except Exception as e:
            print str(e)

    # End Main functions to perform predefined actions in chroot


    def onExecuteInChroot(self, args):
        '''
        Executes some specific functions into chroot. After them, we shoud to regenerate img file.
        '''
        import urllib
        #import subprocess
        command=""
        #sys.stdout = open('/tmp/stdout.txt', 'a')
        if args[3]=='terminal':
            command="terminal"
        elif args[3]=='synaptic':
            command="synaptic"
        elif args[3]=='texteditor':
            command="x-editor"
        elif args[3]=='launch_session':
            command="start_session"
        #elif args[3]=='apply':
        #    # Apply changes to image!
        #    self.updateImage(urllib.url2pathname(args[4]));
        elif args[3]=='xfce':
            self.installXFCEonClient(urllib.url2pathname(args[4]));

            return 0
            pass
        else: #Otherwise it's a "run_command" option, so, command is this.
            command=args[3]

        # Gettint Chroot

        chroot=urllib.url2pathname(args[4])
        print ("Executing "+command+" on "+chroot)

        # Configure Server LTSP connection
        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        my_ip_for_server=self.get_my_ip_for_server()
        print (my_ip_for_server)

        # Set up X11 Environment for Chroot, Connection to n4d in local
        display=":48" # The answer to the Universe, the Existence and all other things  (i.e. Xephire Display)
        screen="800x600"


        # XServer es una connexio a les x locals, no una connexio n4d!!
        XServer=LTSPX11Environment(display, screen)

        # LOCAL X11 Server for remote CHROOT

        try:
            # PRepare X11 Xephyr environment
            XServer.prepare_X11_applications_on_chroot()
            
            if (command=="start_session"):
                print ("#####################")
                ret=server.prepare_chroot_for_session(connection_user, "LtspChroot",chroot)
                print (str(ret))
                print ("#####################")
                
                #XServer.prepare_chroot_for_session()
            
            # Run APP into REMOTE Server            
            output=server.run_command_on_chroot(connection_user, "LtspChroot", chroot, command, my_ip_for_server, display)
            #print ("OUTPUT: "+str(output['msg']))
            if (str(output['msg'])=='127'):
                print ("command not found")
                browser.execute_script("alert('Command "+command+" not found!')")

                #print ("ERROR: COMMAND NOT FOUND")
            # Delete XServer: When Finished, delete XServer
            print ("UMOUNT CHROOT")
            XServer.remove_X11_applications_on_chroot()

            print ("UMOUNT HOME")
            if (command=="start_session"):
                server.remove_session(connection_user, "LtspChroot", chroot)

                #XServer.remove_session()
            
        except Exception as e:
            print ("Exception in XServer...:"+str(e))
            return None
        return None


        #server.run_command_on_chroot(connection_user,'chroot')
        #self.jsonclients=self.server.get_ltsp_conf(connection_user,'LtspClientConfig')
        #log_prepared=server.("", "LliurexMirror");
        #print ("Log_Prepared=*"+log_prepared[0:4])
     
        
        #if args[3]!="xfce":
        #    import os
        #    p = os.popen("sudo "+args[3],"r")
        #    while 1:
        #        line = p.readline()
        #        if not line: break
        #        print (line)
        #else:
        #    from subprocess import Popen, PIPE
        #    
        #    
        #    p = Popen(['ping', 'localhost', '-c', '3'], stdout=PIPE)
        #    while True:
        #        line = p.stdout.readline()
        #        if not line:
        #            break
        #        print (line);
        #        browser.execute_script("ShowConsole('"+urllib.pathname2url(line)+"')");
             

    ## END OPERATIONS ON CHROOT
   
    def get_my_ip_for_server(self):
        import lliurex.net

        if self.srv_ip=='127.0.0.1':
            return '127.0.0.1'

        for interface in lliurex.net.get_devices_info():
            ip=interface['ip']
            mask=interface['netmask']
            ipnet=lliurex.net.get_network_ip(ip, mask)
            ipsrvnet=lliurex.net.get_network_ip(str(self.srv_ip), mask)
            if ipnet==ipsrvnet:
                return ip

        # If arrives here (not shuld!), return localhost
        return '127.0.0.1'
        pass

            
    def update_config_images(self, imageData):
        
        pass
    
    
if __name__ == "__main__":
    # set working directory

    # production
    #os.chdir('/usr/share/lliurex-ltsp-admin')
    # Github
    os.chdir('/srv/github/lliurex-ltsp-admin/install_files/usr/share/lliurex-ltsp-admin')

    # Create an App instance
    ltspadmin = LliureXLTSPAdmin()
    
    # create Browser
    browser = Browser(language=ltspadmin.language)
   
    if ltspadmin.ConnectionStatus=='off':
        file = os.path.abspath('webgui/LocalServerError.html')
        pass
    else:
        file = os.path.abspath('webgui/login.html')
        print ("CONECTION:"+ltspadmin.ConnectionStatus)
        pass
    
    browser.connectEvents("navigation-requested", ltspadmin.on_navigation_requested)
    
    #uri = 'file://' + urllib.pathname2url(file)+"?lang="+ltspadmin.language
   
    uri = 'file://' + urllib.pathname2url(file)+'?server='+ltspadmin.srv_ip;
   
    ## print ("Goint to "+uri)
    print (uri)
    browser.open_url(uri)
   
    print (">>"+browser.lang)

     #browser.open_url("file:///home/joamuran/appjs/nav/n4d_appjs/data/content/index.html")   
    Gtk.main()
     #gtk.gdk.threads_init()
     #thread.start_new_thread(gtk.main, ())
     #browser.webview.execute_script('saluda()')    