class FriendshipsController < ApplicationController

	def newFriendRequest
		@friend = User.find(params[:friend_id])
		#assume @friend exists
		@user = User.find(current_user.id)
		@user.friend_request(@friend)
	end

	def acceptFriendRequest
		@friend = User.find(params[:friend_id])
		@user = User.find(current_user.id)
		@user.accept_request(@friend)
	end

	def declineFriendRequest
		@friend = User.find(params[:friend_id])
		@user = User.find(current_user.id)
		@user.decline_request(@friend)
	end

	def blockFriend
		@friend = User.find(params[:friend_id])
		@user = User.find(current_user.id)
		@user.block_friend(@friend)
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
		@nonempty = mutual_users.uniq # ensure uniquness, TODO: can potentially by used to determine how many mutual friends and use as heuristic
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

end