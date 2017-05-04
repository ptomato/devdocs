FROM fedora

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8

RUN dnf update -y && \
    dnf install -y git rubygem-{bundler,thor,ffi} ruby-devel redhat-rpm-config gcc{,-c++} \
                   libxml2-devel nodejs 'dnf-command(builddep)' python-markdown && \
    dnf builddep -y gobject-introspection && \
    dnf install -y glib2-devel gtk3-devel webkitgtk4-devel clutter-gtk-devel cairo-devel \
                   gstreamer1-{,plugins-base-}devel pango-devel vte3-devel \
                   gtksourceview3-devel libappstream-glib-devel && \
    git clone https://github.com/ptomato/devdocs -b gir-redux --depth=1 /opt/devdocs && \
    git clone https://github.com/ptomato/gobject-introspection -b wip/ptomato/devdocs --depth=1 /opt/gi

WORKDIR /opt/gi
RUN ./autogen.sh --enable-doctool && make install
ENV G_IR_DOC_TOOL /usr/local/bin/g-ir-doc-tool

WORKDIR /opt/devdocs
RUN bundle install && \
    thor gir:generate_all && \
    thor docs:list && \
    for docset in appstreamglib10 atk10 atspi20 cairo10 cally10 clutter10 cluttergdk10 clutterx1110 \
                  cogl20 coglpango20 fontconfig20 freetype220 gdk30 gdkpixbuf20 gdkx1130 gio20 \
                  girepository20 glib20 gmodule20 gobject20 gst10 gstallocators10 gstapp10 \
                  gstaudio10 gstbase10 gstcheck10 gstcontroller10 gstfft10 gstnet10 gstpbutils10 \
                  gstrtp10 gstrtsp10 gstsdp10 gsttag10 gstvideo10 gtk30 gtkclutter10 gtksource30 \
                  javascript json10 libxml220 pango10 pangocairo10 pangoft210 pangoxft10 soup24 \
                  soupgnome24 vte290 webkit240 webkit2webextension40 win3210 xfixes40 xft20 xlib20 \
                  xrandr13; \
      do thor docs:generate $docset --force; done

EXPOSE 9292
CMD rackup -o 0.0.0.0