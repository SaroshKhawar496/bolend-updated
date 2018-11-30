class UsersController < ApplicationController

  # 
	
	#current_user is available through devise gem
  def show
    # @user = User.find(current_user.id)
    @user = User.find(params[:id])
  end

  def you
    @user = User.find(current_user.id)
    render :show
  end



  # get all users
  def index

    # if a search term is present, perform a user search
    if params[:query].present?
      query = params[:query]
      @users = User.user_name(query).order(id: :desc)

    # otherwise, return all users
    else
      @users = User.all.order(id: :desc)
    end

    @users = @users.page(page).per(per_page)
    @per_page = per_page.to_i

  end

	
end
