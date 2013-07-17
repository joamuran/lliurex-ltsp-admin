#!/usr/bin/env python

import sys
import glob
import os
import string
import time
import subprocess
import signal

class LtspInfo:
	'''
	Info class for values
	'''
	
	LTSP_CHROOT_PATH="/opt/ltsp/"
	'''
	Default chroot path
	'''
	
	LTSP_IMAGES_PATH="/opt/ltsp/images/"
	'''
	Default images path
	'''
	
	LTSP_LAST_TIME="time.time"
	'''
	Default last time modification token
	'''
	
	

class LtspException(Exception):
	'''
	Custom exception class
	'''
	def __init__(self, message, Errors):
		# Call the base class constructor with the parameters it needs
		Exception.__init__(self, message)

		# Now for your custom code...
		self.Errors = Errors


class LtspDic:
	'''
	Class to manage LTSP Dictionaries
	'''
	
	def __init__(self):
		'''
		Simple init method, that initializes a new Dictionary
		'''
		self.dic_images={}
		self.dic_images["images"]=[]


	def get_img_str(self, img_id):
		'''
		Get image string path 
		'''
		
		if os.path.exists(LtspInfo.LTSP_IMAGES_PATH+"/"+img_id+".img"):
			return str(LtspInfo.LTSP_IMAGES_PATH+"/"+img_id+".img")
		else:
			return None
	#get_img_str
	
	def get_squashfs_str(self,img_id):
		'''
		Get squashfs string path
		'''
		if os.path.exists(LtspInfo.LTSP_CHROOT_PATH+"/"+img_id+"/"):
			return str(LtspInfo.LTSP_CHROOT_PATH+"/"+img_id+"/")
		else:
			return None
	# get_squashfs_str
	
	def set_modification_time(self,img_id):
		'''
		Set the current modification time at img_id
		'''
		if os.path.exists(LtspInfo.LTSP_CHROOT_PATH+"/"+img_id+"/"):
			time=time.time()
			linestring = open('filename.txt', 'r').read()
			f = open(LtspInfo.LTSP_CHROOT_PATH+"/"+img_id+"/"+LtspInfo.LTSP_LAST_TIME,'w')
			f.write(linestring)
			f.close()
			return linestring
		else:
			return None
		
	
	
	
	def get_modification_time(self,img_id):
		'''
		Get the last modification time
		'''
		if os.path.exists(LtspInfo.LTSP_CHROOT_PATH+"/"+img_id+"/"+LtspInfo.LTSP_LAST_TIME):
			last_time = open(LtspInfo.LTSP_CHROOT_PATH+"/"+img_id+"/"+LtspInfo.LTSP_LAST_TIME,'r').read()
			return last_time
		else:
			return None
	# get_modification_time

	def get_ltsp_dic_desktop(self):
		'''
		Get the dic entry for desktops
		'''
		self.dic_images["images"].append(
			{
			"id":"desktop",
			"name": "LliureX Desktop",
			"desc": "LliureX Desktop Description",
			"img": "lliurex-escriptori.png",
			"image_file" : self.get_img_str("desktop"),
			"squashfs_dir": self.get_squashfs_str("desktop"),
			"installed":self.get_modification_time("desktop"),
			"lliurex_version":None,
			"errorcode":None,
			"errormsg":None
			}
		)
	# get_ltsp_dic_desktop(self):
		
	def get_ltsp_dic_client(self):
		'''
		Get the dic entry for clients
		'''
		self.dic_images["images"].append(
			{
			"id":"client",
			"name": "LliureX Client",
			"desc": "LliureX Client Description",
			"img": "lliurex-client.png",
			"image_file" : self.get_img_str("client"),
			"squashfs_dir": self.get_squashfs_str("client"),
			"installed":self.get_modification_time("client"),
			"lliurex_version":None,
			"errorcode":None,
			"errormsg":None
			}
		)
	# get_ltsp_dic_client
	
	def get_ltsp_dic_music(self):
		'''
		Get the dic entry for music
		'''
		self.dic_images["images"].append(
			{
			"id":"music",
			"name": "LliureX Music",
			"desc": "LliureX Music Description",
			"img": "lliurex-musica.png",
			"image_file" : self.get_img_str("music"),
			"squashfs_dir": self.get_squashfs_str("music"),
			"installed":self.get_modification_time("music"),
			"lliurex_version":None,
			"errorcode":None,
			"errormsg":None
			}
		)
	# get_ltsp_dic_music

	def get_ltsp_dic_pime(self):
		'''
		Get the dic entry for Pime
		'''
		self.dic_images["images"].append(
			{
			"id":"pime",
			"name": "LliureX Pime",
			"desc": "LliureX Pime Description",
			"img": "lliurex-pime.png",
			"image_file" : self.get_img_str("pime"),
			"squashfs_dir": self.get_squashfs_str("pime"),
			"installed":self.get_modification_time("pime"),
			"lliurex_version":None,
			"errorcode":None,
			"errormsg":None
			}
		)
	# get_ltsp_dic_pime
	
	def get_ltsp_dic_infantil(self):
		'''
		Get the dic entry for infantil
		'''
		self.dic_images["images"].append(
			{
			"id":"infantil",
			"name": "LliureX Infantil",
			"desc": "LliureX Infantil Description",
			"img": "lliurex-infantil.png",
			"image_file" : self.get_img_str("infantil"),
			"squashfs_dir": self.get_squashfs_str("infantil"),
			"installed":self.get_modification_time("infantil"),
			"lliurex_version":None,
			"errorcode":None,
			"errormsg":None
			}
		)
	# get_ltsp_dic_infantil
	
	def get_ltsp_dic(self):
		'''
		Returns a simple dictionary with LTSP images information
		'''
		# Dic images
		# self.dic_images={}

		self.dic_images={}
		self.dic_images["images"] = []
		
		# Append flavours
		self.get_ltsp_dic_desktop()
		self.get_ltsp_dic_client()
		self.get_ltsp_dic_infantil()
		self.get_ltsp_dic_music()
		self.get_ltsp_dic_pime()
		
		# Return the dictionary
		return self.dic_images
	# get_ltsp_dic

