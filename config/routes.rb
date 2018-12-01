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
    get "users/private-mode-true", to: "users#privateModeOn"
    get "users/private-mode-false", to: "users#privateModeOff"


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
      post 'request',     to: "friendships#newFriendRequest"
      post 'accept',      to: "friendships#acceptFriendRequest"
      post 'deny',        to: "friendships#declineFriendRequest"
      post 'block',       to: "friendships#blockFriend"
      post 'cancel',      to: "friendships#cancelFriendRequest"
      post 'delete',      to: "friendships#deleteFriend"

      get 'get-friend-items', to: "friendships#getItemsFromFriends"
      get 'get-pending',  to: "friendships#getPendingRequests"
      get 'get-blocked',  to: "friendships#getBlockedFriends"
      get 'index',        to: "friendships#getAllFriends"
      get 'requested',    to: "friendships#getRequestedFriends"
      get 'mutual',       to: "friendships#getMutualFriends"
      # get 'discover',     to: "friendships#discover"
      get 'discover',     to: "users#index"


    end

    # get 'friendrequest', to "user_relations#show"
    # get 'friendrequest', to "user_relations#show"

    resources :user_relations

    # custom items routes
    scope :items do
      get 'new',      to: "items#index_new"
      get 'trending', to: "items#index_trending"
    end
    resources :items

    # resources :friendships

    get "hashtags/:hashtag",   to: "hashtags#show",      as: :hashtag
    get "hashtags",            to: "hashtags#index",     as: :hashtags
  
    resources :requests do
      collection do
        post :decline
      end
    end

    resources :loans do
      collection do
        post :mark_as_returned
      end
    end

    resources :notifications do 
      collection do
        post :mark_as_read
      end
    end
    
  end
 

  get '*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
