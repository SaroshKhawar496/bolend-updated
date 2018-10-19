class UsersController < ApplicationController
	
	#preventing a user to goto other user profile  by changing URI
	# before_action :require_same_user, only: [:show]

	def new
		@user = User.new
	end

  def show
    @user = User.find(params[:id])
    @user.inspect
  end

	def create
		@user = User.create(user_params)
		if @user.save
			flash[:notice] = "Welcome to your Profile! #{@user.fname}"
			redirect_to user_path(@user)
		else
			render 'new'
		end

	end

	private
		#whitelisting the parameters
		def user_params
			params.require(:user).permit(:fname, :lname, :address, :phone, :email, :gender, :dateofbirth, :password)

		end

	# def require_same_user 
	# 	#if current user doesn't match the visiting profile user
	# 	#then shows error and takes you back to root_path
	# 	if current_user != @user
	# 		flash[:notice] = "You cannot see other person's proifle!"
	# 		redirect_to root_path
	# 	end

	# end
	
end
