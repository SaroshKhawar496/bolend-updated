class RequestsController < ApplicationController
  before_action :set_request, except: [:index, :create]

  def create
    @item = Item.find(params[:id])
    @request = current_user.requests.new(item: @item) 

    if @request.save
      redirect_to item_path(@item)
    end

  end

  def index
    @requests = Request.all 
    @user = User.find(current_user.id)
  end

  def destroy
    @request = Request.find(params[:id])
    @request.destroy
    redirect_to items_path
  end

  private
    def set_request
    @request = Request.find(params[:id])
  end

end
