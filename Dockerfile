FROM fedora:31 AS build

RUN dnf install -y glibc-langpack-en
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# Build dependencies and GIR packages
RUN dnf install -y 'dnf-command(builddep)' @development-tools bzip2 gcc-c++ && \
    dnf install -y ruby rubygem-bundler ruby-devel python3-markdown \
        NetworkManager-libnm-devel cairo-devel cheese-libs-devel \
        clutter-{gst3,gtk}-devel evince-devel folks-devel geocode-glib-devel \
        glib2-devel gnome-online-accounts-devel gnome-shell \
        gobject-introspection-devel gom-devel grilo-devel \
        gsettings-desktop-schemas-devel gsound-devel gspell-devel \
        gstreamer1-{,plugins-base-}devel gtk{2,3}-devel gtksourceview3-devel \
        gupnp-devel gupnp-dlna-devel harfbuzz-devel ibus-devel \
        keybinder3-devel libappindicator-gtk3-devel libappstream-glib-devel \
        libchamplain-devel libgcab1-devel libgdata-devel libgudev-devel \
        libgweather-devel libgxps-devel libnotify-devel libpeas-devel \
        librsvg2-devel libsecret-devel libzapojit-devel mutter pango-devel \
        polkit-devel poppler-glib-devel rest-devel telepathy-glib-devel \
        tracker-devel udisks-devel upower-devel vte{,291}-devel && \
    dnf clean all && \
    rm -rf /var/cache/yum

COPY lib/docs/scrapers/gnome/girs/GtkosxApplication-1.0.gir /usr/share/gir-1.0/
COPY . /opt/devdocs/
WORKDIR /opt/devdocs
RUN bundle install --deployment

RUN bundle exec thor gir:generate_all /usr/share/gir-1.0
RUN bundle exec thor gir:generate_all /usr/lib64/mutter-5

# Some of the gnome-shell GIRs need extra include paths
RUN bundle exec thor gir:generate /usr/share/gnome-shell/Gvc-1.0.gir
RUN bundle exec thor gir:generate /usr/share/gnome-shell/Shell-0.1.gir --include /usr/lib64/mutter-5
RUN bundle exec thor gir:generate /usr/share/gnome-shell/St-1.0.gir --include /usr/lib64/mutter-5

RUN for docset in appindicator301 appstreamglib10 atk10 atspi20 cairo10 \
        cally10 cally5 camel12 champlain012 cheese30 clutter10 clutter5 \
        cluttergdk10 cluttergst30 clutterx1110 clutterx115 cogl10 cogl20 cogl5 \
        coglpango10 coglpango20 coglpango5 dbusmenu04 ebook12 ebookcontacts12 \
        edataserver12 edataserverui12 evincedocument30 evinceview30 folks06 \
        folksdummy06 folkseds06 folkstelepathy06 gcab10 gck1 gcr3 gcrui3 \
        gdata00 gdesktopenums30 gdk20 gdk30 gdkpixbuf20 gdkx1120 gdkx1130 \
        gee08 geocodeglib10 gio20 girepository20 glib20 gmodule20 goa10 \
        gobject20 gom10 grl03 grlnet03 grlpls03 gsound10 gspell1 gssdp10 gst10 \
        gstallocators10 gstapp10 gstaudio10 gstbase10 gstcheck10 \
        gstcontroller10 gstgl10 gstnet10 gstpbutils10 gstrtp10 gstrtsp10 \
        gstsdp10 gsttag10 gstvideo10 gtk20 gtk30 gtkchamplain012 gtkclutter10 \
        gtkosxapplication10 gtksource30 gudev10 gupnp10 gupnpdlna20 \
        gupnpdlnagst20 gvc10 gweather30 gxps01 ibus10 javascriptcore40 json10 \
        keybinder30 meta5 nm10 notify07 pango10 pangocairo10 pangoft210 \
        pangoxft10 peas10 peasgtk10 polkit10 polkitagent10 poppler018 rest07 \
        restextras07 rsvg20 secret1 shell01 soup24 soupgnome24 st10 \
        telepathyglib012 tracker20 trackercontrol20 trackerminer20 \
        upowerglib10 vte00 vte291 webkit240 webkit2webextension40 zpj00; \
      do echo $docset; bundle exec thor docs:generate $docset --force; done

# Intentionally omitted:
# dbus10, dbusglib10, fontconfig20, freetype220, gdkpixdata20, gl10, libxml220,
#   win3210, xfixes40, xft20, xlib20, xrandr13

FROM fedora-minimal:31
COPY --from=build /opt/devdocs /opt/devdocs
RUN microdnf install -y ruby rubygem-bundler nodejs && \
    microdnf clean all && \
    rm -rf /var/cache/yum

WORKDIR /opt/devdocs

EXPOSE 9292
CMD bundle exec rackup -o 0.0.0.0
