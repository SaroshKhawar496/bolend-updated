class RequestsController < ApplicationController
  before_action :set_request, except: [:index, :create]

  def create
    @item = Item.find(params[:id])
    if ! current_user.requested_items.include? @item #to prevent user from requesting the same item again
        if ! current_user.items.include? @item #to prevent user from requesting his own item
          @request = current_user.requests.new(item: @item) 
          if @request.save

            #creating the notification

            #store the user id of the requested_item owner in the notification user id
            item_owner_id = @item.user_id

            puts "\n\n item_owner_id:#{item_owner_id} \n\n"
            #store the item name and the requesting user name in the description of the notification
            detail = "#{current_user.fname} requested your #{@item.name}"

            puts "\n\n Desc:#{detail} \n\n"

            @notification = Notification.new(user_id: item_owner_id, description: detail)
            if @notification.save
              # render json: {
              #   "message": "Request Notification has been created."
              # }
            else
              render json: @notification.errors
            
            end

            #redirect_to item_path(@item)
            render :index, status: :ok
          end
        end
    end    
  end

  def index
    @user = User.find(current_user.id)
  end

  def destroy
    @request = Request.find(params[:id])
    @request.destroy
  end

  private
    def set_request
    @request = Request.find(params[:id])
  end

end



# To test the request Controller via REST Api, send POST request with your token attached in the header
# Notification will be created for the request from your side to requested_item's owner
# {

#   "id": 10
# }

