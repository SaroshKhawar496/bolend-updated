json.pending @user.pending_friends do |pending|
	json.detail "Your friend request to #{pending["fname"]} #{pending["lname"]} is still pending"
end
