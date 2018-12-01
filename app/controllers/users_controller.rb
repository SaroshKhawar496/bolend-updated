class UsersController < ApplicationController

	#current_user is available through devise gem
  def show
    @currentUser = User.find(current_user.id)
    @user = User.find(params[:id])
    if @currentUser.friends.include? @user
      @friend = true
    else
      @friend = false
    end
    @privilege = privilege(@user.id) 
  end


  def you
    @user = User.find(current_user.id)
    @privilege = true
    render :show
  end


  def privateModeOn
    @user = User.find(current_user.id)
    @user.privateMode = true
    @user.save
    # no payload , #current_user always exists and the flag can be changed as it exists, no fail 
  end


  def privateModeOff
    @user = User.find(current_user.id)
    @user.privateMode = false
    @user.save
    # no payload , #current_user always exists and the flag can be changed as it exists, no fail 
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
