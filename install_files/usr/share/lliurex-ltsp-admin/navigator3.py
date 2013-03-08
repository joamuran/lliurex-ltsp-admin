from gi.repository import WebKit
from gi.repository import Gtk
import os


class Browser:

    def __init__(self, x=800, y=600, debug='false'):
        window = Gtk.Window()
        self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
        self.window.set_position(gtk.WIN_POS_CENTER)
        self.window.set_default_size(x, y)
        self.window.connect("destroy", self.on_quit)
        
        self.splitter = Gtk.Paned(orientation=Gtk.Orientation.VERTICAL)
        self.window.add(splitter)

        #create the WebView
        self.view = WebKit.WebView()
        self.view.get_settings().set_property("enable-developer-extras",True)
        self.inspector = self.view.get_inspector()
        self.inspector.connect("inspect-web-view",self.activate_inspector, self.splitter)
        
        self.sw = Gtk.ScrolledWindow() 
        self.sw.add(self.view) 
        self.splitter.add1(self.sw)

        
        self.window.show_all()

    def open_url(self, url):
        "Load a webpage"
        self.window.set_title("Webkit - %s" % url)
        # abre la pagina
        self.view.open(url)

    
    def activate_inspector(self, inspector, target_view, splitter):
        inspector_view = WebKit.WebView()
        self.splitter.add2(inspector_view)
        return inspector_view
