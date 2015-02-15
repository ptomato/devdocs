module Docs
  class Gir
    # EntriesFilter for g-ir-doc-tool generated documentation. This figures out
    # the metadata for each page.
    class EntriesFilter < Docs::EntriesFilter
      FUNCTIONS_HEADING = '(Functions)'
      FUNCTION_TYPES_HEADING = '(Function Types)'
      CONSTANTS_HEADING = '(Constants)'

      # "name" is the title that the documentation page has in the left sidebar.
      def get_name
        node = at_css('h1')
        entry = node.content
        entry.slice!(/^[A-Za-z]+\./)  # remove namespace
        annotate_entry entry, node
      end

      # "type" is the heading that the documentation page is displayed under, in
      # the left sidebar.
      def get_type
        node = at_css('h1')
        case node[:class]
        when 'function' then FUNCTIONS_HEADING
        when 'callback' then FUNCTION_TYPES_HEADING
        when 'default' then CONSTANTS_HEADING  # not sure about this
        else name
        end
      end

      def additional_entries
        entries = []

        # Additional entries should be marked with the entry class
        css('.entry').each do |node|
          entry = annotate_entry node.content, node
          entries.push [entry, node[:id]]
        end

        entries
      end

      def annotate_entry(entry, node)
        entry.strip!
        # node.matches('selector') would be cleaner than this, but is way slower
        case node[:class]
        when /\b(function|method|constructor)\b/ then entry << '()'
        when /\bproperty\b/ then entry.prepend(':')
        when /\bsignal\b/ then entry.prepend('::')
        end
        entry
      end
    end
  end
end
