set(:domain) {`pwd | awk -FS"/" 'BEGIN{FS="/";ORS=""}{i=NF-2; print $i}'`}
set :deploy_to,   "/var/www/vhosts/#{domain}"
set(:repository) { `git remote -v | awk -F" " 'BEGIN{ORS=""}{if(NR == 1)print $2}'` }

#set based on currently checked out branch.
set(:branch) {`git branch | awk 'BEGIN{ORS=""}{if(NF > 1) print $2;}'`}

set :can_cold_deploy , true

role :web,        "127.0.0.1"                         # Your HTTP server, Apache/etc
role :app,        "127.0.0.1", :primary => true       # This may be the same as your `Web` server
