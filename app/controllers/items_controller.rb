class ItemsController < ApplicationController
  #using current_user.id now
  
  

  def new
    @item = Item.new
    @user = User.find(current_user.id)
  end

  def index

    #to search send GET request to localhost:3000/api/items?search_item=hel
    #search_item=hel searching for item with name hel

    #State before implementing the searchkick

    # @items = Item.all
    # @user = User.find(current_user.id)

    # #old stuff
    # #@user = session[:user_id]
    # #userId = current_user.id
    

    # after implementing the searchkick
    @user = User.find(current_user.id)

    if params[:search_item].present?
      # puts "search_item is present"

      @items = Item.item_name(params[:search_item])

      if @items.length == 0
        render json: {
          "message": "We could not find what you were looking for!"
        }
       
      end

      # puts "items.length #{@items.length}"
    else
      # puts "item.all"
      @items = Item.all
      # puts "items.length #{@items.length}"
    end

     
  end

  def show
    @item = Item.find(params[:id])
    @user = User.find(current_user.id)
  end

  def destroy
    @item = Item.find(params[:id])
    @item.destroy
    # redirect_to items_path
  end

  def create
    @item = Item.new(permit_item)
    @user = User.find(current_user.id)
    @item.user_id = @user.id
    if @item.save
      # flash[:success] = "Success!"
      # redirect_to item_path(@item)
      render :show, status: :ok, location: @item
    else
      # flash[:error] = @item.errors.full_messages
      # redirect_to new_item_path
      render json: @item.errors, status: :unprocessable_entity
    end

  end


  private

  def permit_item
    params.require(:item).permit(:name, :description, :user_id, :image)
  end

end
