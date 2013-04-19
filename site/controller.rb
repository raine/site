ignore /assets/
ignore /\/\..*/ # ignore hidden files

before 'index.html.erb' do
  @production = @_stasis.options[:production] == true
end
