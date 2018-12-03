json.users @return.each do |mutual|
	json.id "#{mutual[0]}"
	json.fname "#{mutual[1]}"
	json.lname "#{mutual[2]}"
	json.heuristic "#{mutual[3]}"
end


# json.partial! "pagination/pagination", locals: {model: @friends, per_page: @per_page}