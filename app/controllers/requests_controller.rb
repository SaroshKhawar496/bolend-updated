class RequestsController < ApplicationController
  before_action :set_request, except: [:index, :create]

  def create
    @item = Item.find(params[:id])
    if ! current_user.requested_items.include? @item #to prevent user from requesting the same item again
        if ! current_user.items.include? @item #to prevent user from requesting his own item
          @request = current_user.requests.new(item: @item) 
          if @request.save
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
