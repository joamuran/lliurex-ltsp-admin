import os
import pygtk
import gtk
from xmlrpclib import *

def run_script(script, stdin=None):
    """Returns (stdout, stderr), raises error on non-zero return code"""
    import subprocess
    # Note: by using a list here (['bash', ...]) you avoid quoting issues, as the 
    # arguments are passed in exactly this order (spaces, quotes, and newlines won't
    # cause problems):
    proc = subprocess.Popen(['bash', '-c', script],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        stdin=subprocess.PIPE)
    stdout, stderr = proc.communicate()
    if proc.returncode:
        raise ScriptException(proc.returncode, stdout, stderr, script)
    return stdout, stderr

class ScriptException(Exception):
    def __init__(self, returncode, stdout, stderr, script):
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr
        Exception.__init__('Error in script')

def messages():
    interface=run_script('ip route | grep default | cut -d " " -f5')[0].rstrip()
    mac=run_script('/sbin/ifconfig | grep '+interface+' | cut -f11 -d" "')[0].rstrip()
    ip=run_script('/sbin/ifconfig '+interface+' | grep inet | cut -f2 -d":" | cut -f1 -d" "')[0].rstrip()
    cpu=run_script('cat /proc/cpuinfo | grep "^model name" | head -1 | sed "s/.*: //"')[0].rstrip()
    ram=run_script('free -m | grep "^Mem" | awk \'{print $2}\'')[0].rstrip()
    vga=run_script('lspci | grep "VGA" | sed "s/.* \[//" | sed "s/\]//"')[0].rstrip()

    print "iface:"+interface
    print "mac:"+mac
    print "ip"+ip
    print "cpu"+cpu
    print "ram"+ram
    print "vga"+vga
  
class ClientInfoDlg(gtk.Window):
    def __init__(self):
	self.interface=run_script('ip route | grep default | cut -d " " -f5')[0].rstrip()
	self.mac=run_script('/sbin/ifconfig | grep '+self.interface+' | cut -f11 -d" "')[0].rstrip()
	self.ip=run_script('/sbin/ifconfig '+self.interface+' | grep inet | cut -f2 -d":" | cut -f1 -d" "')[0].rstrip()
	self.cpu=run_script('cat /proc/cpuinfo | grep "^model name" | head -1 | sed "s/.*: //"')[0].rstrip()
	self.ram=run_script('free -m | grep "^Mem" | awk \'{print $2}\'')[0].rstrip()
	self.vga=run_script('lspci | grep "VGA" | sed "s/.* \[//" | sed "s/\]//"')[0].rstrip()
	
	# GUI
	super(ClientInfoDlg, self).__init__()
	
	self.set_size_request(400, 200)
	
	self.set_position(gtk.WIN_POS_CENTER)
	self.connect("destroy", gtk.main_quit)
	self.set_title("LliureX LTSP Client Info")
	
	
	
	hboxglobal=gtk.HBox(False, 0)
	
	vboxglobal = gtk.VBox(False, 0)
	image = gtk.Image()
	image.set_from_file("/usr/share/icons/lliurex-neu/48/places/start-here.png")
	image.show()
	hboxglobal.pack_start(image, False, False, 0)

	##NETWORK INFO
	
	labelframenetwork=gtk.Frame("Network")
	NetworkTable=gtk.Table(3,3, False)
	
	#iface
	ifacelabel=gtk.Label("Interface")
	ifacelabel.set_alignment(0.1, 0)
	ifacelabel.set_justify(gtk.JUSTIFY_LEFT)
	ifacelabel.set_line_wrap(True)
	NetworkTable.attach(ifacelabel,0,1,0,1)
	iface=gtk.Label(self.interface)
	iface.set_alignment(0.1, 0)
	NetworkTable.attach(iface,1,3,0,1)
	
	#mac
	maclabel=gtk.Label("MAC")
	maclabel.set_alignment(0.1, 0)
	maclabel.set_justify(gtk.JUSTIFY_LEFT)
	maclabel.set_alignment(0.1, 0)
	maclabel.set_line_wrap(True)
	NetworkTable.attach(maclabel,0,1,1,2)
	macaddr=gtk.Label(self.mac)
	macaddr.set_alignment(0.1, 0)
	NetworkTable.attach(macaddr,1,2,1,2)
	bt_send_mac = gtk.Button("Copy MAC to server clipboard")
	bt_send_mac.set_alignment(0.1, 0)
	NetworkTable.attach(bt_send_mac,2,3,1,2)

	
	#ip
	iplabel=gtk.Label("IP")
	iplabel.set_alignment(0, 0.5)
	iplabel.set_justify(gtk.JUSTIFY_LEFT)
	iplabel.set_line_wrap(True)
	NetworkTable.attach(iplabel,0,1,2,3)
	ipaddr=gtk.Label(self.ip)
	ipaddr.set_alignment(0, 0.5)
	NetworkTable.attach(ipaddr,1,3,2,3)
	
	
	labelframenetwork.add(NetworkTable)
	vboxglobal.pack_start(labelframenetwork)
	
	
	##CPU INFO
	
	labelframeCPU=gtk.Frame("CPU")
	CPUTable=gtk.Table(3,3, False)
	
	#cpu
	cpulabel=gtk.Label("CPU")
	cpulabel.set_alignment(0.1, 0)
	cpulabel.set_justify(gtk.JUSTIFY_LEFT)
	cpulabel.set_line_wrap(True)
	CPUTable.attach(cpulabel,0,1,0,1)
	selfcpu=gtk.Label(self.cpu)
	selfcpu.set_alignment(0.1, 0)
	CPUTable.attach(selfcpu,1,3,0,1)
	
	#ram
	ramlabel=gtk.Label("RAM")
	ramlabel.set_alignment(0.1, 0)
	ramlabel.set_justify(gtk.JUSTIFY_LEFT)
	ramlabel.set_line_wrap(True)
	ramlabel.set_alignment(0.1, 0)
	CPUTable.attach(ramlabel,0,1,1,2)
	memory=gtk.Label(self.ram)
	CPUTable.attach(memory,1,3,1,2)
	
	#ip
	vgalabel=gtk.Label("Video Card")
	vgalabel.set_alignment(0.1, 0)
	vgalabel.set_justify(gtk.JUSTIFY_LEFT)
	vgalabel.set_line_wrap(True)
	CPUTable.attach(vgalabel,0,1,2,3)
	videocard=gtk.Label(self.vga)
	videocard.set_alignment(0.1, 0)
	CPUTable.attach(videocard,1,3,2,3)
		
	labelframeCPU.add(CPUTable)
	vboxglobal.pack_start(labelframeCPU)
		
	
	# Events
	bt_send_mac.connect("clicked", self.on_send_mac)
    
	hboxglobal.add(vboxglobal)
	self.add(hboxglobal)
	self.show_all()

    def on_send_mac(self, button):
	print "Sending MAC "+self.mac
	# Serverproxy shoulb be the Serve IP Address
	# self.server = ServerProxy("https://server:9779")
	self.server = ServerProxy("https://localhost:9779")
	self.connection_user = ("")
	self.server.setClipboard(self.connection_user,"LTSPClipboard",self.mac)


ClientInfoDlg()
gtk.main()
