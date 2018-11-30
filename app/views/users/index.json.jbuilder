json.users @users do |user|
    json.id user.id
    json.fname user.fname
    json.lname user.lname
    json.email user.email
end

json.partial! "pagination/pagination", locals: {model: @users, per_page: @per_page}