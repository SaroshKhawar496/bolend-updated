json.users @user.friends do |friend|
	json.partial! "friendships/friend", friend: friend
end