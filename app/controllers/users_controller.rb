class UsersController < ApplicationController
	
	def new
		@user = User.new
	end


	def create
		@user = User.create(user_params)
		if @user.save
			flash[:notice] = "Welcome to your Profile!"
			redirect_to user_path(@user)
		else
			render 'new'
		end

	end

	private
		#whitelisting the parameters
		def user_params
			params.require(:user).permit(:fname, :lname, :address, :phone, :email, :gender, :dateofbirth)

		end

	def show
	
	end

	
end
