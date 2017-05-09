# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

def get_files(files, path)
  files.map do |file|
    item = @items.find { |i| i.identifier.to_s[%r{/#{path}/#{file}(?:\.css)?/}] }
    puts "File #{file} doesn't exist!" unless item
    item.compiled_content
  end.join("\n")
end

def all_js(files)
  get_files files, :js
end

def all_css(files)
  get_files files, :css
end

def production
  ENV['NANOC_ENV'] === "production"
end
