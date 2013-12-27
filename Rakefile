BUILD_DIR = 'build'

task :build do
  require 'nanoc'
  require 'nanoc/cli'

  site = ::Nanoc::Site.new('.')
  site.config[:output_dir] = BUILD_DIR
  site.config[:env] = 'production'
  site.compile
  ::Nanoc::Extra::Pruner.new(site, site.config[:prune]).run
end

task :deploy => [ :build ] do
  name = ARGV.last
  task name.to_sym do; end

  if ARGV.length > 1 and name == 'dropbox'
    deploy_to_dropbox
  else
    deploy_to_github
  end
end

task :init_github_pages do
  sh "git clone --branch master --single-branch git@github.com:raine/raine.github.com.git raine.github.io"
end

task :deploy_to_dropbox do
  deploy_to_dropbox
end

task :deploy_to_github do
  deploy_to_github
end

task :default => 'build'

def deploy_to_dropbox
  sh "./assets/deploy.sh resume"
end

def deploy_to_github
  Dir.chdir "raine.github.io" do
    sh "git reset --hard"
    sh "git clean -fd"
    sh "rm -r *"
    sh "cp -R ../#{BUILD_DIR}/* ."
    sh "git add -A"
    sh "git commit -m 'deploying #{Time.now}'" do |ok, res|; end
    sh "git push"
  end
end
