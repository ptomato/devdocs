{
  app.templates.aboutPage = () => `\
  <nav class="_toc" role="directory">
    <h3 class="_toc-title">Table of Contents</h3>
    <ul class="_toc-list">
      <li><a href="#copyright">Copyright</a>
      <li><a href="#plugins">Plugins</a>
      <li><a href="#faq">FAQ</a>
      <li><a href="#credits">Credits</a>
      <li><a href="#privacy">Privacy Policy</a>
    </ul>
  </nav>

  <h1 class="_lined-heading">DevDocs: API Documentation Browser</h1>
  <p>DevDocs combines multiple API documentations in a clean and organized web UI with instant search, offline support, mobile version, dark theme, keyboard shortcuts, and more.
  <ul>
    <li>Created and maintained by <a href="https://thibaut.me">Thibaut Courouble</a>
    <li>Free and <a href="https://github.com/freeCodeCamp/devdocs">open source</a>
        <iframe class="_github-btn" src="https://ghbtns.com/github-btn.html?user=freeCodeCamp&repo=devdocs&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="100" height="20" tabindex="-1"></iframe>
  </ul>
  <p>To keep up-to-date with the latest news:
  <ul>
    <li>Follow <a href="https://twitter.com/DevDocs">@DevDocs</a> on Twitter
    <li>Watch the repository on <a href="https://github.com/freeCodeCamp/devdocs/subscription">GitHub</a>
    <li>Join the <a href="https://groups.google.com/d/forum/devdocs">mailing list</a>
  </ul>

  <h2 class="_lined-heading">About the GNOME JavaScript documentation</h2>
  <p>Generated using a modified <a href="https://github.com/ptomato/gobject-introspection/tree/wip/ptomato/devdocs">g-ir-doc-tool</a>.
     An experiment demoed at the Developer Experience hackfest 2016.


  <h2 class="_block-heading" id="copyright">Copyright and License</h2>
  <p class="_note">
    <strong>Copyright 2013&ndash;2018 Thibaut Courouble and <a href="https://github.com/freeCodeCamp/devdocs/graphs/contributors">other contributors</a></strong><br>
    This software is licensed under the terms of the Mozilla Public License v2.0.<br>
    You may obtain a copy of the source code at <a href="https://github.com/ptomato/devdocs">github.com/ptomato/devdocs</a> or of the original DevDocs' source code at <a href="https://github.com/freeCodeCamp/devdocs">github.com/freeCodeCamp/devdocs</a>.<br>
    For more information, see the <a href="https://github.com/freeCodeCamp/devdocs/blob/master/COPYRIGHT">COPYRIGHT</a>
    and <a href="https://github.com/freeCodeCamp/devdocs/blob/master/LICENSE">LICENSE</a> files.

  <!--h2 class="_block-heading" id="plugins">Plugins and Extensions</h2>
  <ul>
    <li><a href="https://chrome.google.com/webstore/detail/devdocs/mnfehgbmkapmjnhcnbodoamcioleeooe">Chrome web app</a>
    <li><a href="https://github.com/egoist/devdocs-app">Desktop app</a>
    <li><a href="https://sublime.wbond.net/packages/DevDocs">Sublime Text package</a>
    <li><a href="https://atom.io/packages/devdocs">Atom package</a>
    <li><a href="https://marketplace.visualstudio.com/items?itemName=deibit.devdocs">Visual Studio Code extension</a>
    <li><a href="https://github.com/yannickglt/alfred-devdocs">Alfred workflow</a>
    <li><a href="https://github.com/search?q=topic%3Adevdocs&type=Repositories">More…</a>
  </ul-->

  <h2 class="_block-heading" id="faq">Questions & Answers</h2>
  <dl>
    <dt>Where can I suggest new docs and features?
    <dd>Find <strong>ptomato</strong> in #javascript on irc.gnome.org, or post to <a href="https://mail.gnome.org/mailman/listinfo/javascript-list">javascript-list</a>.
    <dt>Where can I report bugs?
    <dd>Report bugs with the documentation in the <a href="https://github.com/ptomato/devdocs/issues">issue tracker</a>.
        Bugs in the DevDocs app go to <a href="https://github.com/freeCodeCamp/devdocs/issues">DevDocs' own issue tracker</a>.
  </dl>

  <h2 class="_block-heading" id="credits">Credits</h2>

  <!-- The first three don't apply to us, we're not getting sponsored. The C/C++
    logo is not used now, but will be later. -->
  <!--p><strong>Special thanks to:</strong>
  <ul>
    <li><a href="https://out.devdocs.io/s/maxcdn">MaxCDN</a>, <a href="https://sentry.io/">Sentry</a> and <a href="https://get.gaug.es/?utm_source=devdocs&utm_medium=referral&utm_campaign=sponsorships" title="Real Time Web Analytics">Gauges</a> for offering a free account to DevDocs
    <li><a href="https://out.devdocs.io/s/maxcdn">MaxCDN</a>, <a href="https://out.devdocs.io/s/shopify">Shopify</a>, <a href="https://out.devdocs.io/s/jetbrains">JetBrains</a> and <a href="https://out.devdocs.io/s/code-school">Code School</a> for sponsoring DevDocs in the past
    <li><a href="https://www.heroku.com">Heroku</a> and <a href="https://newrelic.com/">New Relic</a> for providing awesome free service
    <li><a href="https://www.jeremykratz.com/">Jeremy Kratz</a> for the C/C++ logo
  </ul-->

  <div class="_table">
    <table class="_credits">
      <tr>
        <th>Documentation
        <th>Copyright
        <th>License
      ${(credits).map((c) => `<tr><td>${c[0]}<td>&copy; ${c[1]}<td><a href=\"${c[3]}\">${c[2]}</a>`).join('')}
    </table>
  </div>

  <h2 class="_block-heading" id="privacy">Privacy Policy</h2>
  <ul>
    <li><a href="https://devdocs.io">devdocs.io</a> ("App") is operated by Thibaut Courouble ("We").
    <li>We do not collect personal information.
    <li>We use Google Analytics, Gauges and Sentry to collect anonymous traffic information and improve the app.
    <li>The app uses cookies to store user preferences.
    <li>By using the app, you signify your acceptance of this policy. If you do not agree to this policy, please do not use the app.
    <li>If you have any questions regarding privacy, please email <a href="mailto:thibaut@devdocs.io">thibaut@devdocs.io</a>.
  </ul>\
`;

  var credits = [
    [
      'Cally',
      '2008, 2009, 2010 Igalia S.L.',
      'GNU FDL 1.1',
      'https://developer.gnome.org/cally/stable/'
    ],
    [
      'Champlain',
      '2008–2013 libchamplain contributors',
      'GNU FDL 1.1',
      'https://developer.gnome.org/libchamplain/unstable/'
    ],
    [
      'Clutter',
      '2006, 2007, 2008 OpenedHand Ltd<br>2009, 2010, 2011, 2012 Intel Corporation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/clutter/stable/'
    ],
    [
      'Clutter Gst',
      '2006, 2007, 2008 OpenedHand Ltd<br>2009, 2010 Intel Corporation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/clutter-gst/stable/'
    ],
    [
      'Clutter GTK',
      '2006, 2007, 2008, 2009 Intel Corporation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/clutter-gtk/stable/'
    ],
    [
      'Cogl',
      '2008 OpenedHand Ltd<br>2009, 2010 Intel Corporation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/cogl/stable/'
    ],
    [
      'CSS<br>JavaScript',
      '2005-2015 Mozilla Developer Network and individual contributors',
      'CC BY-SA',
      'http://creativecommons.org/licenses/by-sa/2.5/'
    ],
    [
      'EvinceDocument<br>EvinceView',
      '2007, 2008, 2009 Nickolay V. Shmyrev<br>2008, 2009, 2010 Carlos Garcia Campos<br>2009, 2010 Christian Persch',
      'GPL 2',
      'https://developer.gnome.org/libevdocument/stable/'
    ],
    [
      'GdkPixbuf',
      '2000 The Free Software Foundation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/gdk-pixbuf/unstable/'
    ],
    [
      'GOA',
      '2011, 2012 The GOA Authors',
      'GNU FDL 1.1',
      'https://developer.gnome.org/goa/stable/'
    ],
    [
      'GOM',
      '2012 Christian Hergert',
      'GNU FDL 1.1',
      'https://developer.gnome.org/gom/unstable/'
    ],
    [
      'GSSDP',
      '2007 OpenedHand Ltd<br>2009, 2010, 2011 Nokia Corporation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/gssdp/unstable/'
    ],
    [
      'GUPnP',
      '2007, 2008 OpenedHand Ltd<br>2007, 2008 Zeeshan Ali<br>2009, 2010 Nokia Corporation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/gupnp-av/unstable/'
    ],
    [
      'JSON-GLib',
      '2007, 2008 OpenedHand Ltd<br>2009, 2010, 2011 Intel Corporation',
      'GNU FDL 1.1',
      'https://developer.gnome.org/json-glib/stable/'
    ],
    [
      'Other generated docs',
      'Their respective project',
      'Various',
      'https://developer.gnome.org/references'
    ],
    [
      'RSVG',
      '2003, 2004, 2005, 2006, 2007, 2008, 2009 Dom Lachowicz<br>2010 Christian Persch',
      'GPL 2',
      'https://developer.gnome.org/rsvg/stable/'
    ],
    [
      'VTE',
      '2009, 2010 Christian Persch',
      'LGPL 2.1',
      'https://developer.gnome.org/vte/unstable/'
    ],
    [
      'Zapojit',
      '2012 The Zapojit authors',
      'GNU FDL 1.1',
      'https://developer.gnome.org/libzapojit/unstable/'
    ]
  ];
}
