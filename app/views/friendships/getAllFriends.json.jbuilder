json.users @friends do |friend|
	json.partial! "friendships/friend", friend: friend
end

json.partial! "pagination/pagination", locals: {model: @friends, per_page: @per_page}