class LtspCommands:
	
	'''
	Commands execution on ltsp chroots
	'''
	def run_lliurex_version(self,path):
		'''
		Run the lliurex-version command at the chosen chroot path
		'''
		if (self.prepare_chroot_for_run(path)):
			lliurex_version=subprocess.check_output(["chroot",path,"lliurex-version"])
			self.umount_chroot(path)
			return lliurex_version
		else:
			return None
	# def run_lliurex_version
	
	def run_custom_command(self,path,command):
		'''
		Run the custom command at the chosen chroot path
		'''
		if (self.prepare_chroot_for_run(path)):
			output=subprocess.check_output(["chroot",path,command])
			self.umount_chroot(path)
			return output
		else:
			return None
	# def run_custom_command
	

	def prepare_chroot_for_run(self,chroot_dir):
		'''
		Prepare chroot to run commands
		mounting some directories:
			* /proc/
			* /sys/
		'''
		try:
			# Mount /proc
			ret=subprocess.check_output(["mount","-o","bind","/proc",chroot_dir+"/proc"])
			# Mount /sys
			ret=subprocess.check_output(["mount","-o","bind","/sys",chroot_dir+"/sys"])
			# Mount /dev
			ret=subprocess.check_output(["mount","-o","bind","/dev",chroot_dir+"/dev"])
			# Mount /dev/pts
			ret=subprocess.check_output(["mount","-o","bind","/dev/pts",chroot_dir+"/dev/pts"])
			return True
		except Exception as e:
			print("LtspCommands: Not mounted " + str(chroot_dir))
			return False		
	#def prepare_chroot_for_run(self,chroot)
		
	def umount_chroot(self,chroot_dir):
		'''
		Umount system directories
		now with -lazy, 
		TODO:
			test if it is mounted already
		'''
		if not self.test_chroot(chroot_dir)["status"] :
			# If not a directory...you can't do nothing more.
			return False
		else:
			# Mount /proc
			ret=subprocess.check_output(["umount","-l",chroot_dir+"/proc"])
			# Mount /sys
			ret=subprocess.check_output(["umount","-l",chroot_dir+"/sys"])
			# Mount /dev
			ret=subprocess.check_output(["umount","-l",chroot_dir+"/dev"])
			# Mount /dev/pts
			ret=subprocess.check_output(["umount","-l",chroot_dir+"/dev/pts"])
			return True
	#def umount_chroot


class LtspTest:
	'''
	Class LtspTest : Simple Tests suite for Ltsp image system
	'''
	
	dic_images = {}
	dic_images["images"] =[]
	
	def __init__(self):
		'''
		Simple init method
		'''
		pass
	# __init__

	def test_chroot(self, chroot_dir):
		'''
		test_chroot test if the given directory is a real chroot or 
		besides, it seems like a chroot.
		'''
		if os.path.isdir(chroot_dir):
			return True
		else:
			return False
	#def test_chroot(self, chroot_dir)
	
	def test_error_101(self,ltsp_id):
		'''
		Test if img is created under the correct path of ltsp
		'''
		try:
			print("Testing the world")
		except Exception as e:
			raise LtspException(e)
		
	#def test_error_101
	
	def test_all(self,ltsp_id):
		
		# For method in test_error_* execute it!
		for f in range(200):
			for item in dir(self):
				if "test_error_"+str(f) == item:
					try:
						getattr(self,item)(ltsp_id)
					except LtspException as e:
						print(str(e))
				
	#def test_all
		
	
	
#class LtspTest



