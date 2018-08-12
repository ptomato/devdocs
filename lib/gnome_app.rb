require 'app'

class GnomeApp < App
    configure do
        set :assets_compile, ['*.png', 'docs.js', 'docs.json', 'application.js', 'application-gnome.css', 'application-gnome-dark.css']
    end

    def manifest_asset_urls
        @@manifest_asset_urls ||= [
        javascript_path('application', asset_host: false),
        stylesheet_path('application-gnome'),
        stylesheet_path('application-gnome-dark'),
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
