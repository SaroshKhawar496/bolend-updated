json.blocked @user.blocked_friends do |blocked|
	# json.request pending["fname"]
	json.detail "You have blocked user: #{blocked.fname}"
end