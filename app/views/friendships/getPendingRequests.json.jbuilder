json.pending @user.pending_friends do |pending|
	json.partial! "friendships/friend", friend: pending
end

# might be nice to able to see how many mutual friends you have with a user
