json.mutual @return.each do |mutual|
	json.id "#{mutual[0]}"
	json.firstname "#{mutual[1]}"
	json.lastname "#{mutual[2]}"
	json.heuristic "#{mutual[3]}"
end