class ApplicationController < ActionController::Base
# by default the methods in application controller are 
# available to controllers but not to views

# methods current_user & logged_in? wiil be helper
# methods for the views to limit the user interactions
	
	#this will make the methods avalible to views
	#based on these we can modify the elements on page
	helper_method :current_user, :logged_in?

	def current_user
		#return this user if session[user_email] is stored in our session hash
		# will return the user with that email
		
		#return current_user if you had already queried the DB before
		#if not (||=) then check the DB 
		#finding user by user_id in the DB
		@current_user ||= User.find_by_id(session[:user_id]) if session[:user_id]
	end

	def logged_in?
		# return true if you have a current user, 
		#false if not, meaning user is not logged in
		!!current_user
	end

	def require_user
		#checking if user is logged in or not
		#if not logged in the takes you back to home
		if !logged_in?
			flash[:notice] = "You must be logged in to the action"
			redirect_to root_path
		end

	end



end
 