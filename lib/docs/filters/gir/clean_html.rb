module Docs
  class Gir
    # CleanHtmlFilter for g-ir-doc-tool generated documentation. This is
    # currently empty but can be used to make tweaks to the HTML so it looks
    # nice in the DevDocs browser.
    class CleanHtmlFilter < Filter
      def call
        doc
      end
    end
  end
end
