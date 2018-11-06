class PasswordsController < Devise::PasswordsController  
	respond_to :json
	
	# overwiriting the devise update method of PasswordsController
	def update
		user = User.reset_password_by_token(params[:user])
		if user.errors.empty?
			render json: {}
		else
			respond_with_namespace(user)
		end
	end

end