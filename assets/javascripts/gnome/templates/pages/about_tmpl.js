{
  app.templates.aboutPage = () => `\
  <nav class="_toc" role="directory">
    <h3 class="_toc-title">Table of Contents</h3>
    <ul class="_toc-list">
      <li><a href="#copyright">Copyright</a>
      <li><a href="#faq">FAQ</a>
      <li><a href="#credits">Credits</a>
      <li><a href="#privacy">Privacy Policy</a>
    </ul>
  </nav>
  
  <h1 class="_lined-heading">GJS Docs: Powered By DevDocs</h1>
  <p>GJS Docs utilizes DevDocs' ability to combine multiple API documentations to explore the GNOME API documentation for GJS. DevDocs provides a clean, organized web UI with instant search, offline support, mobile version, dark theme, keyboard shortcuts, and much more!
  <ul>
    <li>GJS Docs is maintained by Philip Chimento</li>
    <li>DevDocs was created by <a href="https://thibaut.me">Thibaut Courouble</a>
    <li>Free and <a href="https://github.com/freeCodeCamp/devdocs">open source</a>
        <iframe class="_github-btn" src="https://ghbtns.com/github-btn.html?user=ptomato&repo=devdocs&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="100" height="20" tabindex="-1"></iframe>
  </ul>
  <p>To keep up-to-date with the latest news:
  <ul>
    <li>Watch the repository on <a href="https://github.com/ptomato/devdocs/subscription">GitHub</a>
  </ul>
  
  <h2 class="_block-heading" id="copyright">Copyright and License</h2>
  <p class="_note">
    <strong>Copyright 2013&ndash;2018 Thibaut Courouble, Philip Chimento, Evan Welsh and <a href="https://github.com/ptomato/devdocs/graphs/contributors">other contributors</a></strong><br>
    This software is licensed under the terms of the Mozilla Public License v2.0.<br>
    You may obtain a copy of the source code at <a href="https://github.com/ptomato/devdocs">github.com/ptomato/devdocs</a>.<br>
    For more information, see the <a href="https://github.com/ptomato/devdocs/blob/master/COPYRIGHT">COPYRIGHT</a>
    and <a href="https://github.com/ptomato/devdocs/blob/master/LICENSE">LICENSE</a> files.
  
  <h2 class="_block-heading" id="faq">Questions & Answers</h2>
  <dl>
    <dt>Where can I suggest new docs and features?
    <dd>If you have a specific feature request related to DevDocs, add it to the <a href="https://github.com/freeCodeCamp/devdocs/issues">issue tracker</a>.<br>
        If your feature is related to GNOME documentation please request it <a href="https://github.com/ptomato/devdocs/issues">here</a>.
    <dt>Where can I report bugs?
    <dd>In the <a href="https://github.com/ptomato/devdocs/issues">issue tracker</a>. Thanks!
  </dl>

  <h2 class="_block-heading" id="credits">Credits</h2>
  
  <p><strong>Special thanks to:</strong>
  <ul>
    <!--<li><a href="https://out.devdocs.io/s/maxcdn">MaxCDN</a>, <a href="https://sentry.io/">Sentry</a> and <a href="https://get.gaug.es/?utm_source=devdocs&utm_medium=referral&utm_campaign=sponsorships" title="Real Time Web Analytics">Gauges</a> for offering a free account to DevDocs
    <li><a href="https://out.devdocs.io/s/maxcdn">MaxCDN</a>, <a href="https://out.devdocs.io/s/shopify">Shopify</a>, <a href="https://out.devdocs.io/s/jetbrains">JetBrains</a> and <a href="https://out.devdocs.io/s/code-school">Code School</a> for sponsoring DevDocs in the past
    <li><a href="https://www.heroku.com">Heroku</a> and <a href="https://newrelic.com/">New Relic</a> for providing awesome free service
    <li><a href="https://www.jeremykratz.com/">Jeremy Kratz</a> for the C/C++ logo-->
    <li>Everaldo Canuto, Patrick Griffis, and Dustin Falgout for helping get this site back online
    <li><a href="https://nuveo.com.br">Nuveo</a> for sponsoring the hosting
    <li>Daniel Bruce for the <a href="http://www.entypo.com">Entypo</a> pictograms.
    <li><a href="https://icons8.com/icon/set/programming">Icons8</a> for the programming category icons.
  </ul>
  
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
    <li><a href="https://docs.gjs.guide">GJS Docs</a> ("App") is operated by the GNOME Community ("We").
    <li>We do not collect personal information.
    <li>While upstream utilizes Google Analytics, Gauges and Sentry to collect anonymous traffic information and improve the app, we have <b>disabled</b> these components.
    <li>The app uses cookies to store user preferences.
    <li>By using the app, you signify your acceptance of this policy. If you do not agree to this policy, please do not use the app.
    <li>If you have any questions regarding privacy, please file a GitHub issue in the <a href="https://github.com/ptomato/devdocs">GJS Docs repo</a>.
  </ul>\
  `;

  var credits = [
    ['Cally',
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
