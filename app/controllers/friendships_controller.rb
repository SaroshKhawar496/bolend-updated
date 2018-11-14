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