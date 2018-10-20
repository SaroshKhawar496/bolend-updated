Rails.application.routes.draw do

  #devise_for :users with path accounts to avoid confusion

  devise_for :users, :path => 'accounts'

  root "welcome#home"
  resources :users

  resources :items

end
