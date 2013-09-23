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



class ltspClientXServer:
	def __init__(self):
		'''
		A simple init method
		'''
		print "[ltspClientXServer] Created Instance"
	#def init
	def killXephyr(self, PID):
		# kill instead of sudo kill, so, only running user can remove process
		output=subprocess.check_output(["kill", "-9", str(PID)])
		
# class lstpClientXServer
