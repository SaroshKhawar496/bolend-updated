class UsersController < ApplicationController
	
	#current_user is available through devise gem
  def show
    # @user = User.find(current_user.id)
    @user = User.find(params[:id])
  end

  def you
    puts "running UsersController#you"
    @user = User.find(current_user.id)
    render :show
  end


  # get all users
  def index

    # if a search term is present, perform a user search
    if params[:query].present?
      query = params[:query]
      @user = User.user_name(query)

    # otherwise, return all users
    else
      @user = User.all
    end

  end

	
end
