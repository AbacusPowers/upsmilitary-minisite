set :deploy_to,   "/var/www/vhosts/wwwstaging.#{top_domain}"
set :user,        "www-deploy"
set(:branch) { Capistrano::CLI.ui.ask("Enter Git Branch to deploy: ") }
set :keep_releases, 2

#define the servers based on tags on server instances.
require "capify-ec2/capistrano"
ec2_roles :app
before "deploy","app"

role :git_mirror, "git-cache@prov01.srvr.stag.amze.iostudio.com"
role :git_mirror, "git-cache@prov02.srvr.stag.amze.iostudio.com"
before "app","deploy:update_mirror"

namespace :deploy do
  task :update_mirror, :roles => [:git_mirror] do
    run "cd ups/#{application}.git; git remote update"
  end
end
