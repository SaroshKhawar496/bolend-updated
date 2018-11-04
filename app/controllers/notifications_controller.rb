class NotificationsController < ApplicationController

	def show
		@items = Item.where(user_id: current_user.id) #find all items owned by current user
		puts "current user id is #{current_user.id}"
		json_obj = {}
		@items.each do |curr|
			#puts "#{curr.name}"
			@request = Request.where(item_id: curr.id) # find all requests on items owned by current user
			@request.each do |req|
				@users = User.find(req.user_id)
				fname = @users.fname
				lname = @users.lname
				item_name = curr.name
				puts "#{fname} #{lname} wants to borrow #{item_name}"	

				json_obj ("firstname" => fname, "lastname" => lname, "itemname" => item_name)

			end
		end 

		puts "#{json_obj}"
	end
end