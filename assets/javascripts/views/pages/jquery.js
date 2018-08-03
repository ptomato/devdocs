/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
//= require views/pages/base

const Cls = (app.views.JqueryPage = class JqueryPage extends app.views.BasePage {
  constructor(...args) {
    {
      // Hack: trick Babel/TypeScript into allowing this before super.
      if (false) { super(); }
      let thisFn = (() => { return this; }).toString();
      let thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();
      eval(`${thisName} = this;`);
    }
    this.onIframeLoaded = this.onIframeLoaded.bind(this);
    super(...args);
  }

  static initClass() {
    this.demoClassName = '_jquery-demo';
  }

  afterRender() {
    // Prevent jQuery Mobile's demo iframes from scrolling the page
    for (let iframe of Array.from(this.findAllByTag('iframe'))) {
      iframe.style.display = 'none';
      $.on(iframe, 'load', this.onIframeLoaded);
    }

    return this.runExamples();
  }

  onIframeLoaded(event) {
    event.target.style.display = '';
    $.off(event.target, 'load', this.onIframeLoaded);
  }

  runExamples() {
    for (let el of Array.from(this.findAllByClass('entry-example'))) {
      try { this.runExample(el); } catch (error) {}
    }
  }

  runExample(el) {
    let iframe;
    const source = el.getElementsByClassName('syntaxhighlighter')[0];
    if (!source || (source.innerHTML.indexOf('!doctype') === -1)) { return; }

    if (!(iframe = el.getElementsByClassName(this.constructor.demoClassName)[0])) {
      iframe = document.createElement('iframe');
      iframe.className = this.constructor.demoClassName;
      iframe.width = '100%';
      iframe.height = 200;
      el.appendChild(iframe);
    }

    const doc = iframe.contentDocument;
    doc.write(this.fixIframeSource(source.textContent));
    doc.close();
  }

  fixIframeSource(source) {
    source = source.replace('"/resources/', '"https://api.jquery.com/resources/'); // attr(), keydown()
    source = source.replace('</head>', `\
<style>
  html, body { border: 0; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
</style>
<script>
  $.ajaxPrefilter(function(opt, opt2, xhr) {
    if (opt.url.indexOf('http') !== 0) {
      xhr.abort();
      document.body.innerHTML = "<p><strong>This demo cannot run inside DevDocs.</strong></p>";
    }
  });
</script>
</head>\
`
    );
    return source.replace(/<script>/gi, '<script nonce="devdocs">');
  }
});
Cls.initClass();
