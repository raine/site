ignore /assets/
ignore /\/\..*/ # ignore hidden files

before 'index.html.erb' do
  @production = ENV['ENV'] == 'production'
end
