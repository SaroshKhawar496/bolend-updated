class UsersController < ApplicationController
	
	def new
		@user = User.new
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

	def show
    @user = User.find(params[:id])
	end

	
end
