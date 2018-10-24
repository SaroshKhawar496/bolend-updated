class ApplicationController < ActionController::Base
	before_action :configure_permitted_parameters, if: :devise_controller?
	


	#using the devise-builtIN method to authenticate users, its available to all controllers now
	before_action :authenticate_user!


	def fallback_index_html
		render :file => 'public/app/index.html'
	end

	
	protected
		#passing the required fields for devise signup form. By default,
		#devise only has allows email and password fields
		def configure_permitted_parameters
			devise_parameter_sanitizer.permit(:sign_up, keys: [:fname, :lname, :address, :phone, :gender, :dateofbirth])
			devise_parameter_sanitizer.permit(:account_update, keys: [:fname, :lname, :address, :phone])
		end
		#over-writing the devise default paths

		#after sign-up, taking user to items_path
		def after_sign_in_path_for(accounts)
			items_path
		end

		#after signout, taking to root_path 
		def after_sign_out_path_for(accounts)
			root_path
		end









end
 