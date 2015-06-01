set :deploy_to,   "/var/www/vhosts/fasttrackdevelopment.#{top_domain}"
set(:branch) { Capistrano::CLI.ui.ask("Enter Git Branch to deploy: ") }

#define the servers
server 'chamapi01.srvr.devl.nash.iostudio.com', :web, :app, :db

#git cache server.
server 'git-cache@prov01.srvr.devl.nash.iostudio.com', :git_mirror, :no_release => true
before "deploy","deploy:update_mirror"

namespace :deploy do
  task :update_mirror, :roles => [:git_mirror] do
    run "cd #{application}.git; git remote update"
  end
end