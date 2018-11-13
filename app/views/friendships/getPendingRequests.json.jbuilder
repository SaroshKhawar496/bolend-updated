json.pending @user.pending_friends do |pending|
	# json.request pending["fname"]
	json.detail "Your friend request to #{pending["fname"]} is still pending"
end