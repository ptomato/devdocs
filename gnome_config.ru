require 'bundler/setup'

$LOAD_PATH.unshift 'lib'

require 'gnome_app'

map '/' do
  run GnomeApp
end

if App.development?
  map '/assets' do
    run App.sprockets
  end
end
