json.id @user.id
json.fname @user.fname
json.lname @user.lname
json.address @user.address
json.email @user.email
json.phone @user.phone
json.gender @user.gender
json.dateofbirth @user.dateofbirth
json.created_at @user.created_at
json.friend @friend
json.privilege @privilege
json.items @user.items.reverse do |item|
  json.id item.id
  json.name item.name
  json.description item.description
  json.image rails_blob_url(item.image) if item.image.attached?
end
json.borrowed_items @user.loans.reverse do |loan|
  json.loan_info loan
  json.id loan.item.id
  json.name loan.item.name
  json.description loan.item.description
  json.image rails_blob_url(loan.item.image) if loan.item.image.attached?
end