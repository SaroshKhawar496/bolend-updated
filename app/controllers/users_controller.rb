class UsersController < ApplicationController
	
	#current_user is available through devise gem
  def show
    @user = User.find(current_user.id)
  end


	
end
