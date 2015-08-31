set :application     , "vcg_symfony"
set :top_domain      , "vcg_symfony"
set :user            , "www-deploy"
set :can_cold_deploy , true


set :asset_children , ["html/js"]
set :shared_children, ["log"]
set :symfony_orm , "doctrine"
set :use_orm , false

set :scm,                     :git
set :git_enable_submodules,   1
set :deploy_via,              :remote_cache
set :copy_exclude,            [ '.git' ]
set :repository,              "ssh://git@repo03.iostudiohq.com:7999/ups/#{application}.git"
set :use_sudo,                false
set :group_writable,          false
set :keep_releases,           3
set :use_composer,            true
set :composer_options,        '--verbose --optimize-autoloader --no-progress'
set :copy_vendors,            true
set :update_vendors,          false
set :dump_assetic_assets,     true

logger.level = Logger::MAX_LEVEL

set  :keep_releases,  3
after "deploy", "deploy:cleanup"
after "deploy:share_childs" do
    run "if [ ! -f #{current_release}/app/logs/prod.log ]; then touch #{current_release}/app/logs/prod.log; chmod 664 #{current_release}/app/logs/prod.log; fi"
end

before("deploy:finalize_update") do
  # make sure log folder is writable.
  run "mkdir -p #{shared_path}/app/logs"
  run "chmod g+w #{shared_path}/app/logs"
  #compile css file
  invoke_command "bash -c '. /home/www-deploy/.nvm/nvm.sh && cd #{current_release}; (npm install || true) && (bower install || true) && gulp build:css'", :via => run_method
  # run "cd #{current_release}; (npm install || true) && (bower install || true) && gulp compile:sass"

  #normal release
  run "if [ -f #{current_release}/web/robots.txt.#{environment} ]; then cp #{current_release}/web/robots.txt.#{environment} #{current_release}/web/robots.txt; fi"
  run "if [ -f #{current_release}/app/config/parameters.#{environment}.yml ]; then cp #{current_release}/app/config/parameters.#{environment}.yml #{current_release}/app/config/parameters.yml; fi"
end


namespace :deploy do
  desc "Graceful apache restart"
  task :restart, :roles => :app do
    run "cd #{current_release}; app/console assets:install"
    run "cd #{current_release}; app/console ups:crawl:export"
    run "sudo /usr/sbin/apache2ctl graceful"
  end
end