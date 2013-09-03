BUILD_DIR = 'build'

YUI_JAR = File.join Dir.pwd, 'yuicompressor.jar'

CSS_INPUT  = "#{BUILD_DIR}/css/*"
CSS_OUTPUT = "#{BUILD_DIR}/css/resume.min.css"

JS_FILES = %w(
  jquery.fancybox.pack.js
  jquery.fancybox-thumbs.js
  underscore.js
  easing.js
  px.js
  efu.js
  fancybox.js
).map! { |f| "#{BUILD_DIR}/js/" + f }

JS_OUTPUT = "#{BUILD_DIR}/js/resume.min.js"

task :build do
  require 'nanoc'
  require 'nanoc/cli'

  site = ::Nanoc::Site.new('.')
  site.config[:output_dir] = 'build'
  site.config[:env] = 'production'
  site.compile
  ::Nanoc::Extra::Pruner.new(site, site.config[:prune]).run

	sh "cat #{CSS_INPUT} > tmp/combined.css"
	sh "cat #{JS_FILES.join ' '} > tmp/combined.js"

	sh "java -jar #{YUI_JAR} --type css --charset utf8 -o #{CSS_OUTPUT} tmp/combined.css"
	sh "java -jar #{YUI_JAR} --type js --charset utf8 -o #{JS_OUTPUT} tmp/combined.js"
end

task :publish => [ :build ] do
  # sh "cp -R site/public/* raneksi.github.io"

  # Dir.chdir "raneksi.github.io" do
  #   sh "git add ."
  #   sh "git commit -a -m 'deploying #{Time.now}'"
  #   sh "git push"
  # end
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
  sh "git clone --branch master --single-branch git@github.com:raneksi/raneksi.github.com.git raneksi.github.io"
end

task :deploy_to_dropbox do
  deploy_to_dropbox
end

task :default => 'build'

def deploy_to_dropbox
  sh "./assets/deploy.sh resume"
end

def deploy_to_github
  p 'TODO'
end
