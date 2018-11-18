json.users @user do |user|
    json.id user.id
    json.fname user.fname
    json.lname user.lname
    json.email user.email
end