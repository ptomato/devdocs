module Docs
  # Gir: Instead of being given a path to HTML documentation, this gets a
  # path to a GIR file, which it runs through g-ir-doc-tool to generate the HTML
  # documentation.
  class Gir < FileScraper
    class << self
      attr_accessor :c_prefix
      attr_accessor :api_version
      attr_accessor :gir_path
    end

    self.type = 'gir'
    self.abstract = true
    self.root_path = 'index.html'

    html_filters.push 'gir/entries', 'gir/clean_html'

    def initialize
      super
      self.class.dir = run_doctool self.class.gir_path
    end

    def doctool
      ENV['G_IR_DOC_TOOL'].nil? ? 'g-ir-doc-tool' : ENV['G_IR_DOC_TOOL']
    end

    def run_doctool(gir_path)
      puts 'Generating HTML documentation...'
      dir = Dir.mktmpdir
      unless system "#{doctool} #{gir_path} -o #{dir} -l gjs -f devdocs"
        FileUtils.remove_entry dir
        fail 'g-ir-doc-tool failed'
      end
      dir
    end
  end
end
