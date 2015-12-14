module Docs
  class GirScraper
    # EntriesFilter for g-ir-doc-tool generated documentation. This figures out
    # the metadata for each page.
    class EntriesFilter < Docs::EntriesFilter
      FUNCTIONS_HEADING = '(Functions)'
      FUNCTION_TYPES_HEADING = '(Function Types)'
      CONSTANTS_HEADING = '(Constants)'

      # "name" is the title that the documentation page has in the left sidebar.
      def get_name
        node = at_css('h1')
        entry = node.content.strip
        entry.slice!(/^[A-Za-z]+\./)  # remove namespace
        annotate_entry entry, node
      end

      # "type" is the heading that the documentation page is displayed under, in
      # the left sidebar.
      def get_type
        node = at_css('h1')
        case node[:class]
        when /\bfunction\b/ then FUNCTIONS_HEADING
        when /\bcallback\b/ then FUNCTION_TYPES_HEADING
        when /\bconstant\b/ then CONSTANTS_HEADING
        else name
        end
      end

      def additional_entries
        entries = []

        # Additional entries should be marked with the entry class
        css('.entry').each do |node|
          punct = /\bsignal\b/.match(node[:class]) ? '::' : '.'
          display_name = "#{name}#{punct}#{node.content.strip}"
          display_name = annotate_entry display_name, node
          entries.push [display_name, node[:id]]
        end

        entries
      end

      def annotate_entry(entry, node)
        entry.strip!
        # node.matches('selector') would be cleaner than this, but is way slower
        case node[:class]
        when /\b(function|method|constructor)\b/ then entry << '()'
        end
        entry.prepend('⚠ ') if /\bdeprecated\b/.match(node[:class])
        entry
      end
    end
  end
end
