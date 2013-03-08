#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pygtk
pygtk.require("2.0")
import gtk
import webkit

class Browser:
    #init class
    def __init__(self, x=800, y=600, debug='false'):
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.set_position(gtk.WIN_POS_CENTER)
        self.window.set_default_size(x, y)
        self.window.connect("destroy", self.on_quit)

        # Un vBox,en la parte de arriba hay una caja para
        # ingresar la direccion web, y abago se muestra
        # la pagina
        vbox = gtk.VBox()

        # La parte de la entrada de la url
        self.url_text = gtk.Entry()
        self.url_text.connect('activate', self.url_text_activate)


        # Splitter per al debugger
        #self.splitter = gtk.Paned(orientation=gtk.Orientation.VERTICAL)
        #self.splitter = gtk.Paned()
        #self.splitter.set_orientation(Orientation.VERTICAL);
        self.splitter = gtk.VPaned()
        self.window.add(self.splitter)




        # La parte en donde se muestra la pagina que se visita
        # (con scroll incluido)
        self.scroll_window = gtk.ScrolledWindow()
        self.webview = webkit.WebView()
        
        
        # Inspector Properties
        self.webview.get_settings().set_property("enable_default_context_menu", True)
        self.webview.get_settings().set_property("enable-developer-extras",True)  
        inspector = self.webview.get_web_inspector()
                
        inspector.connect("inspect-web-view",self.activate_inspector, self.splitter)
        
        
        
        
        
        # Add webview to a scrolledwindow
        self.scroll_window.add(self.webview)
        # And it to splitter
        self.splitter.add1(self.scroll_window)

        # Unimos todo en el vBox
        vbox.pack_start(self.url_text, fill=True, expand=False)
        # El expand=False al empaquetarlo es para que el entry 
        #  no ocupe media pantalla
        
        #vbox.pack_start(self.scroll_window, True, True)
        vbox.pack_start(self.splitter, True, True)
        self.window.add(vbox)
        self.window.show_all()
                
        ##def activate_inspector():
        ##    print "Activating inspector"
        
        ## Inspector
        ##inspector = self.webview.get_web_inspector()
        ##inspector.connect("inspect-web-view", activate_inspector)
    
        
        #print "Activating inspector"
        #debugwindow = gtk.Window(gtk.WINDOW_TOPLEVEL)
        #debugwindow.connect("destroy", self.on_quit)
        #           
        #view = webkit.WebView()
       # 
       # debugwindow.add(view);
       #     
       # debugwindow.show()
        
    
    
    
    def activate_inspector(inspector, target_view, splitter):
        inspector_view = WebKit.WebView()
        splitter.add2(inspector_view)
        return inspector_view
    
    
    
    # Definimos las señales y demas cosas de la ventana:
    def url_text_activate(self, entry):
    # al activar el entry (por ejemplo al hacer enter),
    # se obtiene el texto de la entry (la url) y 
    # se activa la funcion que abre la url
        self.open_url(entry.get_text())

    def on_quit(self, widget):
        gtk.main_quit()

    # La funcion magica que abre la url que se le pasa
    def open_url(self, url):
        "Funcion que carga la pagina elegida"
        # cambia el titulo de la ventana
        self.window.set_title("Ejemplo pywebkitgtk - %s" % url)
        # mostramos la direccion de la pagina abierta en el entry
        self.url_text.set_text(url)
        # abre la pagina
        self.webview.open(url)






    def _create_view_for_inspector(self, introspector_view):
        window = gtk.Window()
        window.set_size_request(800, 600)
        sw = gtk.ScrolledWindow()
        window.add(sw)
        view = webkit.WebView()
        sw.add(introspector_view)
        window.show_all()
        return view
   

    #
    # Callbacks
    #

    def _on_inspector__inspect_web_view(self, inspector, view):
        return self._create_view_for_inspector(view)

    def _on_view__navigation_policy_decision_requested(self, view, frame,
                                                       request, action,
                                                       policy):
        self._policy_decision(request.props.uri, policy)

    #def activate_inspector(self, *args):
    #    print "Activating inspector"
    #    debugwindow = gtk.Window(gtk.WINDOW_TOPLEVEL)
    #    debugwindow.connect("destroy", self.on_quit)
    #               
    #    view = webkit.WebView()
    #    
    #    debugwindow.add(view);
    #        
    #    debugwindow.show()
#
        #return view

