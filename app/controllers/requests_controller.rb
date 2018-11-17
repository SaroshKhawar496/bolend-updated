class RequestsController < ApplicationController
  before_action :set_request, except: [:index, :create]

  def create
    @item = Item.find(params[:id])
    if current_user.requested_items.include? @item #to prevent user from requesting the same item again
      render json: {"message": "You have already requested this item"}, status: :unprocessable_entity
    elsif current_user.items.include? @item #to prevent user from requesting his own item
      render json: {"message": "You cannot request an item that belongs to you"}, status: :unprocessable_entity
    else
      @request = current_user.requests.new(item: @item) 
      if @request.save

        render :show, status: :ok, location: @request
      end
    end    
  end

  def index
    @user = User.find(current_user.id)
  end

  def show
    
  end

  def destroy
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

