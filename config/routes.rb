Rails.application.routes.draw do

  #devise_for :users with path accounts to avoid confusion
  #rerouting the Devise registrations controller to extra registrations controller
  #to overwrite the after_update_path for accounts. ie take to /items after profile update 
  devise_for :users, :path => 'accounts', :controllers => {:registrations => :registrations }

  root "welcome#home"
  resources :users

  resources :items

  resources :requests

  get 'app/*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
