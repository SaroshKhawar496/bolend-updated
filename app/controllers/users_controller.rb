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
    @user = User.includes(:loans).find(current_user.id)
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

  def update_avatar
    # the only user allowed to update items is the owner of the item
    @user = User.find(current_user.id)
    if(params[:base64] != nil) 
      image_name = "#{@user.fname}.jpg"
      base64_image = params[:base64].sub(/^data:.*,/, '')
      decoded_image = Base64.decode64(base64_image)
      image_io = StringIO.new(decoded_image)
      @picture = { io: image_io, filename: image_name }
      @user.image.attach(@picture)
      if @user.save
        render :show, status: :ok, location: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else #if base64 is set to null, remove image
      @user.image.purge if @user.image.attached?
      if @user.save
        render :show, status: :ok, location: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end 
  end


	
end
