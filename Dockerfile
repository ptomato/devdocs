FROM fedora

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# Build dependencies and GIR packages
RUN dnf install -y 'dnf-command(builddep)' @development-tools bzip2 gcc-c++ \
        meson nodejs && \
    dnf builddep -y gobject-introspection ruby && \
    dnf install -y NetworkManager-libnm-devel cairo-devel cheese-libs-devel \
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

# Get rbenv and ruby-build in order to install the particular version of Ruby
# that Devdocs needs
RUN git clone git://github.com/sstephenson/rbenv.git /root/.rbenv
RUN git clone git://github.com/sstephenson/ruby-build.git /root/.rbenv/plugins/ruby-build
ENV PATH /root/.rbenv/shims:/root/.rbenv/bin:/root/.rbenv/plugins/ruby-build/bin:$PATH

RUN git clone https://gitlab.gnome.org/GNOME/gobject-introspection.git --depth=1 /opt/gi
WORKDIR /opt/gi
RUN meson _build -Ddoctool=true
RUN ninja -C _build
RUN ninja -C _build install
ENV G_IR_DOC_TOOL /usr/local/bin/g-ir-doc-tool

COPY lib/docs/scrapers/gnome/girs/GtkosxApplication-1.0.gir /usr/share/gir-1.0/
COPY . /opt/devdocs/
WORKDIR /opt/devdocs
RUN rbenv install
RUN gem install bundler
RUN bundle install
RUN bundle exec thor gir:generate_all /usr/share/gir-1.0
RUN bundle exec thor gir:generate_all /usr/lib64/mutter-4

# Some of the gnome-shell GIRs need extra include paths
RUN bundle exec thor gir:generate /usr/share/gnome-shell/Gvc-1.0.gir
RUN bundle exec thor gir:generate /usr/share/gnome-shell/Shell-0.1.gir --include /usr/lib64/mutter
RUN bundle exec thor gir:generate /usr/share/gnome-shell/St-1.0.gir --include /usr/lib64/mutter

RUN for docset in appindicator301 appstreamglib10 atk10 atspi20 cairo10 \
        cally10 cally4 camel12 champlain012 cheese30 clutter10 clutter4 \
        cluttergdk10 cluttergst30 clutterx1110 clutterx114 cogl10 cogl20 cogl4 \
        coglpango10 coglpango20 coglpango4 css dbusmenu04 ebook12 \
        ebookcontacts12 edataserver12 edataserverui12 evincedocument30 \
        evinceview30 folks06 folksdummy06 folkseds06 folkstelepathy06 gcab10 \
        gck1 gcr3 gcrui3 gdata00 gdesktopenums30 gdk20 gdk30 gdkpixbuf20 \
        gdkx1120 gdkx1130 gee08 geocodeglib10 gio20 girepository20 glib20 \
        gmodule20 goa10 gobject20 gom10 grl03 grlnet03 grlpls03 gsound10 \
        gspell1 gssdp10 gst10 gstallocators10 gstapp10 gstaudio10 gstbase10 \
        gstcheck10 gstcontroller10 gstgl10 gstnet10 gstpbutils10 gstrtp10 \
        gstrtsp10 gstsdp10 gsttag10 gstvideo10 gtk20 gtk30 gtkchamplain012 \
        gtkclutter10 gtkosxapplication10 gtksource30 gudev10 gupnp10 \
        gupnpdlna20 gupnpdlnagst20 gvc10 gweather30 gxps01 ibus10 javascript \
        javascriptcore40 json10 keybinder30 meta4 nm10 notify07 pango10 \
        pangocairo10 pangoft210 pangoxft10 peas10 peasgtk10 polkit10 \
        polkitagent10 poppler018 rest07 restextras07 rsvg20 secret1 shell01 \
        soup24 soupgnome24 st10 telepathyglib012 tracker20 trackercontrol20 \
        trackerminer20 upowerglib10 vte00 vte291 webkit240 \
        webkit2webextension40 zpj00; \
      do echo $docset; bundle exec thor docs:generate $docset --force; done

