upsvets
=======

A Symfony project created on April 22, 2015, 10:40 am.

1. After cloning into working dev environment, run the following in the console:
`composer install`, then `php app/console assets:install`

2. Then, unpack the ups-vcg-gulp.zip file. Place the gulp/ folder and gulpfile.js inside the root directory.

3. Edit gulpfile.js to reflect your dev URL.


GIT
========
* After cloning, to begin work, run `git checkout -b new-branch-name`. 
* When finished working, run `git add .` (assuming you want to add all changes to the repo), then `git commit -m "commit message goes here"` to commit your changes to the branch.
* Then, you can push the branch to origin by running `git push origin new-branch-name`.
* Once the branch is pushed, go ahead and merge the branch to master by running `git checkout master`, then `git merge new-branch-name`
* Next, you can commit the changes to the master branch by running `git add .` and then `git commit -m "commit merge message goes here"
* Finally, push to master, so everyone will receive your changes by running `git push origin master`