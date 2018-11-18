json.users @user.requested_friends do |requested|
	# json.detail "You have a friend request from: #{requested["fname"]} #{requested["lname"]}"
	json.partial! "friendships/friend", friend: requested
end