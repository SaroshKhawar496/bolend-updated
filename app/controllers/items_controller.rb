class ItemsController < ApplicationController
  def new
    @item = Item.new
    @user = User.find(session[:user_id])
  end

  def index
    @items = Item.all
    #@user = session[:user_id]
    @user = User.find(session[:user_id])
  end

  def show
    @item = Item.find(params[:id])
    @user = User.find(session[:user_id])
  end

  def destroy
    @item = Item.find(params[:id])
    @item.destroy
    redirect_to items_path
  end

  def create
    @item = Item.new(permit_item)
    @user = User.find(session[:user_id])
    @item.user_id = @user.id
    if @item.save
      flash[:success] = "Success!"
      redirect_to item_path(@item)
    else
      flash[:error] = @item.errors.full_messages
      redirect_to new_item_path
    end
        
  end

  private

    def permit_item
      params.require(:item).permit(:name, :description, :user_id)
    end

end
