# All files in the 'lib' directory will be loaded
# before nanoc starts compiling.

def all_js(files)
  files.map do |file|
    item = @items.find { |i| i.identifier == "/js/#{file}/" }
    puts "File #{file} doesn't exist!" unless item
    item.compiled_content
  end.join("\n")
end

def production
  @config[:env] === "production"
end
