json.blocked @user.blocked_friends do |blocked|
	json.detail "You have blocked: #{blocked["fname"]} #{blocked["lname"]}"
end