# render basic user identification
json.partial! "users/identity", user: user

# additionally, render the privileged user info
# json.address @user.address
# json.email @user.email
# json.phone @user.phone
# json.gender @user.gender
# json.dateofbirth @user.dateofbirth
# json.created_at @user.created_at
json.extract! user, :address, :email, :phone, :gender, :dateofbirth, :created_at, :updated_at