class LTSPX11Environment:
	'''
	Displays a graphical window to launch X applications into chroot
	'''
	
	display=":42"
	screen="800x600x16"

	def __init__(self, display, screen):
		self.display=display
		self.screen=screen
		pass	
	

	def RemoveXephyrProcess(self, str_display):
		'''
		Removes all instances running on display
		'''
		
		display=str_display[1:]
		# Check if Xephir is running on :display
		fname='/tmp/.X'+display+'-lock'
		if (os.path.isfile(fname)):
			print ("File "+fname+" exists")
			f = open(fname, 'r')
			for line in f:
				if (os.path.exists("/proc/"+line.strip())):
					print ("Xephir is running on :"+display)
					os.kill(int(line.strip()), signal.SIGTERM)
				else:
					print("File does not exists")
			os.remove(fname)
			
	#def RemoveXephyrProcess():
	
	
	def prepare_X11_applications_on_chroot(self):
		'''
		Prepare a X11 environment to run graphical apps 
		'''
		import time
		try:
			# Check if Xephir is running on :display. If so, remove it
			self.RemoveXephyrProcess(self.display)
			# Display on display
			print ("Display...")
			pid=subprocess.Popen(["Xephyr","-ac","-screen",self.screen,self.display])
			print ("on?")
			#pid=subprocess.Popen(["Xephyr","-ac","-screen",self.screen,"-br", "2>", "/dev/null", self.display])
			subprocess.Popen(["metacity", "--display",self.display])
			# pause to wait metacity launches
			#time.sleep(1) 
			return pid
			
		except Exception as e:
			return {'status': False, 'msg':'[LTSPX11Environment] '+str(e)}

	#def prepare_X11_applications_on_chroot(self,chroot_dir)
	
	def remove_X11_applications_on_chroot(self):
		'''
		Kill Xephir Process
		'''
		
		import os
		import signal
		
		try:
			self.RemoveXephyrProcess(self.display)
			
		except Exception as e:
			print ("Exception killing:"+str(e))
			return {'status': False, 'msg':'[N4dChrootAdmin] '+str(e)}
	#def remove_X11_applications_on_chroot(self,chroot_dir)
	

	def prepare_chroot_for_session(self):
		'''
		Prepare chroot to start session
		mounting some directories:
			* /var/run
			* ...
		'''
		try:

			# Mounting /home on chroot
			print ("Let's mount home")
			ret=subprocess.check_output(["mount","--bind","/home/",chroot_dir+"/home/"])
			print ("Check it!")
			#ret=subprocess.check_output(["mount","-o","bind","/home",chroot_dir+"/home"])

					# God takes we confessed
					
					#ret=subprocess.check_output(["mv", chroot_dir+"/var/run/dbus", chroot_dir+"/var/run/dbus.bak"])
					#ret=subprocess.check_output(["rm", "-rf", chroot_dir+"/var/run/dbus"])
					#ret=subprocess.check_output(["ln", "-s", "/var/run/dbus", chroot_dir+"/var/run/dbus"])
					#ret=subprocess.check_output(["mount","-o","bind","/var/run/dbus",chroot_dir+"/var/run/dbus"])

					#ret=subprocess.check_output(["rm", "-rf", chroot_dir+"/var/lib/dbus/machine-id"])
					#ret=subprocess.check_output(["ln", "-s", "/var/lib/dbus/machine-id", chroot_dir+"/var/lib/dbus/machine-id"])
					#ret=subprocess.check_output(["mount","-o","bind","/var/lib/dbus/machine-id",chroot_dir+"/var/lib/dbus/machine-id"])




			# Mount /proc
			#ret=subprocess.check_output(["mount","-o","bind","/proc",chroot_dir+"/proc"])
			# Mount /sys
			#ret=subprocess.check_output(["mount","-o","bind","/sys",chroot_dir+"/sys"])
			# Mount /dev
			#ret=subprocess.check_output(["mount","-o","bind","/dev",chroot_dir+"/dev"])
			# Mount /dev/pts
			#ret=subprocess.check_output(["mount","-o","bind","/dev/pts",chroot_dir+"/dev/pts"])
			return True
		except Exception as e:
			print("LtspSessionCommands: Not mounted " + str(chroot_dir))
			return False		
	#def prepare_chroot_for_run(self,chroot)
		
	
	def remove_session(self):
		'''
		Umount system directories
		now with -lazy, 
		TODO:
			test if it is mounted already
		'''
		if not self.test_chroot(chroot_dir)["status"] :
			# If not a directory...you can't do nothing more.
			return False
		else:
			ret=subprocess.check_output(["umount","-l",chroot_dir+"/home/"])
			## Mount /proc
			#ret=subprocess.check_output(["umount","-l",chroot_dir+"/proc"])
			## Mount /sys
			#ret=subprocess.check_output(["umount","-l",chroot_dir+"/sys"])
			## Mount /dev
			#ret=subprocess.check_output(["umount","-l",chroot_dir+"/dev"])
			## Mount /dev/pts
			#ret=subprocess.check_output(["umount","-l",chroot_dir+"/dev/pts"])
			return True
	#def remove_session
		
	

#class LTSPX11Environment