# Intentionally omitted:
# dbus10, dbusglib10, fontconfig20, freetype220, gdkpixdata20, gl10, libxml220,
#   win3210, xfixes40, xft20, xlib20, xrandr13

# Clean up Docker image to make it smaller
RUN dnf remove -y ModemManager-glib NetworkManager{,-wifi} \
    NetworkManager-libnm{,-devel} abattis-cantarell-fonts \
    accountsservice{,-libs} adobe-mappings-cmap{,-deprecated} \
    adobe-mappings-pdf adwaita-{cursor,gtk2,icon}-theme alsa-lib annobin apr \
    apr-util{,-bdb,-openssl} at-spi2-atk{,-devel} at-spi2-core{,-devel} \
    atk{,-devel} autoconf automake avahi-{glib,libs} binutils bison bluez \
    bolt boost-{atomic,chrono,date-time,regex,system,thread} bubblewrap \
    bzip2{,-devel} cairo{,-devel} cairo-gobject{,-devel} cdparanoia-libs \
    check{,-devel} checksec cheese-libs{,-devel} chrpath clutter{,-devel} \
    clutter-gst3{,-devel} clutter-gtk{,-devel} \
    cmake{,-data,-filesystem,-rpm-macros} cogl{,-devel} color-filesystem \
    colord{,-gtk,-libs} compat-openssl10 cpp ctags cups-libs cups-pk-helper \
    dbus-{devel,x11} dbus-glib{,-devel} dconf dejavu-fonts-common \
    dejavu-sans-fonts desktop-file-utils diffstat djvulibre-libs \
    dnf-plugins-core docbook-{dtds,utils} docbook-style-{dsssl,xsl} \
    dosfstools doxygen dwz dyninst e2fsprogs{,-libs} efi-srpm-macros \
    efivar-libs elinks emacs-filesystem enca enchant{,2,2-devel} \
    evince-{devel,djvu,libs} evolution-data-server{,-devel,-langpacks} \
    exempi exiv2{,-libs} expat-devel fedora-logos file findutils \
    fipscheck{,-lib} flac-libs flatpak flex folks{,-devel,-tools} \
    fontconfig{,-devel} fontpackages-filesystem fpc-srpm-macros \
    freetype{,-devel} fribidi{,-devel} fuse{,-common,-libs} gc gcc{,-c++} \
    gcr{,-devel} gdbm{,-devel} gdk-pixbuf2{,-devel,-modules} geoclue2{,-libs} \
    geocode-glib{,-devel} gettext{,-libs} ghc-srpm-macros giflib git \
    git-core{,-doc} gjs glib-networking glibc-{devel,headers} glx-utils \
    gmp-{c++,devel} gnat-srpm-macros gnome-bluetooth{,-libs} \
    gnome-control-center{,-filesystem} gnome-desktop3 gnome-keyring{,-pam} \
    gnome-online-accounts{,-devel} gnome-remote-desktop \
    gnome-session{,-wayland-session,-xsession} gnome-settings-daemon \
    gnome-shell gnome-themes-extra gnutls-{c++,dane,devel} go-srpm-macros \
    gobject-introspection-devel gom{,-devel} \
    google-{droid-sans,noto-emoji-color}-fonts gpm-libs graphite2{,-devel} \
    grilo{,-devel} groff-base gsettings-desktop-schemas{,-devel} gsm \
    gsound{,-devel} gspell{,-devel} gssdp{,-devel} gstreamer1{,-devel} \
    gstreamer1-plugins-base{,-devel} gtk-doc gtk-update-icon-cache \
    gtk2{,-devel} gtk3{,-devel} gtksourceview3{,-devel} guile \
    gupnp{,-av,-devel} gupnp-dlna{,-devel} harfbuzz{,-devel,-icu} \
    hicolor-icon-theme hunspell{,-en,-en-GB,-en-US} hwdata hyphen \
    ibus{,-devel,-gtk2,-gtk3,-libs,-setup} iio-sensor-proxy isl iso-codes \
    jansson jasper-libs jbig2dec-libs jbigkit-libs json-glib{,-devel} \
    jsoncpp kbd{,-legacy,-misc} kernel{,-debug}-devel kernel-headers \
    keybinder3{,-devel} keyutils-libs-devel krb5-devel lcms2 less libICE libSM \
    libX11{,-common,-devel,-xcb} libXau{,-devel} libXcomposite{,-devel} \
    libXcursor{,-devel} libXdamage{,-devel} libXdmcp libXext{,-devel} \
    libXfixes{,-devel} libXfont2 libXft{,-devel} libXi{,-devel} \
    libXinerama{,-devel} libXmu libXrandr{,-devel} libXrender{,-devel} libXt \
    libXtst libXv libXxf86misc libXxf86vm{,-devel} \
    libappindicator-gtk3{,-devel} libappstream-glib{,-devel} \
    libarchive-devel libasyncns libatasmart libatomic_ops \
    libcanberra{,-devel,-gtk2,-gtk3} libchamplain{,-devel,-gtk} \
    libcom_err-devel libcroco libcue libcurl-devel libdatrie \
    libdbusmenu{,-devel,-gtk3} libdrm{,-devel} libdwarf libedit \
    libepoxy{,-devel} libevdev libexif libfontenc libgcab1{,-devel} \
    libgdata{,-devel} libgee{,-devel} libgexiv2 \
    libglvnd{,-core-devel,-devel,-egl,-gles,-glx,-opengl} libgnomekbd \
    libgomp libgrss libgs libgsf libgtop2 libgudev-devel libgusb \
    libgweather{,-devel} libgxps{,-devel} libical{,-devel} libicu-devel libidn \
    libijs libindicator-gtk3 libinput{,-devel} libiptcdata libjpeg-turbo \
    libkadm5 libldb libmcpp libmediaart libmodman libmpc libndp libnl3 libnma \
    libnotify{,-devel} liboauth{,-devel} libogg libosinfo libpaper \
    libpciaccess libpeas{,-devel,-gtk} libpng{,-devel} libproxy \
    libquvi{,-scripts} librsvg2{,-devel} libsecret{,-devel} libserf \
    libsmbclient libsndfile libsoup{,-devel} libspectre libss libstdc++-devel \
    libstemmer libtalloc libtasn1-{devel,tools} libtdb libtevent libthai \
    libtheora libtiff{,-devel} libtomcrypt libtommath libtool{,-ltdl} \
    libunwind libverto-devel libvisual libvncserver libvorbis libwacom{,-data} \
    libwayland-{client,cursor,egl,server} libwbclient libwebp libxcb{,-devel} \
    libxcrypt-devel libxkbcommon{,-devel,-x11} libxkbfile libxklavier \
    libxml2-devel libxshmfence libxslt libyaml-devel libzapojit{,-devel} \
    llvm-libs lmdb-libs lua{,-expat,-json,-lpeg,-socket} lzo-minilzo m4 make \
    mcpp mdadm mesa-{dri-drivers,filesystem,khr-devel,libglapi} \
    mesa-libEGL{,-devel} mesa-libGL{,-devel} mesa-libgbm{,-devel} meson \
    mobile-broadband-provider-info mokutil mozilla-filesystem mozjs{52,60} \
    mtdev mtools multilib-rpm-config mutter ncurses-{c++-libs,devel} \
    nettle-devel nim-srpm-macros ninja-build nm-connection-editor npm \
    nspr{,-devel} nss{,-devel} nss-softokn{,-devel} \
    nss-softokn-freebl{,-devel} nss-sysinit nss-util{,-devel} \
    ntfs-3g{,-system-compression} ntfsprogs ocaml-srpm-macros \
    openblas-srpm-macros openjade openjpeg2 opensp openssh{,-clients} opus \
    orc{,-compiler,-devel} osinfo-db{,-tools} ostree-libs \
    p11-kit-{devel,server} pango{,-devel} parted patch patchutils \
    perl-{Carp,Data-Dumper,Digest,Digest-MD5,Encode,Errno,Error,Exporter} \
    perl-File-{Path,Temp} \
    perl-{Getopt-Long,Git,HTTP-Tiny,IO,MIME-Base64,Mozilla-CA,Net-SSLeay,PathTools} \
    perl-IO-Socket-{IP,SSL} perl-Pod-{Escapes,Perldoc,Simple,Usage} \
    perl-{SGMLSpm,Scalar-List-Utils,Socket,Storable,Thread-Queue,Time-Local,URI} \
    perl-Term{-ANSIColor,-Cap,ReadKey} perl-Text-{ParseWords,Tabs+Wrap} \
    perl-{Unicode-Normalize,constant,interpreter,libnet,libs,parent,podlators} \
    perl-{,srpm-}macros perl-threads{,-shared} pinentry{,-gtk} \
    pipewire{,-libs} pixman{,-devel} polkit{,-devel,-docs,-libs,-pkla-compat} \
    poppler{,-data,-devel} poppler-glib{,-devel} procps-ng \
    pulseaudio{,-module-bluetooth} pulseaudio-libs{,-glib2} \
    pygobject2{,-codegen,-devel,-doc} pygtk2{,-codegen,-devel,-doc} \
    python-{,s}rpm-macros python-unversioned-command \
    python2{,-devel,-libs,-pip,-rpm-macros,-setuptools,-xpyb} \
    python2-cairo{,-devel} python3-gobject{,-base} \
    python3-{asn1crypto,beaker,cairo,cffi,crypto,cryptography,dateutil,devel} \
    python3-{distro,dnf-plugins-core,idna,mako,markdown,markupsafe,paste,ply} \
    python3-{pyOpenSSL,pycparser,pyparsing,rpm-generators,rpm-macros,tempita} \
    qt5-srpm-macros readline-devel redhat-rpm-config rest{,-devel} rhash \
    rtkit rust-srpm-macros rygel samba-client-libs samba-common{,-libs} sbc \
    sg3_utils-libs sgml-common shared-mime-info smp_utils{,-libs} \
    sound-theme-freedesktop source-highlight soxr speexdsp sqlite{,-devel} \
    startup-notification subunit{,-devel} subversion switcheroo-control \
    systemd-{bootchart,devel} systemtap{,-client,-devel,-runtime,-sdt-devel} \
    taglib telepathy-filesystem telepathy-glib{,-devel,-vala} texlive-lib \
    totem-pl-parser tracker{,-devel,-miners} trousers{,-lib} udisks{,-devel} \
    unzip \
    urw-base35-{bookman,c059,d050000l,gothic,p052,standard-symbols-ps,z003}-fonts \
    urw-base35-fonts{,-common} urw-base35-nimbus-{mono-ps,roman,sans}-fonts \
    utf8proc vala vim-filesystem vino vte{,-devel,-profile} vte291{,-devel} \
    wayland-{,protocols-}devel webkit2gtk3{,-devel,-plugin-process-gtk2} \
    webkit2gtk3-jsc{,-devel} webrtc-audio-processing which woff2 \
    wpa_supplicant xapian-core-libs xcb-util xdg-dbus-proxy \
    xdg-desktop-portal{,-gtk} xfsprogs xkeyboard-config xml-common \
    xorg-x11-{drv-libinput,font-utils,proto-devel,xauth,xinit,xkb-utils} \
    xorg-x11-server-{Xorg,Xwayland,common,utils} xz-devel zenity zip && \
    dnf clean all && \
    rm -rf /var/cache/yum

EXPOSE 9292
CMD bundle exec rackup -o 0.0.0.0
