YUI_COMPRESSOR = File.join Dir.pwd, 'yuicompressor.jar'

CSS_INPUT  = 'public/css/*'
CSS_OUTPUT = 'public/resume.min.css'

JS_FILES = %w(
  jquery.fancybox.pack.js
  jquery.fancybox-thumbs.js
  underscore.js
  px.js
  resume.js
).map! { |f| 'public/js/' + f }

JS_OUTPUT = 'public/resume.min.js'

require 'stasis'

task :build do
  # Stasis changes the cwd as a side-effect
  pwd = Dir.pwd
  stasis = Stasis.new 'site/'
  stasis.options[:production] = true
  stasis.render
  Dir.chdir pwd

  Dir.chdir "#{pwd}/site" do
	mkdir_p "tmp"

	sh "cat #{CSS_INPUT} > tmp/combined.css"
	sh "java -jar #{YUI_COMPRESSOR} -v --type css --charset utf8 -o #{CSS_OUTPUT} tmp/combined.css"

	sh "cat #{JS_FILES.join ' '} > tmp/combined.js"
	sh "java -jar #{YUI_COMPRESSOR} -v --type js --charset utf8 -o #{JS_OUTPUT} tmp/combined.js"

	sh "rm -rf public/css public/js"
	sh "rm -rf tmp"
  end
end

task :publish => [ :build ] do
  sh "cp -R site/public/* raneksi.github.io"

  Dir.chdir "raneksi.github.io" do
	sh "git add ."
	sh "git commit -a -m 'deploying #{Time.now}'"
	sh "git push"
  end
end

task :init_github_pages do
  sh "git clone --branch master --single-branch git@github.com:raneksi/raneksi.github.com.git raneksi.github.io"
end

task :default => 'build'
