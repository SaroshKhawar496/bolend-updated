json.user_notifications @user.notifications do |notify|
	json.detail notify.description
end
