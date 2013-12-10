#!/usr/bin/python
# This script is licensed under GPL v3 or higher
#
# Authors: Angel Berlanas Vicente 
#          <angel.berlanas@gmail.com>
#	   Jose Alfredo Murcia Andres
#	   <joamuran@gmail.com>
#

# Libraries
import sys
import subprocess
import glob
import os
import string
import time
import signal




class ltspClientXServer:
	'''
	Displays a graphical window to launch X applications into chroot
	'''
	
	display=":42"
	screen="1024x768x16"
	env_Xauthority=""
	env_display="0:0"


	def __init__(self):
		'''
		A simple init method
		'''
		print "[ltspClientXServer] Created Instance"
	#def init
	def killXephyr(self, PID):
		# kill instead of sudo kill, so, only running user can remove process
		output=subprocess.check_output(["kill", "-9", str(PID)])


	#########################################
	# Let's go with X-Environment remote    #
	#########################################

	def xenv_RemoveXephyrProcess(self, str_display):
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
	
	#def xenv_prepare_X11_applications_on_chroot3(self, title):
	#	print title
	#	pass

	def get_first_display_free(self):
		'''
		Returns firs Display free from 42
		'''
		try:
			display=42

			while(os.path.isfile('/tmp/.X'+str(display)+'-lock')):
				# There is lock file... is it in use?
				print ("File "+'/tmp/.X'+str(display)+'-lock'+" exists")
				f = open('/tmp/.X'+str(display)+'-lock', 'r')
				for line in f:
					if (os.path.exists("/proc/"+line.strip())):
						print ("Any process is running on :"+str(display))
						# check another display
						display=display+1
					else:
						print("No process locking file, remove lock file")
						os.remove('/tmp/.X'+str(display)+'-lock')
						# Return removed display
						return ":"+str(display)

			return ":"+str(display)
		except Exception as e:
			print "Captured: "+str(e)
			return {'status': False, 'msg':'[LTSPX11Environment] '+str(e)}


	def xenv_set_environment(self, 	env_Xauthority, env_display):
		# Set local environment for Xephyr
		self.env_Xauthority=env_Xauthority
		self.env_display=env_display
		print ("Setting Xauthority to: "+self.env_Xauthority)
		print ("Setting env_Display to: "+self.env_display)
		pass

	def xenv_prepare_X11_applications_on_chroot(self, title, screen):
		'''
		Prepare a X11 environment to run graphical apps remotely (not necessary in chroot)
		'''
		import time
		try:

			display=self.get_first_display_free()
			# Display on display (first free) with appropiate environment
			print ("Display...:"+display)
			my_env=dict(os.environ)

			# Take environment from local config
			my_env['DISPLAY'] = self.env_display
			my_env['XAUTHORITY']=self.env_Xauthority
			
			print("[ltspClientXServer::xenv_prepare_X11_applications_on_chroot] Setting environment: Display-"+my_env['DISPLAY']+" and Xauthority -"+my_env['XAUTHORITY'])

			pid=subprocess.Popen(["Xephyr","-ac",display, "-dpi", "96", "-screen", "900x675x24", "-wr", "-title",title], env=my_env)
			#pid=subprocess.Popen(["Xephyr","-ac",display, "-dpi", "96", "-screen", screen, "-wr", "-title",title], env=my_env)
			#pid=subprocess.Popen(["Xephyr","-ac",display, "-dpi", "96", "-screen", "400x300x24", "-wr", "-title",title])


			print (str(pid))
			
			# Waiting for process
			while(pid.poll()==False):
				print "watiting for xephyr"
				#time.sleep(0.5);
			
			return [pid, display]
			
		except Exception as e:
			print "Captured: "+str(e)
			return {'status': False, 'MSG':'[LTSPX11Environment] '+str(e)}

	#def xenv_prepare_X11_applications_on_chroot(self,chroot_dir)
	
	def xenv_remove_X11_applications_on_chroot(self):
		'''
		Kill Xephir Process
		'''
		
		import os
		import signal
		
		try:
			self.xenv_RemoveXephyrProcess(self.display)
			
		except Exception as e:
			print ("Exception killing:"+str(e))
			return {'status': False, 'msg':'[N4dChrootAdmin] '+str(e)}
	#def remove_X11_applications_on_chroot(self,chroot_dir)
	

	def xenv_prepare_chroot_for_session(self):
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
		
	
	def xenv_remove_session(self):
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
		



		


# class lstpClientXServer
