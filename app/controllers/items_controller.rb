class ItemsController < ApplicationController
  #using current_user.id now
  
  

  def new
    @item = Item.new
    @user = User.find(current_user.id)
  end

  def index

    #to search send GET request to localhost:3000/api/items?search_item=hel
    #search_item=hel searching for item with name hel

    # Send Get to localhost:3000/api/items?search_item=el&page=2 for pagination
    # localhost:3000/api/items?search_item=el&page=2&per_page=5

    #State before implementing the searchkick

    # @items = Item.all
    # @user = User.find(current_user.id)

    # #old stuff
    # #@user = session[:user_id]
    # #userId = current_user.id
    

    # after implementing the searchkick
    # @user = User.find(current_user.id)    # why is this needed?
    


    # log(params[])

    if params[:query].present?
      # puts "search_item is present"
      # test = CGI::parse('param1=value1&param2=value2&param3=value3')
      # puts("-----------------\n ")
      # puts("#{test}\n")
      # puts("-------------\n")


      # puts params.inspect
      @items = Item.item_name(params[:query])

      if @items.length == 0
        render json: {
          "message": "We could not find what you were looking for!",
          "items": []
        }
       
      end

      # puts "items.length #{@items.length}"
    else
      # puts "item.all"
      @items = Item.includes([:user, :loan, :borrower]).all
      # puts "items.length #{@items.length}"

    end
    

    #paginating in either case, uses params[:page] if present otherwise uses page 1 of results.
    #option to change the numOfresults shown perpage also available 
    @items = @items.paginate(page: page, per_page: per_page)
    
    numOfPages = @items.total_pages

        # check for not lettting page exceeding the last page, if it does show last page
    if (params[:page].to_i > numOfPages.to_i)

      # render json:{
      #   "message": "Showing the last page of results"
      # }
      @items = @items.paginate(page: numOfPages, per_page: per_page)
      

    end

     
  end

  # methods for pagination controls
  def page
    @page ||= params[:page] || 1
  end

  def per_page
    @per_page ||= params[:per_page] || 10
  end



  # ----------------------------------------


  def show
    @item = Item.find(params[:id])
    # @user = User.find(current_user.id)    # what is the point of this?
    @item.punch(request)
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

  def update
    @item = Item.find(params[:id])

    # the only user allowed to update items is the owner of the item
    if @item.user.id != current_user.id
      render json: @item.errors, status: :forbidden
    elsif @item.update_attributes(permit_item)
      puts ">item updated successfully!"
    end
  end


  private

  def permit_item
    params.require(:item).permit(:name, :description, :user_id, :image)
  end

end
