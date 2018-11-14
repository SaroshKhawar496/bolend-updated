json.friend @user.friends do |friend|
	json.detail "You are friends with #{friend["fname"]} #{friend["lname"]}"
end