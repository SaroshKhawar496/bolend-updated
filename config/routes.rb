Rails.application.routes.draw do

  #devise_for :users with path accounts to avoid confusion
  #rerouting the Devise registrations controller to extra registrations controller
  #to overwrite the after_update_path for accounts. ie take to /items after profile update 
  # devise_for :users, :path => 'accounts', :controllers => {:registrations => :registrations }



  # API accesses will use the /api/ path prefix
  scope(:path => '/api') do
    # the rest of your routes go here
    devise_for :users, :path => 'you', :controllers => {sessions: 'sessions', registrations: 'registrations'}, defaults: { format: :json }


    root "welcome#home"
    resources :users
  
    resources :items
  
    resources :requests

  end
 

  get 'app/*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
