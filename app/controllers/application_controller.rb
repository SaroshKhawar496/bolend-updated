include ActionController::MimeResponds

class ApplicationController < ActionController::API
	include Response


	before_action :configure_permitted_parameters, if: :devise_controller?
	
	#using the devise-builtIN method to authenticate users, its available to all controllers now
	before_action :authenticate_user!, :except => [:fallback_index_html]

	respond_to :json
	helper_method :privilege

	# used to serve static files for frontend SPA
	def fallback_index_html
		render :file => 'public/app/index.html'
	end



	def privilege(userID)
		@viewer = User.find(current_user.id)
		@user = User.find(userID)

		# if the viewer and user are the same person, return true
		if @viewer == @user
			return true
		end

		# if user has blocked the viewer, return false
		if @user.blocked_friends.include? @viewer
			return false

		# otherwise, if user and viewer are friends, return true
		elsif @user.friends.include? @viewer
			return true

		# if user and viewer are NOT friends
		else
			# and user's profile is PRIVATE, return false
			if @user.privateMode==true
				return false
			else
				return true
			end
		end
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

# Pagination ------------------------------------------------------
	protected

		# sending the pagination params via request headers
		def set_pagination_headers(v_name)
			# render json: {
			#   "message": "Set Pagination Headers called"
			# }
			pageCollect = instance_variable_get("@#{v_name}")

			headers["X-Total-Count"] = pageCollect.total_count

			links = []
			links << page_link(1,"first") unless pageCollect.first_page?
			links << page_link(pageCollect.prev_page, "prev") if pageCollect.prev_page
			
			links << page_link(pageCollect.next_page, "next") if pageCollect.next_page
			links << page_link(pageCollect.total_pages, "last") unless pageCollect.last_page?
			headers["Link"] = links.join(", ") if links.present?


		end

		def page_link(page, rel)
			base_uri = request.url.split("?").first
			# "<#{items_url(request.query_parameters.merge(page: page))}>; rel='#{rel}'"
			"<#{base_uri}?#{request.query_parameters.merge(page: page).to_param}>; rel='#{rel}'"
		end


		##### methods for pagination controls
		# use this method to determine the page number; reads from request header first
		def page
			@page ||= request.headers["page"] || 1
		end

		# determine how many entries per page; reads from request header, then from count
		def per_page(count=nil)
			@per_page ||= request.headers["perpage"] || count || 12
		end
# Pagination Ended --------------------------------------------------------------------------------------------------








end
 