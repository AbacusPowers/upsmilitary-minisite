load 'deploy' if respond_to?(:namespace) # cap2 differentiator
require 'capifony_symfony2'
load 'app/config/deploy'

#allow for a command line variable to set the environment (i.e. "-s environment=staging")
set(:environment) { "#{stage}" }  unless exists?(:environment)

# Load in the multistage configuration and setup the stages
set :stages,        %w(development staging production local)
set :default_stage, "development"
set :stage_dir,     "app/config/deploy"
require 'capistrano/ext/multistage'

set :ec2_config, 'app/config/ec2.yml'

set :shared_children,    %w(web/uploads app/logs)
set :shared_files,       %w()

