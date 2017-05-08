
FROM fedora

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# Build dependencies and GIR packages
RUN dnf update -y && \
    dnf install -y 'dnf-command(builddep)' git redhat-rpm-config gcc{,-c++} \
        libxml2-devel nodejs python-markdown && \
    dnf builddep -y gobject-introspection && \
    dnf install -y glib2-devel gtk3-devel webkitgtk4-devel clutter-gtk-devel \
        cairo-devel gstreamer1-{,plugins-base-}devel pango-devel vte3-devel \
        gtksourceview3-devel libappstream-glib-devel gspell-devel polkit-devel \
        libappindicator-gtk3-devel gobject-introspection-devel libsecret-devel \
        gsound-devel gupnp-devel gupnp-dlna-devel harfbuzz-devel ibus-devel \
        keybinder3-devel NetworkManager-glib-devel librsvg2-devel \
        telepathy-glib-devel tracker-devel upower-devel libgudev-devel \
        udisks-devel

RUN git clone https://github.com/ptomato/gobject-introspection -b wip/ptomato/devdocs --depth=1 /opt/gi
RUN git clone https://github.com/ptomato/devdocs -b gnome --depth=1 /opt/devdocs

# Get rvm in order to use the particular version of Ruby that Devdocs needs
# bash -l starts a login shell which gets us into the rvm environment
RUN curl -sSL https://rvm.io/mpapis.asc | gpg2 --import - && \
    curl -L https://get.rvm.io | bash -s stable && \
    /bin/bash -l -c "rvm requirements" && \
    /bin/bash -l -c "rvm install 2.4.1" && \
    /bin/bash -l -c "gem install bundler --no-ri --no-rdoc"

WORKDIR /opt/gi
RUN ./autogen.sh --enable-doctool && make install
ENV G_IR_DOC_TOOL /usr/local/bin/g-ir-doc-tool

WORKDIR /opt/devdocs
RUN /bin/bash -l -c "bundle install"
RUN /bin/bash -l -c "thor gir:generate_all /usr/share && \
    thor docs:list && \
    for docset in appindicator301 appstreamglib10 atk10 atspi20 cairo10 \
        cally10 clutter10 cluttergdk10 clutterx1110 cogl10 cogl20 coglpango10 \
        coglpango20 css dbus10 dbusglib10 dbusmenu04 fontconfig20 freetype220 \
        gdk30 gdkpixbuf20 gdkx1130 gio20 girepository20 gl10 glib20 gmodule20 \
        gobject20 gsound10 gspell1 gssdp10 gst10 gstallocators10 gstapp10 \
        gstaudio10 gstbase10 gstcheck10 gstcontroller10 gstfft10 gstnet10 \
        gstpbutils10 gstrtp10 gstrtsp10 gstsdp10 gsttag10 gstvideo10 gtk30 \
        gtkclutter10 gtksource30 gudev10 gupnp10 gupnpdlna20 gupnpdlnagst20 \
        ibus10 javascript json10 keybinder30 libxml220 networkmanager10 \
        nmclient10 pango10 pangocairo10 pangoft210 pangoxft10 polkit10 \
        polkitagent10 rsvg20 soup24 soupgnome24 telepathyglib012 tracker10 \
        trackercontrol10 trackerminer10 upowerglib10 vte290 webkit240 \
        webkit2webextension40 win3210 xfixes40 xft20 xlib20 xrandr13; \
      do echo \$docset; thor docs:generate \$docset --force; done"

EXPOSE 9292
CMD /bin/bash -l -c "rackup -o 0.0.0.0"

