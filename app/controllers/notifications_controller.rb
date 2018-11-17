class NotificationsController < ApplicationController

	def index
		# @items = Item.where(user_id: current_user.id) #find all items owned by current user, return a collection of items
		
		# json_str = "{\n\t\"notifications\":\n\t[\n" # json string builder, create notications with an array of notifs

		# @items.each do |curr|
		# 	@request = Request.where(item_id: curr.id) # find all requests on items owned by current use
		# 	@request.each do |req|
		# 		@users = User.find(req.user_id)
		# 		fname = @users.fname
		# 		lname = @users.lname
		# 		item_name = curr.name

		# 		json_str += "\t\t{firstname\": #{fname}, \"lastname\": #{lname}, \"itemname\": #{item_name}},\n"

		# 	end
		# end 
		# json_str = json_str[0...-2]
		# json_str += "\n\t]\n}"
		# # puts "#{json_str}"
		
		#@user = User.find(current_user.id)
    @notifications = Notification.where(recipient: current_user)
	end




end

# -----------------------------------JSON TEMPLATE-----------------------------------
# {
# 	"notifications":
# 	[
# 		{"firstname": "#{fname}", "lastname": "#{lname}", "itemname": "#{item_name}"},
# 		{"firstname": "#{fname}", "lastname": "#{lname}", "itemname": "#{item_name}"},
# 		...
# 		...
# 		...
# 		{"firstname": "#{fname}", "lastname": "#{lname}", "itemname": "#{item_name}"}
# 	]
# }