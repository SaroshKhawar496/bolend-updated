Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "welcome#home"

 	
  get "/signup", to: "users#new"
  resources :users, except: [:new]

  #login route to sessions controller and new action
  get "/login", to: "sessions#new"

  #post of login will be handled by sessions#create
  post "/login", to: "sessions#create"

  #logout
  delete "/logout", to: "sessions#destroy"

  resources :items

end
