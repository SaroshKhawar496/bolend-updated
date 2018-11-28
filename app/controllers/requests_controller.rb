class RequestsController < ApplicationController
  before_action :set_request, except: [:index, :create]

  def create
    @item = Item.find(params[:id])
    if current_user.requested_items.include? @item #to prevent user from requesting the same item again
      render json: {"message": "You have already requested this item"}, status: :conflict
    elsif current_user.items.include? @item #to prevent user from requesting his own item
      render json: {"message": "You cannot request an item that belongs to you"}, status: :conflict
    else
      @request = current_user.requests.new(item: @item, days: params[:days]) 
      @request.status = 'pending'
      if @request.save
        Notification.create(recipient: @item.user, sender: current_user, action: "item_request", notifiable_object: @request)
        render :show, status: :ok, location: @request
      end
    end    
  end

  def index
    @user = User.includes([:items, :requests]).find(current_user.id)
  end

  def show
    
  end


  def destroy
    if @request.user.id == current_user.id
      if @request.status == 'accepted'
        render json: {"message": "This request was already accepted by the item owner. Can't withdraw accepted request"}, status: :conflict
      elsif @request.status == 'declined'
        render json: {"message": "This request was declined by the item owner. Can't withdraw declined request"}, status: :conflict
      else #if request status is pending or null. null is needed because of all existing requests prior to this update
        #render json: {"message": "The status value of this request is null or it doesn't exist, which is no longer allowed"}, status: :unprocessable_entity
        @request.destroy
        render json: {"message": "Successfully Deleted"}, status: :ok
      end
    else
      render json: {"message": "You can only destroy requests that belong to you"}, status: :forbidden
    end
  end

  def decline
    #check to see if current user owns item that is being requested
    if current_user.id == @request.item.user.id
      if @request.status == 'declined'
        render json: {"message": "You have already declined this request"}, status: :conflict
      else  
        @request.update_attributes(:status => 'declined')
        render json: {"message": "Successfully Declined"}, status: :ok
      end
    else
      render json: {"message": "Item being requested does not belong to you do you can't decline the request"}, status: :forbidden
    end
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

