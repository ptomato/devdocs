require 'app'

class GnomeApp < App
    configure do
        set :news_path, File.join(root, assets_prefix, 'javascripts', 'gnome', 'gnome_news.json')
        set :assets_compile, ['*.png', 'docs.js', 'docs.json', 'application.js', 'application-gnome.css', 'application-gnome-dark.css']
    end

    configure :development, :test do
        set :news, -> { parse_news }
    end
    
    configure :production do
        set :news, parse_news
    end

    def manifest_asset_urls
        @@manifest_asset_urls ||= [
        javascript_path('application', asset_host: false),
        stylesheet_path('application-gnome'),
        stylesheet_path('application-gnome-dark'),
        image_path('gnome-icons.png'),
        image_path('gnome-icons@2x.png'),
        # TODO Include @1x and @2x, convert to icon sheet.
        image_path('variable.png'),
        image_path('function.png'),
        image_path('signal.png'),
        image_path('property.png'),
        image_path('docs-1.png'),
        image_path('docs-1@2x.png'),
        image_path('docs-2.png'),
        image_path('docs-2@2x.png'),
        asset_path('docs.js')
      ]
    end

    def stylesheet_paths
        @@stylesheet_paths ||= {
          default: stylesheet_path('application-gnome'),
          dark: stylesheet_path('application-gnome-dark')
        }
    end

    ['application-gnome.css'].each do |asset|
        class_eval <<-CODE, __FILE__, __LINE__ + 1
          get '/#{asset}' do
            redirect asset_path('#{asset}', protocol: 'http')
          end
        CODE
    end
end