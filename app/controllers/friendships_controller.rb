class FriendshipsController < ApplicationController

	def newFriendRequest

		begin
			@friend = User.find(params[:user_id])
		rescue Exception => e
			render json:
			{
				"message": "This user does not exist",
				"success": false
			}
			return # game over , user does not exist
		end

		# friend user should not be in the pending collection
		@friend = User.find(params[:user_id])
		@user = User.find(current_user.id)
		@users = User.all
		friends = @user.friends
		pendingFriends = @user.pending_friends
		requestedFriends = @user.requested_friends
		if current_user.id == params[:user_id]
			render json:
			{
				"message": "Cannot add yourself as a friend",
				"success": false
			}
		elsif friends.include? @friend
			render json:
			{
				"message": "You are already friends with this user",
				"success": false
			}
		elsif requestedFriends.include? @friend
			@user.accept_request(@friend)
			Notification.create(recipient: @friend, sender: @user, action: "accepted_friend_request", notifiable_object: @friend)
			render json:
			{
				"message": "#{@friend.fname} #{@friend.lname} had already sent you a Request, you are now friends!",
				"success": true
			}			
		elsif pendingFriends.include? @friend
			render json:
			{
				"message": "Please wait for user to accept your request",
				"success": false
			}
			# set status success or not
		else
			@user.friend_request(@friend)
			Notification.create(recipient: @friend, sender: @user, action: "new_friend_request", notifiable_object: @user)
			render json:
			{
				"message": "Request sent successfully",
				"success": true
			}
		end
	end

	def acceptFriendRequest

		begin
			@friend = User.find(params[:user_id])
		rescue Exception => e
			render json:
			{
				"message": "This user does not exist",
				"success": false
			}
			return # game over , user does not exist
		end

		@friend = User.find(params[:user_id])
		@user = User.find(current_user.id)
		# check if request exists to even add friend
		requestedFriends = @user.requested_friends
		if requestedFriends.include? @friend
			@user.accept_request(@friend)
			Notification.create(recipient: @friend, sender: @user, action: "accepted_friend_request", notifiable_object: @friend)
			render json:
			{
				"message": "Congratulations, you are now friends with #{@friend.fname} #{@friend.lname}!",
				"success": true
			}
		else
			render json:
			{
				"message": "Cannot perform this action",
				"success": false
			}
		end
	end

	def declineFriendRequest

		begin
			@friend = User.find(params[:user_id])
		rescue Exception => e
			render json:
			{
				"message": "This user does not exist",
				"success": false
			}
			return # game over , user does not exist
		end

		@friend = User.find(params[:user_id])
		@user = User.find(current_user.id)
		# check if request exists to even add friend
		requestedFriends = @user.requested_friends
		if requestedFriends.include? @friend
			@user.decline_request(@friend)
			render json:
			{
				"message": "Friend request from #{@friend.fname} #{@friend.lname} has been declined",
				"success": true
			}
		else
			render json:
			{
				"message": "Cannot perform this action",
				"success": false
			}
		end
		
	end

	def getItemsFromFriends
		@unloanedFriendItems = []
		@items = Item.where(user_id: User.find(current_user.id).friends)
		@items = @items.page(page).per(per_page(20)) # load up to 20 items at a time; does NOT guarantee 20 items will be returned
		@per_page = per_page.to_i

		# filter items to include only items that are not currently loaned out
		@items.each do |item|
			# if loan is active (i.e. either never been loaned, or has been returned since last loan)
			if !item.loan.present? || item.loan.date_of_return.present?
				@unloanedFriendItems << item
			end
		end
	end

	def blockFriend

		begin
			@friend = User.find(params[:user_id])
		rescue Exception => e
			render json:
			{
				"message": "This user does not exist",
				"success": false
			}
			return # game over , user does not exist
		end

		@friend = User.find(params[:user_id])
		@user = User.find(current_user.id)
		# check if user is already added to the blocked list
		blockedFriends = @user.blocked_friends
		if blockedFriends.include? @friend
			render json:
			{
				"message": "User already blocked",
				"success": false
			}
		elsif @user.pending_friends.include? @friend
			@user.block_friend(@friend)
			render json:
			{
				"message": "#{@friend.fname} #{@friend.lname} has been blocked! Sorry for this experience.",
				"success": true
			}
		else
			render json:
			{
				"message": "Cannot perform this action",
				"success": false
			}
		end
	end

	def cancelFriendRequest
		begin
			@friend = User.find(params[:user_id])
		rescue Exception => e
			render json:
			{
				"message": "This user does not exist",
				"success": false
			}
			return # game over , user does not exist
		end

		@friend = User.find(params[:user_id])
		@user = User.find(current_user.id)
		successPen = false
		if @user.pending_friends.include? @friend
			# request exists
			list = @user.pending_friends.find(@friend.id).friendships
			list.each do |pendingID|
				if pendingID.friendable_id == @friend.id and pendingID.friend_id == @user.id
					pendingID.delete
					successPen = true
				end
			end
		end

		#safety measure
		@user.pending_friends.delete(@friend)

		if successPen == true
			render json:
			{
				"message": "Friend request was cancelled!",
				"success": true 
			}
		elsif @user.pending_friends.exclude? @friend and @friend.requested_friends.exclude? @user and @user.friends.exclude? @friend
		render json:
		{
			"message": "Friendship was already cancelled!",
			"success": true
		}			
		else
			render json:
			{
				"message": "Friend request could not be cancelled, friend may have already accepted",
				"success": false
			}
		end
	end

	def deleteFriend
		begin
			@friend = User.find(params[:user_id])
		rescue Exception => e
			render json:
			{
				"message": "This user does not exist",
				"success": false
			}
			return # game over , user does not exist
		end

		if @user.friends.include? @friend and @friend.friends.include? @user
			@user.friends.delete(@friend)
			@friend.friends.delete(@user)
			#deleted
			render json:
			{
				"message": "#{friend.fname} #{friend.lname} was removed from your friends list!",
				"success": true
			}
		else
			render json:
			{
				"message": "Friend was already deleted, or never added.",
				"success": false
			}
		end

	end

	def getMutualFriends
		@users = User.all
		@user = User.find(current_user.id)
		@userFriends = @user.friends
		mutual_users = []
		@userFriends.each do |user| # check mutual friend for all of my friends
			user_tobe_added = user.friends - @user.friends # get all of their friends and subtract with all of my matching friends
			user_tobe_added.each do |each_user| # for each of the matching friends check criteria
				if each_user.id != current_user.id # if the potential matching id does not equal own user's id then save into collection 
					# TODO: should verify that current users blocked friends do not show up, as block only prevent friendship actions with this gem
					mutual_users << each_user		
				end
			end	
		end

		@heuristicArray = []
		mutual_users.each do |heuristic|
			@heuristicArray << [heuristic.id, heuristic.fname, heuristic.lname, mutual_users.count(heuristic)]
		end

		intermediate = @heuristicArray.uniq

		@return = intermediate.sort {|x| x[3]}
		# paginateFriends(@return)
		# @nonempty = intermediate.uniq # ensure uniquness, TODO: can potentially by used to determine how many mutual friends and use as heuristic
	end

	def getPendingRequests
		@user = User.find(current_user.id)
	end

	def getBlockedFriends
		@user = User.find(current_user.id)
	end

	def getAllFriends
		@user = User.find(current_user.id)
		paginateFriends(@user.friends)
	end

	def getRequestedFriends
		@user = User.find(current_user.id)
	end

	# paginate the results fetched by this controller and add the necessary variables for jbuilder
	def paginateFriends(results)
		if results.length == 0
			return
		end
		
		@friends = results.page(page).per(per_page)
		@per_page = per_page.to_i
	end

	# this method should return all (or top ~15) users who:
	# 	are not already your friend, and 
	#   has not sent you a friend request, and
	#	has not received a friend request from you
	# sorted with some heuristic.
	def discoverUsers 
		User.index
		# @users = User.all
	end

end