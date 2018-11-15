json.mutual @nonempty.each do |mutual|
	json.id "#{mutual["id"]}"
	json.firstname "#{mutual["fname"]}"
	json.lastname "#{mutual["lname"]}"
end