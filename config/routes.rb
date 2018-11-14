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
    
    get 'app/notify', to: "notifications#index"

    post 'app/friendrequest', to: "friendships#newFriendRequest"
    post 'app/addfriend', to: "friendships#acceptFriendRequest"
    post 'app/declinefriend', to: "friendships#declineFriendRequest"
    post 'app/blockfriend', to: "friendships#blockFriend"
    get 'app/getpendingfriends', to: "friendships#getPendingRequests"
    get 'app/getblockedfriends', to: "friendships#getBlockedFriends"
    get 'app/friends', to: "friendships#getAllFriends"
    get 'app/requestedfriends', to: "friendships#getRequestedFriends"

    # get 'app/friendrequest', to "user_relations#show"
    # get 'app/friendrequest', to "user_relations#show"

    resources :user_relations
    resources :items

    # resources :friendships

  
    resources :requests

    resources :loans
    
  end
 

  get 'app/*path', to: "application#fallback_index_html", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end

end
