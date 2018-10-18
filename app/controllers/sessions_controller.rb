#Sessions controller for login and logout functionality

class SessionsController < ApplicationController
	#:session hash is backed by browser

	#new will simply render a login form
	def new
	end

	#create will handle the form submission 
	#and start the session in a logged in state
	def create
		#finding user by email and getting email from params session
		#emails in db are in lowercase 
		user = User.find_by(email: params[:session][:email].downcase)

		#if user verifies if find_by found the email
		#user.authenticate is built-in from has_secure_password in User model
		if user && user.authenticate(params[:session][:password])
			
			#saving user email in session hash
			#session[:user_email] = user.email

      		#saving user id in session hash (in the form of a temporary cookie)
      		session[:user_id] = user.id

			#user is authenticated
			flash[:notice] = "You have successfully logged in"

			#redirect_to user_path(user)
      		redirect_to items_path

		else
			#this is not a model backed, 
			#so validation errors won't appear
			#hence using the flash
			flash.now[:notice] = "Incorrect Login Credentials!"
			render 'new'
		end

	end

	#destroy will logout the user
	def destroy
		session[:user_email] = nil
		flash[:notice] = "You have logged out"
		redirect_to root_path
	end


end
