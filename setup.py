#!/usr/bin/env python
# -*- coding: utf-8 -*-

from distutils.core import setup
from distutils.extension import Extension
import os
import subprocess


setup(  name            = "lliurex-ltsp-admin",
	description	= "A library to test ltsp images",
	version          	= "0.1",
	author           	= "Angel Berlanas Vicente",
	author_email	= "angel.berlanas@gmail.com",
	url              	= "http://github.com/aberlanas/python-ltsplib/",
	license		= "GPLv3",
	platforms		= ['posix'],
	package_dir      = {'': 'src'},
	py_modules         = ['LliureXLTSPAdmin']
	)


