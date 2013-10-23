#!/usr/bin/env python

import sys
import glob
import os
import string
import time
import subprocess
import signal

class LTSPX11Environment:
	'''
	Displays a graphical window to launch X applications into chroot
	'''
	
	display=":42"
	screen="1024x768x16"

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
	
	
	def prepare_X11_applications_on_chroot(self, title):
		'''
		Prepare a X11 environment to run graphical apps remotely (not necessary in chroot)
		'''
		import time
		try:
			# Check if Xephir is running on :display. If so, remove it
			self.RemoveXephyrProcess(self.display)
			# Display on display
			print ("Display...")
			pid=subprocess.Popen(["Xephyr","-ac","-screen",self.screen,self.display, "-dpi", "96", "-wr", "-title",title])
			#800x480x16 -dpi 96
			# Waiting for process
			while(pid.poll()==False):
				print "watiting for xephyr"
				time.sleep(0.5);
				
			
			print ("on?")
			#pid=subprocess.Popen(["Xephyr","-ac","-screen",self.screen,"-br", "2>", "/dev/null", self.display])
			'''
			#pidmeta=subprocess.Popen(["metacity", "--display",self.display])
			
			while(pidmeta.poll()==False):
				print "watiting for metacity"
				time.sleep(0.5);
			'''	
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