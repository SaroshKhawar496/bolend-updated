# over-writing the after_account_update path
#making it go to /items instead of devise default
#root page

class RegistrationsController < Devise::RegistrationsController
	protected
		def after_update_path_for(accounts)
			items_path
		end
end
