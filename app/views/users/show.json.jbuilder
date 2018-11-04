json.id @user.id
json.fname @user.fname
json.lname @user.lname
json.items @user.items do |item|
  json.id item.id
  json.name item.name
  json.desc item.description
end