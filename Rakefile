YUI_JAR = File.join Dir.pwd, 'yuicompressor.jar'

CSS_INPUT  = 'output/css/*'
CSS_OUTPUT = 'output/css/resume.min.css'

JS_FILES = %w(
  jquery.fancybox.pack.js
  jquery.fancybox-thumbs.js
  underscore.js
  easing.js
  px.js
  resume.js
).map! { |f| 'output/js/' + f }

JS_OUTPUT = 'output/js/resume.min.js'

task :build do
  sh "./nanoc_build_prod.sh"

	sh "cat #{CSS_INPUT} > tmp/combined.css"
	sh "cat #{JS_FILES.join ' '} > tmp/combined.js"

	sh "java -jar #{YUI_JAR} --type css --charset utf8 -o #{CSS_OUTPUT} tmp/combined.css"
	sh "java -jar #{YUI_JAR} --type js --charset utf8 -o #{JS_OUTPUT} tmp/combined.js"
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
