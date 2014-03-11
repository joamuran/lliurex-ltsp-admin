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
    pool_ok='cheking'
    date=None
    language=locale.getdefaultlocale()[0] # Gettins system language
    imagelist=None; # List of images installed, chroots, etc
    require_version_plugins='1.0.7' # Version required of n4d plugins in server
    check_mirror='true'
    selected_ip_for_server=""
    
    # Temp data that we will extract from n4d-ltsp
    jsonclients=''
    classroom_session=""
    classroom_type=""
    #jsonclients='{"clients":[{"mac":"11:22:33:44:55:66","type": "thin","name":"PC01","desc":"ordinador 1","session":"gnome","monitor":"auto","autologin":"checked","username":"lliurex"},{"mac":"11:aa:bb:cc:55:66","type": "thin", "name":"PC02","desc":"ordinador 2","session":"gnome","monitor":"auto","autologin":"","username":"alu02"},{"mac":"11:22:33:aa:bb:cc","type": "fat","name":"PC03","desc":"ordinador 3","session":"lubuntu","monitor":"auto","autologin":"checked","username":"profe03"}]}'
    #jsonimagesoft='{"meta":[{"name": "infantil", "lliurex_version": "cdd, desktop, edu, lliurex, 13.06.0.138","last_update": "10/01/12","chroot":"/opt/ltsp/infantil","imagepath":"/opt/ltsp/images","metapackage":"cdd-edu-gdesktop-infantil", "packages":[{"name":"gedit", "version":"1.1", "installed":"no"},{"name":"gimp", "version":"2.8", "installed":"yes"},{"name":"gcompris", "version":"3.2", "installed":"no"}] }, {"name": "desktop", "lliurex_version": "cdd, desktop, edu, lliurex, 13.06.0.138","last_update": "10/01/12","chroot":"/opt/ltsp/infantil","imagepath":"/opt/ltsp/images","metapackage":"cdd-edu-gdesktop-infantil", "packages":[{"name":"gedit", "version":"1.1", "installed":"no"},{"name":"inkscape", "version":"2.8", "installed":"yes"},{"name":"mono", "version":"3.2", "installed":"no"}] }]}'
   
    # Init Bindings
    binding={}
    binding[("ltsp", "login")] = 'onLogin';
    binding[("ltsp", "MirrorManager")] = 'onMirrorManager';
    binding[("ltsp", "ImageManager")] = 'onImageManager';
    binding[("ltsp", "IsoManager")] = 'onIsoManager';
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
    binding[("ltsp", "ApplyChangesToImageWithCheck")] = 'onApplyChangesToImageWithCheck';
    binding[("ltsp", "ApplyChangesToImage")] = 'onApplyChangesToImage';
    binding[("ltsp", "SelectIso")] = 'onSelectIso';
    binding[("ltsp", "SetPXENetinst")] = 'onSetPXENetinst';
    binding[("ltsp", "Export")] = 'onExport';
    binding[("ltsp", "ImportFile")] = 'onImport';
    binding[("ltsp", "refreshPXEMenu")] = 'onrefreshPXEMenu';
    binding[("ltsp", "unmark_updateable")] = 'onUnmark_Updateable';
    binding[("ltsp", "mark_updateable")] = 'onMark_Updateable';
    binding[("ltsp", "install_awesome")] = 'onInstall_awesome';

    
    

    def __init__(self, check_mirror):
        ''' Init LTSP Admin and connects to N4D '''
        self.check_mirror=check_mirror;
        
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
            # Get Environment
            my_env=dict(os.environ)
            print "<<<<<"+my_env['DISPLAY']
            try:
                print "<<<<<"+my_env['XAUTHORITY']
            except Exception:
                # Xauthority is not defined...
                my_env['XAUTHORITY']="~/.Xauthority"
            
            self.localserver.xenv_set_environment("", "ltspClientXServer", my_env['XAUTHORITY'], my_env['DISPLAY'])
            print "444"

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
            print "**<<"+str(loglines)+">>**"
            
            if len(loglines['file'])==0:
                #length=len(str(loglines['file']))
                lastline=server.read_n4dr_log_lastline("", "N4dRemoteLog", logname)
                print ":::"+str(lastline)+":::"
                if (str(lastline['status'])==False):
                    pass
                parsed_string=str(lastline['file'])
                #parsed_string=(str(loglines['file'])[2:length]).replace('\\n','<br />').replace('\', \'', '').replace('\', \"', '').replace('\", \"', '').replace('\']','').replace('\\t','').replace("\t","<span style='display:inline; white-space:pre;'>    </span>").replace("\t","<span style='display:inline; white-space:pre;'>    </span>").replace("[ LliureX Mirror ]","<span style='color:#0000ff;'>[ LliureX Mirror ]</span>")
                #browser.execute_script("add_last_line_to_output('"+parsed_string+"')")

                browser.execute_script("add_last_line_to_output('"+urllib.quote(parsed_string, '')+"')")
                #browser.execute_script("add_text_to_output('"+urllib.quote(parsed_string, '')+"')")
            else:
                if len(loglines['file'])>0:
                    length=len(str(loglines['file']))
                    parsed_string=(str(loglines['file'])[2:length]).replace('\\n','<br />').replace('\', \'', '').replace('\', \"', '').replace('\", \"', '').replace('\']','').replace('\\t','').replace("\t","<span style='display:inline; white-space:pre;'>    </span>").replace("\t","<span style='display:inline; white-space:pre;'>    </span>").replace("[ LliureX Mirror ]","<span style='color:#0000ff;'>[ LliureX Mirror ]</span>")
                    browser.execute_script("add_text_to_output('"+urllib.quote(parsed_string, '')+"')")
                #else:
            
                    
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


    def onUnmark_Updateable(self, args):
        chroot= urllib.unquote(args[3])
        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        output=server.unmark_chroot_as_updateable(connection_user,"LtspChroot", chroot)
        self.onImageManager(args)
        pass


    def onMark_Updateable(self, args):
        chroot= urllib.unquote(args[3])
        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        output=server.mark_chroot_as_updateable(connection_user,"LtspChroot", chroot)
        self.onImageManager(args)
        pass

    def onInstall_awesome(self,args):
        chroot= urllib.unquote(args[3])

        # Prepare an X11 environment for Console (n4d service from localhost)
        #XServer = ServerProxy("https://127.0.0.1:9779")
        #screen="1000x700x24"
        #proc=XServer.xenv_prepare_X11_applications_on_chroot("", "ltspClientXServer", "Updating...", screen)
        #pid=str(proc[0]['pid'])
        #display=proc[1]

        display=":424"
        screen=" 900x650x24"
            
        XServer=LTSPX11Environment(display, screen)
        Xepid=XServer.prepare_X11_applications_on_chroot("Updating")
                

        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        output=server.update_awesome_environment(connection_user,"LtspChroot", chroot,self.srv_ip, display)
        if (output['status']==False):
            selection=subprocess.call(["zenity","--error", "--title='Installation new features'", "--text", "Install Error. Code: "+str(output['msg'])])


        
        os.kill(Xepid.pid,signal.SIGTERM)
        print (output["status"])



        self.onImageManager(args)
        pass



    def onExport(self, args):
        imgchroot="/opt/ltsp/llx-"+args[3]
        title="Exporting "+imgchroot
        print title
        
        try:
            destfile=subprocess.check_output(["zenity","--file-selection", "--save","--title='Select where to save the image...'"])
                       
            
            server = ServerProxy("https://"+self.srv_ip+":9779")
            connection_user = (self.username,self.password)

            # First chech mounts and force umount if necessary
            checked=server.force_umount_chroot(connection_user, "LtspChroot", imgchroot)

            '''
            # Prepare an X11 environment for Console (n4d service from localhost)
            XServer = ServerProxy("https://127.0.0.1:9779")
            screen="900x650x24"
            proc=XServer.xenv_prepare_X11_applications_on_chroot("", "ltspClientXServer", "BuildingImage", screen)
                        
            pid=str(proc[0]['pid'])
            display=proc[1]
                        
            print "Xephyr PID: "+pid
            
            '''

            output=server.export_ltsp_tgz(connection_user,"LtspChroot", destfile.rstrip(), args[3])
            # Remove Xephyr
            #os.kill(pid,signal.SIGTERM)
            print (output["status"])
            
                    
            browser.execute_script('$("#MessageArea").css("display", "none");')
            pass
            
            
        except Exception as e:
            print ("Press on cancel or Error"+str(e))
            pass
        
        
        # Create tar.gz from chroot...
        
        pass
    

    def onImport(self, args):
        import tarfile
        import os
        # FILE=`zenity --file-selection --title="Seleccione un archivo"`
        try:
            file=subprocess.check_output(["zenity","--file-selection", "--title='Select Image'"])
            # DO STUFF WITH FILE
            
            tar = tarfile.open(file.rstrip(), "r:gz")
            i=0
            
            for tarinfo in tar:
                if (i>0):
                    break;
                chroot=tarinfo.name
                '''
                print tarinfo.name, "is", tarinfo.size, "bytes in size and is",
                if tarinfo.isreg():
                    print "a regular file."
                elif tarinfo.isdir():
                    print "a directory."
                else:
                    print "something else."
                '''
                i=i+1
            tar.close()
                        
            
            
            try:
                
                ruta=chroot.split("/")
                
                print ruta[0]
                print ruta[0]!="opt"
                print ruta[1]
                print ruta[1]!="ltsp"
                print ruta[2]
                print chroot
                print (os.path.isdir("/"+ruta[0]+"/"+ruta[1]+"/"+ruta[2]))
                
                if((ruta[0]!="opt")or(ruta[1]!="ltsp")):
                    subprocess.call(["zenity","--error", "--title='Import Image'", "--text", \
                                            "This is not a valid LTSP Compressed Image!"])
                elif (os.path.isdir("/"+ruta[0]+"/"+ruta[1]+"/"+ruta[2])):
                    
                    selection=subprocess.check_output(["zenity","--question", "--title='Import Image'", "--text", \
                            "There is another "+ruta[2]+" in your system. Continue anyway?"])
            except Exception:
                print "CANCELLED, or exception: "+Exception
                return False
            '''
            display=":42"
            screen="600x450x16"
            
            XServer=LTSPX11Environment(display, screen)      
            Xepid=XServer.prepare_X11_applications_on_chroot("Importing image")
            '''        
            server = ServerProxy("https://"+self.srv_ip+":9779")
            connection_user = (self.username,self.password)
            output=server.import_ltsp_tgz(connection_user,"LtspChroot", file.rstrip(), ruta[2])
            # Remove Xephyr
            #os.kill(Xepid.pid,signal.SIGTERM)
            print (output["status"])
                    
            browser.execute_script('$("#MessageArea").css("display", "none");')
            pass
            
        except Exception as e:
            print ("File selection cancelled or error: "+str(e))
            browser.execute_script('$("#MessageArea").css("display", "none");')
            pass
        
        pass



    def onSetPXENetinst(self, args):

        try:
            server = ServerProxy("https://"+self.srv_ip+":9779")
            connection_user = (self.username,self.password)
            if (args[3]=="available"):
                server.set_netinstall_installable(connection_user,"n4dLTSPNetinstall")
                subprocess.call(["zenity","--warning", "--title='Menu created'", "--text", \
                                        "Now you can install LliureX through the local network."])
    
            elif (args[3]=="unavailable"):
                server.unset_netinstall_installable(connection_user,"n4dLTSPNetinstall")
                subprocess.call(["zenity","--warning", "--title='Menu created'", "--text", \
                                        "Network install has been disabled"])
            else:
                subprocess.call(["zenity","--error", "--title='Menu creation'", "--text", \
                                        "There has been an error during the menu creation!"])
        
            pass

        except Exception:
            subprocess.call(["zenity","--error", "--title='Menu creation'", "--text", \
                                        "There has been an error during the menu creation!"])
            pass
            
        
        
        

        

        pass    
    

    def onSelectIso(self, args):
        import subprocess
        
        ###import easygui
       ## #print easygui.fileopenbox()

        try:
            filename=subprocess.check_output(["zenity","--file-selection", "--title='Select a File'"])
            print filename
            cancel=False
            
            ftype=subprocess.check_output(["file","-b",str(filename).replace("\n","")])
            print ftype
            if not "ISO 9660 CD-ROM filesystem" in ftype:
                subprocess.check_output(["zenity","--error", "--text", \
                                                  "It is not a valid iso file", \
                                                  "--title", "Invalid Iso"])
                cancel=True
            elif not "Lliurex pandora" in ftype:
                selection=subprocess.check_output(["zenity","--question", \
                                                  "--title", "Not LliureX ISO", \
                                                  "--text", "It is not a valid LliureX iso file, Continue anyway?"])
                print str(selection)
            else:
                selection=subprocess.check_output(["zenity","--question", \
                                                  "--title", "LliureX ISO", \
                                                  "--text", "This is a valid LliureX ISO. Let's Go."])
                print str(selection)
                
            if not cancel:
                print "PERFORMING ACTION!!!!!!!!!!!!!!!"
          
        except Exception as e:
            print "Exception: "+str(e)
            #self.ltspError(str(e));
            pass # Click on cancel
        
        pass
    


    def n4updatemirror(self):
        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("Updating Mirror")
        connection_user = (self.username,self.password)
        #print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4dupdate(connection_user,"LliurexMirrorNonGtk")
        print ("End Mirror")
        
        return False
    
    '''    
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
            self.server.prepare_log(connection_user,"LliurexMirrorNonGtk")
            
            print ("Setting timer log")
            #gobject.timeout_add(500, self.readlog,"LliurexMirrorNonGtk", "mirror")
            gobject.timeout_add(2000, self.readlog,"LliurexMirrorNonGtk", "mirror")
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
    '''

    def onUpdateMirrorCommand(self, args):
        import threading
        
        try:
            connection_user = (self.username,self.password)
            server = ServerProxy("https://"+self.srv_ip+":9779")
            #self.server.prepare_log(connection_user,"LliurexMirrorNonGtk")
            
            # Set up X11 Environment for Chroot, Connection to n4d in local
            display=":42" # The answer to the Universe, the Existence and all other things  (i.e. Xephire Display)
            screen="1024x768"
            my_ip_for_server=self.get_my_ip_for_server()

            # XServer es una connexio a les x locals, no una connexio n4d!!
            XServer=LTSPX11Environment(display, screen)
            # PRepare X11 Xephyr environment
            
            Xepid=XServer.prepare_X11_applications_on_chroot("LliureX LTSP. Updating Mirror")
            print "Xephyr PID: "+str(Xepid.pid)
            print "1111111111111111111111"+str(my_ip_for_server)+"-"+str(display)+"-"+str(Xepid.pid)
            output=server.launchLliurexMirrorGui(connection_user, "LtspMirrorUpdater", my_ip_for_server, display, Xepid.pid)
            print "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            
        except Exception as e:
            print ("Exception in XServer...:"+str(e))
            return None
   
            
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

            # check version
            server = ServerProxy("https://"+ltspadmin.srv_ip+":9779")
            version=server.getVersion("", "n4dLTSPVersion");
            print version
            if((compareVersion(version,ltspadmin.require_version_plugins)==-1)):
                subprocess.call(["zenity","--warning", "--title='Version unmatch..'", "--text", \
                                        "Version "+ltspadmin.require_version_plugins+" of n4d-ltsp-plugins is recommended on server.\n Version installed is "+version+"\n\nIt can cause some abnormal behaviour.", "--no-wrap"])
                #print "required version "+ltspadmin.require_version_plugins


            # Authentication
            groups=self.server.validate_user(self.username,self.password)
            print (groups)
        
            if (('adm' in groups[1])or('admins' in groups[1])or('teachers' in groups[1])):
                print ("User Validated")
            
                self.connection_user = (self.username,self.password)
                self.jsonclients=self.server.get_ltsp_conf(self.connection_user,'LtspClientConfig')
                #status
                try:
                    exec("status="+self.server.get_status("","LliurexMirrorNonGtk"))
                except Exception:
                    status={'status':'uninstalled','msg':'LliureX Mirror is not installed'}
                #print (":::::::::::"+status)
                self.mirror_installed=status['status']
                ######################
                ##self.mirror_installed='unavailable'
                print (self.mirror_installed)
                #print (":::::::::::"+status)
                if self.mirror_installed=='available':
                    # test if mirror is sane
                    
                    if (self.check_mirror=='true'):
                        try:
                            exec("status_pool="+self.server.check_mirror("", "LliurexMirrorNonGtk"))
                        except Exception:
                            status_pool={'status':'Unavailable', 'msg':'Pool is not available'}
                    else:
                            status_pool={'status':'Unchecked', 'msg':'Pool has not been checked'}
                            
                    self.pool_ok=status_pool['status']
                    
                    #self.pool_ok=str(self.server.check_mirror("", "LliurexMirrorNonGtk")['status']).strip();
                    
                    # Abstract
                    try:
                        file = open('/var/log/lliurex/lliurex-mirror.log', 'r')
                        self.abstract=file.read()
                    except Exception:
                        self.abstract="Mirror log file not found."
                        pass
        
                    # Date
                    try:
                        exec("datestatus="+self.server.n4d_get_unix_date("", "LliurexMirrorNonGtk"))
                        if datestatus['status']:
                            self.date=datestatus['date']
                        else:
                            self.date=""
                    except Exception:
                        self.mirror_installed='uninstalled'
                
                elif self.mirror_installed=='uninstalled':
                    self.pool_ok="Uninstalled";
                    self.abstract="Mirror Not Installed"
                else: # i.e. Busy
                    self.abstract="LliureX Mirror is Working"
                    #self.date=""
                
                # Check sanity in PXE Menu
                server = ServerProxy("https://"+ltspadmin.srv_ip+":9779")
                image_error_list = server.check_PXE_menu("","LtspChroot");
                
                if(len(image_error_list)>0):
                    print image_error_list;
                    selection=subprocess.call(["zenity","--question", "--title='PXE Menu is inconsistent'", "--text", \
                                        "There are "+str(len(image_error_list))+" invalid menu entries in PXE Menu. Shall LliureX LTSP Manager delete them?", "--no-wrap"])
            
                    if (selection==0):
                        self.connection_user = (self.username,self.password)
                        server = ServerProxy("https://"+ltspadmin.srv_ip+":9779")
                        server.clean_tftpboot(self.connection_user, "LtspChroot" ,image_error_list);
                        #server.clean_tftpboot(self.connection_user, "LtspChroot" ,str(image_error_list));
                        
                
                
                # Launch browser

                print ("loginSuccess('"+self.mirror_installed+"','"+self.pool_ok+"')")

                browser.execute_script("loginSuccess('"+self.mirror_installed+"','"+self.pool_ok+"')")

                    
                # END if self.mirror_installed=="available":
                
                return True
            else:
                browser.execute_script("loginFail('"+self.username+"')")
                return False
            
            #connection_user = (self.username,self.password)
            #self.jsonclients=self.server.get_ltsp_conf(connection_user,'LtspClientConfig')
        except Exception as e:
            print ("Exception:")
            print (e)
            file = os.path.abspath('webgui/ServerError.html')
            uri = 'file://' + urllib.pathname2url(file)
            browser.open_url(uri)
            pass
    

    def onrefreshPXEMenu(self, args):
            try:
                server = ServerProxy("https://"+ltspadmin.srv_ip+":9779")
                image_error_list = server.check_PXE_menu("","LtspChroot");
                print str(image_error_list)
                self.connection_user = (self.username,self.password)
                server = ServerProxy("https://"+ltspadmin.srv_ip+":9779")
                server.clean_tftpboot(self.connection_user, "LtspChroot" ,str(image_error_list));
                selection=subprocess.call(["zenity","--info", "--title='PXE Menu Reneneration'", "--text", "Done"])
                return True        
            except Exception as e:
                print "ERRORRRRRRRRR!!!!!!!"+str(e)
                return False
  



    def onMirrorManager(self, args):
        file = os.path.abspath('webgui/MirrorManager.html')
        if (type(self.date)==type(None)):
            self.date=""
        uri = 'file://' + urllib.pathname2url(file)+'?mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip+'&amp;mirror_abstract='+self.abstract+'&amp;pool_ok='+self.pool_ok+'&amp;mirror_date='+self.date
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
            print "****"+str(self.imagelist)+"*****"
    
            file = os.path.abspath('webgui/ImageManager.html')
            my_ip_for_server=self.get_my_ip_for_server()            
            #uri = 'file://' + urllib.pathname2url(file)+'?imageData='+json.dumps(json_obj)+'&amp;mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip+'&amp;username='+self.username+'&amp;srv_ip='+self.password+'&amp;xserver_ip='+my_ip_for_server
            uri = 'file://' + urllib.pathname2url(file)+'?imageData='+json.dumps(json_obj)+'&amp;mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip+'&amp;username='+self.username+'&amp;srv_ip='+self.srv_ip+'&amp;userpass='+self.password+'&amp;xserver_ip='+my_ip_for_server
            print (uri)
            browser.open_url(uri)
        except Exception as e:
            print ("[LTSP Exception]"+str(e))



    def onIsoManager(self, args):
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
            
            server = ServerProxy("https://"+self.srv_ip+":9779")
            netinst_installed=server.is_netinstall_installed("","n4dLTSPNetinstall");
            netinst_available=server.is_netinstall_available("","n4dLTSPNetinstall");
    
            file = os.path.abspath('webgui/IsoManager.html')            
            uri = 'file://' + urllib.pathname2url(file)+'?imageData='+json.dumps("")+'&amp;mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip+'&amp;netinst_installed='+str(netinst_installed)+'&amp;netinst_available='+str(netinst_available);
    
            
            print (uri)
            browser.open_url(uri)
        except Exception as e:
            print ("[LTSP Exception]"+str(e))


    def onClientManager(self, args):   
        file = os.path.abspath('webgui/ClientManager.html')
        print ('&amp;srv_ip='+self.srv_ip)

        self.connection_user = (self.username,self.password)
        self.jsonclients=self.server.get_ltsp_conf(self.connection_user,'LtspClientConfig')

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
        uri = 'file://' + urllib.pathname2url(file)+'?meta='+urllib.unquote(id)+'&amp;mirror_installed='+self.mirror_installed+'&amp;chroot='+str(self.getChrootFromImageList(id))+'&amp;xdesktop='+str(self.HasClientXFCEInstalled(id))
        browser.open_url(uri)

    def getChrootFromImageList(self, id):
        '''
        Returns the chroot directory corresponding to the image with a concrete id
        '''
        for element in self.imagelist['images']:
            if element['id']==id:
                return element['squashfs_dir']

        return None

    def getImagenameFromImageList(self, id):
        '''
        Returns the chroot directory corresponding to the image with a concrete id
        '''
        for element in self.imagelist['images']:
            if element['id']==id:
                return element['image_file']

        return None

    def HasClientXFCEInstalled(self, id):
        '''
        Returns true if client has installed XFCE
        '''
        print "get xfce client from image list..."
        for element in self.imagelist['images']:
            if element['id']==id:
                if (str(element['lliurex_version']).find("xdesktop")!=-1):
                    return True
                else:
                    return False
            
            #if element['id']==id:
            #    return element['squashfs_dir']

        return False

    def ClientSaveConfig(self, args):
        print ">>>>>>>>>>>>>>>>"+str(args);
        #print (urllib.unquote(args[3]))
        self.jsonclients=urllib.unquote(args[3])
        print (self.jsonclients)
        connection_user = (self.username,self.password)
        default_type=args[4]
        default_session=args[5]
        timeout=args[6]
        default_boot=args[7]
        use_swap=args[8]
        nbd_swap_size=args[9]
        self.server.set_ltsp_conf(connection_user,'LtspClientConfig',self.jsonclients, default_type, default_session, use_swap, nbd_swap_size)
        
        print "[LliureXLTSPAdmin] Modifying PXE Boot with timeout="+timeout+" and default boot="+default_boot
        
        self.server.setImageDefaultBoot(connection_user,'n4dPXEManager',default_boot, timeout)
                
        file = os.path.abspath('webgui/ClientManager.html')
        # Reload new config
        self.jsonclients=self.server.get_ltsp_conf(self.connection_user,'LtspClientConfig')
        uri = 'file://' + urllib.pathname2url(file)+'?clientlist='+self.jsonclients+'&amp;mirror_installed='+self.mirror_installed+'&amp;srv_ip='+self.srv_ip
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
        #print ("Connection user: "+str(connection_user))
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
        #print ("Connection user: "+str(connection_user))
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
        #print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4d_update_client(connection_user,"LtspImage",img_id, img_chroot, self.username,self.password)
        print ("[n4dUpdateClient] End Updating Client client...")
        
        return False

    def n4dDeleteClient(self, img_id, img_chroot, img_file):
        '''
        Deletes img and chroot for a client
        '''

        #import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("[n4dDeleteClient] Deleting client...")
        connection_user = (self.username,self.password)
        #print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        result=server.n4d_delete_client(connection_user,"LtspImage",img_id, img_chroot, img_file, connection_user)
        print ("[n4dDeleteClient] End Deleting Client client...")
        return result
        #return False


    def n4dInstallXFCE(self, img_id, img_chroot):
        '''
        Installs XFCE into chroot through N4D
        '''
        import time
        
        server = ServerProxy("https://"+self.srv_ip+":9779")

        print ("[n4dModifyClient] Installing XFCE...")
        connection_user = (self.username,self.password)
        #print ("Connection user: "+str(connection_user))
        # n4d connection to server
        
        server.n4d_install_xfce(connection_user,"LtspImage",img_id, img_chroot, connection_user)
        print ("[n4dModifyClient] Installing XFCE...")
        
        return False

    ## Operations with chroot (main, uses n4d functions specified up)

    def onApplyChangesToImageWithCheck(self, args):
        '''
        Regenerates img file from a chroot via n4d, calls n4dGenerateImg
        '''
        import threading
        import time        

        # Getting chroot
        imgchroot=str(urllib.unquote(args[4]))
        #print "id="+id
        print ("Image is: "+imgchroot)
        
        server = ServerProxy("https://"+self.srv_ip+":9779")
        # Check if exists enough space on disk
        connection_user = (self.username,self.password)

       
        #self.ShowWaitWindow("Calculating free and needed space")

        #spacefree="{'status':True, 'free':'20000000', 'used': str(total_size)}";
        spacefree=server.is_enough_space_in_disk(connection_user,"LtspImage", imgchroot)

        print str(spacefree)
        if (spacefree['status']==False):
            browser.execute_script("AskWhatToDoIfNotEnoughSpace('"+imgchroot+"','"+spacefree['free']+"','"+spacefree['used']+"')")
        else:
            self.onApplyChangesToImage(args)
        

    def onApplyChangesToImage(self, args):
      
        # Getting chroot
        
        imgchroot=str(urllib.unquote(args[4]))
        print ("Image is: "+imgchroot)

        if(len(args)>5):
            ret_value=str(urllib.unquote(args[5]))
            if (ret_value=='cancel'):
                return False;

        # server connection
        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        
        command="ltsp-update-image "+imgchroot
        my_ip_for_server=self.get_my_ip_for_server()
        
        try:
        
            # First chech mounts and force umount if necessary
            checked=server.force_umount_chroot(connection_user, "LtspChroot", imgchroot)

            # Prepare an X11 environment for Console (n4d service from localhost)
            XServer = ServerProxy("https://127.0.0.1:9779")
            screen="900x650x24"
            proc=XServer.xenv_prepare_X11_applications_on_chroot("", "ltspClientXServer", "BuildingImage", screen)
            
            pid=str(proc[0]['pid'])
            display=proc[1]
                        
            print "Xephyr PID: "+pid
            output=server.run_Image_Command(connection_user, "LtspImage", command, my_ip_for_server, display, pid)
            print str(output)
            self.onImageManager(args)
            
        except Exception as e:
                print ("[LTSPAdmin] Exception in onApplyChangesToImage: "+str(e))
                browser.execute_script("alert('Exception in onApplyChangesToImage:"+str(e)+"')")
        


    def onApplyChangesToImage_old(self, args):

        import threading

        # Getting chroot
        imgchroot=str(urllib.unquote(args[4]))
        print ("Image is: "+imgchroot)

        if(len(args)>5):
            ret_value=str(urllib.unquote(args[5]))
            #print "id="+id
            if (ret_value=='cancel'):
                return False;

        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        #server.regenerate_img(connection_user,"LtspImage",img_chroot) 
        # Prepare X11 environment
        display=":42" 
        screen="1024x768x16"
        command="ltsp-update-image "+imgchroot
        my_ip_for_server=self.get_my_ip_for_server()
        print (my_ip_for_server)
        
        try:
            # XServer es una connexio a les x locals, no una connexio n4d!!
            XServer=LTSPX11Environment(display, screen)
            
            # PRepare X11 Xephyr environment
            Xepid=XServer.prepare_X11_applications_on_chroot("Applying changes into chroot")
            print "Xephyr PID: "+str(Xepid.pid)
            
            output=server.run_Image_Command(connection_user, "LtspImage", command, my_ip_for_server, display, str(Xepid.pid))
            print str(output)
            
        except Exception as e:
                print ("*********"+str(e))
                browser.execute_script("alert('Exception "+str(e)+"')")
            
    
        '''
        browser.execute_script("add_text_to_output('Going to regenerate img...')");
        
        server = ServerProxy("https://"+self.srv_ip+":9779")
        # Check if exists enough space on disk
        connection_user = (self.username,self.password)
        
        
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
            #gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            gobject.timeout_add(2000, self.readlog,"LtspImage", "lstpimages")
            print ("Set timer log")
            
            print ("Setting timer n4dGenerateImg")
        
            t = threading.Thread(target=self.n4dGenerateImg, args=(imgchroot,))
            t.daemon=True
            t.start()
            
            print ("Set timer n4dGenerateImg")
            
        except Exception as e:
            print str(e)
            

    '' '
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
        #gobject.timeout_add(500, self.readlog,"LliurexMirrorNonGtk", "mirror")
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
            #gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            gobject.timeout_add(2000, self.readlog,"LtspImage", "lstpimages")
            #print ("Set timer log")
            
            print ("[LliureX LTSP] Setting timer for n4d Create Client")
        
            t = threading.Thread(target=self.n4dInstallXFCE, args=(id, imgchroot,))
            t.daemon=True
            t.start()
            
        except Exception as e:
            print str(e)
            


    def onCreateNewClient(self, args):
        '''
        Creates a new chroot and img file.
        '''
        import threading

        browser.execute_script("DisableConfirmButton()");
        
        print ("Create Image. Args:")
        print (args)

        # Getting chroot
        id=args[3]
        
        # Getting chroot
        imgchroot=str(self.getChrootFromImageList(id))
        #print "id="+id
        print ("Image is: "+imgchroot)
        print ("Create Client: "+id)

        
        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
       
        # DEPRECATED: Prepare X11 environment
        #display=":42" 
        #screen="1024x768x16"

        command="lliurex-ltsp-create-client "+id
        my_ip_for_server=self.get_my_ip_for_server()
        print (my_ip_for_server)
        
        try:
            # DEPRECATED: XServer es una connexio a les x locals, no una connexio n4d!!
            ##XServer=LTSPX11Environment(display, screen)

            # Prepare an X11 environment for Console (n4d service from localhost)
            XServer = ServerProxy("https://127.0.0.1:9779")
            screen="1000x700x24"
            proc=XServer.xenv_prepare_X11_applications_on_chroot("", "ltspClientXServer", "CreateClient", screen)
            
            pid=str(proc[0]['pid'])
            display=proc[1]
            

            # DEPRECATED_ PRepare X11 Xephyr environment
            #Xepid=XServer.prepare_X11_applications_on_chroot("Create New Client")
            #print "Xephyr PID: "+str(Xepid.pid)
            
            output=server.run_Image_Command(connection_user, "LtspImage", command, my_ip_for_server, display, pid)
            print str(output)
            
        except Exception as e:
                print ("[LliureXLTSPAdmin] Exception in onCreateNEwClient: "+str(e))
                browser.execute_script("alert('Exception onCreateNEwClient: "+str(e)+"')")
            

        
        
        
        '''  DEPRECATED
        Creates a new chroot and img file. Uses n4dCreateClient.
        '' '
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
            #gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            gobject.timeout_add(2000, self.readlog,"LtspImage", "lstpimages")
            #print ("Set timer log")
            
            print ("[LliureX LTSP] Setting timer for n4d Create Client")
        
            t = threading.Thread(target=self.n4dCreateClient, args=(id, imgchroot,))
            t.daemon=True
            t.start()
            
        except Exception as e:
            print str(e)
    ''' 

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
            #gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
            gobject.timeout_add(2000, self.readlog,"LtspImage", "lstpimages")
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

        browser.execute_script("DisableConfirmButton()");

        print ("Deleting Image. Args:")
        print (args)

        # Getting chroot
        id=args[3]
        imgchroot=str(self.getChrootFromImageList(id))
        img_client=str(self.getImagenameFromImageList(id))

        print ("Image is: "+imgchroot)

        print ("Returns: ")
        
        result=self.n4dDeleteClient(id, imgchroot,img_client)
        if(result['status']==True):
            subprocess.call(["zenity","--info", "--title='Deleting Image'", "--text", \
                                        "Image deleted successfully", "--no-wrap"])
        else:
            subprocess.call(["zenity","--error", "--title='Deleting Image'", "--text", \
                                        str(result['msg']), "--no-wrap"])
        
        #print self.server.prepare_log("","LtspImage")
        #print self.server.exist_log_file("","LtspImage")
        
        #self.initline=0;
        #self.numlines=1000;
        #self.endline=0;        
        #self.count=0;
        
        #try:
        #    print ("[LliureX LTSP] Setting timer log")
        #    # for self.readlog: LtspImage is the class name that is logging and lstpimages, the log name
        #    #gobject.timeout_add(500, self.readlog,"LtspImage", "lstpimages")
        #    gobject.timeout_add(2000, self.readlog,"LtspImage", "lstpimages")
        #    #print ("Set timer log")
        #    
        #    print ("[LliureX LTSP] Setting timer for n4d Create Client")
        #
        #    t = threading.Thread(target=self.n4dDeleteClient, args=(id, imgchroot,img_client,))
        #    t.daemon=True
        #    t.start()
        #    
        #    #print ("Set timer ")
        #    
        #except Exception as e:
        #    print str(e)

    # End Main functions to perform predefined actions in chroot



    def onExecuteInChroot(self, args):
        '''
        Executes some specific functions into chroot. After them, we shoud to regenerate img file.
        '''

        import urllib
        #import subprocess
        command=""
        screen="1024x768x24"

        if (args[3]=='terminal' or args[3]=='gnome-terminal'):
            #command="terminal"
            command="gnome-terminal"
            screen="650x402x24"
        elif args[3]=='lliurex-up':
            command="lliurex-up"
            screen="702x722x24"
        elif args[3]=='synaptic':
            command="synaptic"
            screen="1055x725x24"
        elif args[3]=='texteditor':
            command="x-editor"
            screen="576x740x24"
        elif args[3]=='launch_session':
            command="start_session"
            screen="1024x768x24"
        elif args[3]=='llum':
            command="llum"
            screen="698x499x24"
        #elif args[3]=='apply':
        #    # Apply changes to image!
        #    self.updateImage(urllib.url2pathname(args[4]));
        elif args[3]=='xfce':
            #print "iiiiis xfce!!"
            ## TO MODIFY
            #self.installXFCEonClient(urllib.url2pathname(args[4]));
            #command="apt-get install lliurex-cdd-xdesktop"
            screen="570x570x24"
            command=args[3]
            #return 0
            pass
        else:
            #Otherwise it's a "run_command" option, so, command is this.
            command=args[3]

        # Gettint Chroot


        chroot=urllib.url2pathname(args[4])
        print ("Executing "+command+" on "+chroot)

        # Configure Server LTSP connection
        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        my_ip_for_server=self.get_my_ip_for_server()
        print (my_ip_for_server)


        try:
            print (str(connection_user)+" : "+chroot+" : "+command+" : "+my_ip_for_server+" : "+screen)
            output=server.run_command_on_chroot(connection_user, "LtspChroot", chroot, command, my_ip_for_server, screen)
            #output=server.run_command_on_chroot(connection_user, "LtspChroot", chroot, command, my_ip_for_server, "", "")


            ##### TO REVIEWWWWWWWWW
            browser.execute_script("ShowApplyMessage()");
            
        except Exception as e:
            print ("Exception in XServer...:"+str(e))
            browser.execute_script("ShowApplyMessage()");
            return None
        return None

                     

    def deprecated_onExecuteInChroot(self, args):
        '''
        Executes some specific functions into chroot. After them, we shoud to regenerate img file.
        '''
        import urllib
        #import subprocess
        command=""
        print "***********"+args[3]
        screen="1024x768x24"
        #sys.stdout = open('/tmp/stdout.txt', 'a')
        if (args[3]=='terminal' or args[3]=='gnome-terminal'):
            #command="terminal"
            command="gnome-terminal"
            screen="650x402x24"
        elif args[3]=='lliurex-up':
            command="lliurex-up"
            screen="702x722x24"
        elif args[3]=='synaptic':
            command="synaptic"
            screen="1055x725x24"
        elif args[3]=='texteditor':
            command="x-editor"
            screen="576x740x24"
        elif args[3]=='launch_session':
            command="start_session"
            screen="1024x768x24"
        elif args[3]=='llum':
            command="llum"
            screen="698x499x24"
        #elif args[3]=='apply':
        #    # Apply changes to image!
        #    self.updateImage(urllib.url2pathname(args[4]));
        elif args[3]=='xfce':
            #print "iiiiis xfce!!"
            ## TO MODIFY
            #self.installXFCEonClient(urllib.url2pathname(args[4]));
            #command="apt-get install lliurex-cdd-xdesktop"
            screen="570x570x24"
            command=args[3]
            #return 0
            pass
        else:
            print "*****************: "+args[3]
            #Otherwise it's a "run_command" option, so, command is this.
            command=args[3]

        # Gettint Chroot

        print command
        chroot=urllib.url2pathname(args[4])
        print ("Executing "+command+" on "+chroot)

        # Configure Server LTSP connection
        server = ServerProxy("https://"+self.srv_ip+":9779")
        connection_user = (self.username,self.password)
        my_ip_for_server=self.get_my_ip_for_server()
        print (my_ip_for_server)

        # Set up X11 Environment for Chroot, Connection to n4d in local
        display=":42" # The answer to the Universe, the Existence and all other things  (i.e. Xephire Display)
        #screen="1024x768x16"


        # XServer es una connexio a les x locals, no una connexio n4d!!
        XServer=LTSPX11Environment(display, screen)

        # LOCAL X11 Server for remote CHROOT

        try:
            # PRepare X11 Xephyr environment
            title="LliureX LTSP: '"+str(command)+"' en "+str(chroot)
            Xepid=XServer.prepare_X11_applications_on_chroot(title)
            print "Xephyr PID: "+str(Xepid.pid)
            if (command=="start_session"):
                ret=server.prepare_chroot_for_session(connection_user, "LtspChroot",chroot)
                print (str(ret))
                
                #XServer.prepare_chroot_for_session()
            
            # Run APP into REMOTE Server
            
            
            output=server.run_command_on_chroot(connection_user, "LtspChroot", chroot, command, my_ip_for_server, display, str(Xepid.pid))
            print str(output)
            
            #print ("OUTPUT: "+str(output['msg']))
            try:
                if (str(output['msg'])=='127'):
                    print ("command not found")
                    browser.execute_script("alert('Command "+command+" not found!')")
            except Exception as e:
                    # some error messages could give some errors
                    pass

                #print ("ERROR: COMMAND NOT FOUND")
            # Delete XServer: When Finished, delete XServer
            print ("UMOUNT CHROOT")
            XServer.remove_X11_applications_on_chroot()
            
            print ("UMOUNT HOME")
            if (command=="start_session"):
                server.remove_session(connection_user, "LtspChroot", chroot)

                #XServer.remove_session()
            
            #subprocess.call(["zenity","--warning", "--title=Remember...'", "--text", \
            #                            "Remember that you have to hit on Apply Changes to Apply Changes into This Client Image.", "--no-wrap"])
            
            browser.execute_script("ShowApplyMessage()");
   
            
        except Exception as e:
            print ("Exception in XServer...:"+str(e))
            browser.execute_script("ShowApplyMessage()");
            return None
        return None

                     


        #server.run_command_on_chroot(connection_user,'chroot')
        #self.jsonclients=self.server.get_ltsp_conf(connection_user,'LtspClientConfig')
        #log_prepared=server.("", "LliurexMirrorNonGtk");
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

    def ShowWaitWindow(self, msg):
        '''
        Shows a new window with the "wait..." message
        '''
    

        waitwindow = Gtk.Window()
        waitwindow.set_size_request(300,150)
        waitsplitter = Gtk.Paned(orientation=Gtk.Orientation.VERTICAL)
        waitwindow.add(waitsplitter)
        waitwindow.set_icon_from_file("/usr/share/icons/X-ltsp-admin.png")
        #waitlang=language
        

        #create the WebView
        waitview = WebKit.WebView()
        #waitview.get_settings().set_property("enable-developer-extras",True)
        #self.inspector = self.view.get_inspector()
        #self.inspector.connect("inspect-web-view",self.activate_inspector, self.splitter)

        waitsw = Gtk.ScrolledWindow() 
        waitsw.add(waitview) 
        waitsplitter.add1(waitsw)

        waitwindow.show_all()

        waitwindow.set_title("LliureX LTSP")
        # abre la pagina
        file = os.path.abspath('webgui/waiting.html')
        url = 'file://' + urllib.pathname2url(file)+'?server='+ltspadmin.srv_ip;
   
        waitview.open(url)
    
        return False

        
   
    

   
    def get_my_ip_for_server(self):
        import lliurex.net
        import subprocess
        
        # If we are in the server, return localhost
        if self.srv_ip=='127.0.0.1':
            return '127.0.0.1'
        
        if self.selected_ip_for_server!="":
            return self.selected_ip_for_server;

        # Else, let's check the ip address in the same network that server
        for interface in lliurex.net.get_devices_info():
            try:
                ip=interface['ip']
                mask=interface['netmask']
                ipnet=lliurex.net.get_network_ip(ip, mask)
                ipsrvnet=lliurex.net.get_network_ip(str(self.srv_ip), mask)
                if ipnet==ipsrvnet:
                    return ip
            except Exception as e:
                print "[LTSP get_my_ip_for_server] error:"+str(e)
                
                
        # If arrives here (server is not in our network), let's check local interfaces to other networks and user will select it
        output = subprocess.check_output(["ip","addr"])
        num_ips=0
        ip_list=[]
        command=["zenity", "--list",  "--title=Select local IP for this server","--column=Available Local IP Adresses"]
        for i in output.split("\n"):
            if (("inet" in i) and not("inet6" in i)):
                num_ips=num_ips+1
                ip=((((" ".join(i.split())).split(" ")[1]).split("/"))[0])
                command.append(ip)

        print ip_list
        print num_ips

        print command
        if(num_ips>0):
            try:
                resp=subprocess.check_output(command)
                print ("RETURN "+resp)
                if (resp):
                    self.selected_ip_for_server=resp.strip()
                    return resp.strip()
                else:
                    self.selected_ip_for_server=resp.strip()
                    return '127.0.0.1'
            except:
                print "Exception"
                return '127.0.0.1'
        
        # Not should arrive here...
        print ("[LTSP-ADMIN] Warning: Not found local IP for remote server!")
        return '127.0.0.1'
        pass

            
    def update_config_images(self, imageData):
        
        pass


    def ltspError(self, errordesc):
        '''
        Shows an error window instead of "Unable to open..."
        '''
        file = os.path.abspath('webgui/ServerError.html')
        #uri = 'file://' + urllib.pathname2url(file)+'?server='+ltspadmin.srv_ip;
        uri = 'file://' + urllib.pathname2url(file)+'?error='+urllib.pathname2url(errordesc);
        browser.open_url(uri)
    

# Utility
def compareVersion(v1, v2):
    '''
    returns 0 if v2=v2, 1 if v1>v2 and -1 if v1<v2
    '''
    if (v2=="" or v1==""):
        return -2

   

    pos=0
    a=v1.split(".")
    b=v2.split(".")

    
    lenmax=min(len(a), len(b))
    print lenmax

    for i in range(0,lenmax):
        if(int(a[i])>int(b[i])):
            return 1
        elif(int(b[i])>int(a[i])):
            return -1
        # otherwise continue
        
    #if we are here, all subversions are equal
    
    if(len(a)==len(b)):
        return 0     # same length and 
    elif(len(a)>len(b)):
        return 1
    
    return -1
    

if __name__ == "__main__":
    
    import json

    try:
        # set working directory
        conffile=open('/etc/lliurex-ltsp-admin/settings.json')
        myjson=conffile.read()
        dic=json.loads(myjson)
        print ("Reading App from: "+dic["globalSettings"]["app_dir"])
        print ("Check Mirror: "+dic["globalSettings"]["check_mirror"])
    
        os.chdir(dic["globalSettings"]["app_dir"])

    
        # Create an App instance
        ltspadmin = LliureXLTSPAdmin(dic["globalSettings"]["check_mirror"])
        
        # create Browser
        browser = Browser(language=ltspadmin.language)
       
        if ltspadmin.ConnectionStatus=='off':
            file = os.path.abspath('webgui/LocalServerError.html')
            pass
        else:
            
            '''            
            # check version
            server = ServerProxy("https://"+ltspadmin.srv_ip+":9779")
            version=server.getVersion("", "n4dLTSPVersion");
            print version
            if((compareVersion(version,ltspadmin.require_version_plugins)==-1)):
                subprocess.call(["zenity","--warning", "--title='Version unmatch..'", "--text", \
                                        "Version "+ltspadmin.require_version_plugins+" of n4d-ltsp-plugins is recommended on server.\n Version installed is "+version+"\n\nIt can cause some abnormal behaviour.", "--no-wrap"])
                #print "required version "+ltspadmin.require_version_plugins
            '''    
            
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
    except Exception as e:
                print str(e)
                subprocess.call(["zenity","--error", "--title='General Error'", "--text", \
                                        "LliureX LTSP couldn't start.\nIt's strongly caused because your server is not initializated.\nInitialize it with Zero Server Wizard, please.", "--no-wrap"])
        
        
