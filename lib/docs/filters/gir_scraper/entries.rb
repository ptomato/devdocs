module Docs
  class GirScraper
    # EntriesFilter for g-ir-doc-tool generated documentation. This figures out
    # the metadata for each page.
    class EntriesFilter < Docs::EntriesFilter
      # "name" is the title that the documentation page has in the left sidebar.
      def get_name
        node = at_css('h1')
        result = node.content.strip
        result
      end

      # "type" is the heading that the documentation page is displayed under, in
      # the left sidebar.
      def get_type
        name
      end

      def additional_entries
        entries = []

        # Additional entries should be marked with the entry class
        css('.entry').each do |node|
          entries.push [node.content, node[:id]]
        end

        entries
      end
    end
  end
end
