Rails.application.routes.draw do

  get 'loans/index'
  get 'loans/create'
  #devise_for :users with path accounts to avoid confusion
  #rerouting the Devise registrations controller to extra registrations controller
  #to overwrite the after_update_path for accounts. ie take to /items after profile update 
  # devise_for :users, :path => 'accounts', :controllers => {:registrations => :registrations }



  # API accesses will use the /api/ path prefix
  scope :api, defaults: { format: :json } do
    # the rest of your routes go here
    devise_for :users, :path => 'accounts', 
                :controllers => {sessions: 'sessions', registrations: 'registrations', passwords: 'passwords'}, 
                defaults: { format: :json }

    # custom routes for resources
    get "users/you", to: 'users#you'    # show currently auth'd user
      

    root "welcome#home"
    resources :users
    
    # post 'friendrequest', to: "friendships#newFriendRequest"
    # post 'addfriend', to: "friendships#acceptFriendRequest"
    # post 'declinefriend', to: "friendships#declineFriendRequest"
    # post 'blockfriend', to: "friendships#blockFriend"
    # get 'getpendingfriends', to: "friendships#getPendingRequests"
    # get 'getblockedfriends', to: "friendships#getBlockedFriends"
    # get 'friends', to: "friendships#getAllFriends"
    # get 'requestedfriends', to: "friendships#getRequestedFriends"
    # get 'mutualfriends', to: "friendships#getMutualFriends"

    scope :friends do
      post 'request', to: "friendships#newFriendRequest"
      post 'add', to: "friendships#acceptFriendRequest"
      post 'decline', to: "friendships#declineFriendRequest"
      post 'block', to: "friendships#blockFriend"
      get 'get-pending', to: "friendships#getPendingRequests"
      get 'get-blocked', to: "friendships#getBlockedFriends"
      get 'index', to: "friendships#getAllFriends"
      get 'requested', to: "friendships#getRequestedFriends"
      get 'mutual', to: "friendships#getMutualFriends"
    end

    # get 'friendrequest', to "user_relations#show"
    # get 'friendrequest', to "user_relations#show"

    resources :user_relations
    resources :items

    # resources :friendships

  
    resources :requests

    resources :loans

    resources :notifications
    
  end
 

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
