#!/usr/bin/env python
# -*- coding: utf-8 -*-

from distutils.core import setup
from distutils.extension import Extension
import os
import subprocess


setup(  name            = "lliurex-ltsp-admin",
	description	= "GUI to manage LliureX LTSP Solution",
	version          	= "0.1",
	author           	= "Jose A. Murcia",
	author_email	= "joamuran@gmail.com",
	url              	= "https://github.com/joamuran/lliurex-ltsp-admin",
	license		= "GPLv3",
	platforms		= ['posix'],
	package_dir      = {'': 'src'},
	py_modules         = ['LliureXLTSPAdmin']
	)


