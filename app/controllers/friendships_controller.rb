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
		if friends.include? @friend
			render json:
			{
				"message": "You are already friends with this user",
				"success": false
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
		else
			@user.block_friend(@friend)
			render json:
			{
				"message": "#{@friend.fname} #{@friend.lname} has been blocked! Sorry for this experience.",
				"success": true
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
	end

	def getRequestedFriends
		@user = User.find(current_user.id)
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