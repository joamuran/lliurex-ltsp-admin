#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Escrito por Daniel Fuentes B.
# Licencia: 
# BSD <http://www.opensource.org/licenses/bsd-license.php>

import pygtk
pygtk.require("2.0")
import gtk
import webkit

## ?????????
USER_AGENT = ("Mozilla/5.0 (X11; Linux x86_64) "
              "AppleWebKit/535.4+ (KHTML, like Gecko) "
              "Version/5.0 Safari/535.4+ Stoq")
## ???????????

class Browser:
    # Ventana del programa
    def __init__(self):
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.set_position(gtk.WIN_POS_CENTER)
        self.window.set_default_size(800, 600)
        self.window.connect("destroy", self.on_quit)

        # Un vBox,en la parte de arriba hay una caja para
        # ingresar la direccion web, y abago se muestra
        # la pagina
        vbox = gtk.VBox()

        # La parte de la entrada de la url
        self.url_text = gtk.Entry()
        self.url_text.connect('activate', self.url_text_activate)

        # La parte en donde se muestra la pagina que se visita
        # (con scroll incluido)
        self.scroll_window = gtk.ScrolledWindow()
        self.webview = webkit.WebView()
        
        
        
        
        
        self.webview.get_web_inspector().connect(
            'inspect-web-view',
            self._on_inspector__inspect_web_view)
        self.webview.connect(
            'navigation-policy-decision-requested',
            self._on_view__navigation_policy_decision_requested)
        self.add(self.webview)
        self.webview.show()
        
        
        
        
        
        
        self.scroll_window.add(self.webview)

        # Unimos todo en el vBox
        vbox.pack_start(self.url_text, fill=True, expand=False)
        # El expand=False al empaquetarlo es para que el entry 
        #  no ocupe media pantalla
        vbox.pack_start(self.scroll_window, True, True)
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

