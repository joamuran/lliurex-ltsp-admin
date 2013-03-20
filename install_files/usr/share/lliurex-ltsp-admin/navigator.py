from gi.repository import WebKit
from gi.repository import Gtk
import os



class Browser:
    def __init__(self, x=800, y=600, debug='false', language="en_US"):
        self.window = Gtk.Window()
        self.window.set_size_request(x,y)
        self.window.connect("destroy",Gtk.main_quit)
        self.splitter = Gtk.Paned(orientation=Gtk.Orientation.VERTICAL)
        self.window.add(self.splitter)
        self.lang=language

        #create the WebView
        self.view = WebKit.WebView()
        self.view.get_settings().set_property("enable-developer-extras",True)
        self.inspector = self.view.get_inspector()
        self.inspector.connect("inspect-web-view",self.activate_inspector, self.splitter)

        self.sw = Gtk.ScrolledWindow() 
        self.sw.add(self.view) 
        self.splitter.add1(self.sw)
    
        
        self.window.show_all()

    def activate_inspector(self, inspector, target_view, splitter):
        inspector_view = WebKit.WebView()
        splitter.add2(inspector_view)
        return inspector_view


    def open_url(self, url, title=""):
        "Load a webpage"
        #self.window.set_title("Webkit - %s" % url)
        self.window.set_title("LliureX LTSP: "+title)
        # abre la pagina
        self.view.open(url+"?lang="+self.lang)
        
    def execute_script(self, script):
        self.view.execute_script(script)
    
    def connectEvents(self, event, action):
        self.view.connect(event, action)
