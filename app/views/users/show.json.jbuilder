json.id @user.id
json.fname @user.fname
json.lname @user.lname
json.address @user.address
json.email @user.email
json.phone @user.phone
json.gender @user.gender
json.dateofbirth @user.dateofbirth
json.created_at @user.created_at
json.items @user.items do |item|
  json.id item.id
  json.name item.name
  json.desc item.description
end