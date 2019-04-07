module Docs
  # GirScraper: Instead of being given a path to HTML documentation, this gets a
  # path to a GIR file, which it runs through g-ir-doc-tool to generate the HTML
  # documentation.
  class GirScraper < FileScraper
    class << self
      attr_accessor :c_prefix
      attr_accessor :api_version
      attr_accessor :gir_path
      attr_accessor :extra_include
    end

    self.type = 'gir'
    self.abstract = true
    self.root_path = 'index.html'

    html_filters.push 'gir_scraper/entries', 'gir_scraper/clean_html'

    # {GIR_NAME} to be replaced in scraper subclass
    options[:attribution] = "Generated from {GIR_NAME} on \
      #{Date.today.strftime('%a, %d %b %Y')}"

    # For links to other GIR modules, we assume that those modules are also
    # present in DevDocs
    options[:fix_urls] = ->(url) { url.gsub!(/^gir:/, '..') }

    def initialize
      super
      run_doctool self.class.gir_path
    end

    def doctool
      ENV['G_IR_DOC_TOOL'].nil? ? 'g-ir-doc-tool' : ENV['G_IR_DOC_TOOL']
    end

    def run_doctool(gir_path)
      include_path = File.dirname(gir_path)
      command = "#{doctool} #{gir_path} -o #{source_directory} -l gjs -f devdocs -I #{include_path}"
      if !self.class.extra_include.empty?
        command += " -I #{self.class.extra_include}"
      end
      puts "Generating HTML documentation: #{command}"
      unless system command
        FileUtils.remove_entry source_directory
        fail 'g-ir-doc-tool failed'
      end
    end
  end
end
