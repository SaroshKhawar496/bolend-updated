require 'base64'
require 'stringio'

class ItemsController < ApplicationController
  #using current_user.id now
  
  # after_action only: [:index], {set_pagination_headers :items}

  after_action Proc.new{ set_pagination_headers(:items) }, only: [:index]

  # def change
  #   @items = Item.item_search(params[:query]) 
  # end
  
  def new
    @item = Item.new
    @user = User.find(current_user.id)
  end

  def Privilege(viewer, user)
    @viewer = User.find(viewer)
    @user = User.find(user)

    if @user.blocked_friends.include? @viewer
      return false
    end
    if @user.friends.include? @viewer
      return true
    else
      if @user.privateMode==true
        return false
      else
        return true
      end
    end
  end

  def index

    #to search send GET request to localhost:3000/api/items?query=hel

    if params[:query].present?

      @items = Item.item_search(params[:query]).order(id: :desc)
      @items = @items.select { |item| privilege(item.user_id) }

      if @items.length == 0
        render json: {
          "message": "We could not find what you were looking for!",
          "items": []
        }

      end

      @items = Kaminari.paginate_array(@items)

    else

      @items = Item.includes([:user, :loan, :borrower]).all.order(id: :desc)
      @items = @items.select { |item| privilege(item.user_id) }
      @items = Kaminari.paginate_array(@items)

    end
    

    #paginating in either case, uses params[:page] if present otherwise uses page 1 of results.
    #option to change the numOfresults shown perpage also available 
    @items = @items.page(page).per(per_page)
    @per_page = per_page.to_i
    

  end

  # show the most recently updated items first
  def index_new
    @items = Item.includes([:user, :loan, :borrower]).all.order(updated_at: :desc)
    @items = Item.most_hit
    @items = @items.select { |item| privilege(item.user_id) }
    @items = Kaminari.paginate_array(@items)

    #paginating in either case, uses params[:page] if present otherwise uses page 1 of results.
    #option to change the numOfresults shown perpage also available 
    @items = @items.page(page).per(per_page)
    @per_page = per_page.to_i
    render :index
  end


  # show the most popular items in the last week
  def index_trending
    @items = Item.most_hit(1.week.ago, 100)
    @items = @items.select { |item| privilege(item.user_id) }
    @items = Kaminari.paginate_array(@items)
    #paginating in either case, uses params[:page] if present otherwise uses page 1 of results.
    #option to change the numOfresults shown perpage also available 
    @items = @items.page(page).per(per_page(15))
    @per_page = per_page.to_i
    render :index
  end


  def show
    @item = Item.find(params[:id])
    @item.punch(request)

    if @item && privilege(@item.user.id)
      render :show
    else
      render json: {
        "message": "You are not allowed to view this item."
      }, status: :forbidden
    end
  end

  def destroy
    @item = Item.find(params[:id])
    @item.destroy
    # redirect_to items_path
  end

  def create
    @item = Item.new(permit_item)

    #Adding images old (with embedded ruby forms)
    #@item.image.attach(@image)

    #Adding image (with REST API, image is sent as JSON payload)
    #Kinda dirty because of the intermediate storage
    if(params[:item][:base64] != nil) 
      image_name = "#{@item.name}.jpg"
      base64_image = params[:item][:base64].sub(/^data:.*,/, '')
      decoded_image = Base64.decode64(base64_image)
      image_io = StringIO.new(decoded_image)
      @picture = { io: image_io, filename: image_name }
      @item.image.attach(@picture)
      @item.base64 = nil # no need to store in database anymore
    end

    #test for image stored on server
    #@item.image.attach(io: File.open('/home/ivar/Pictures/1280px-Venus_botticelli_detail.jpg'), filename: image_name )

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
      if(params[:item][:base64] != nil) 
        image_name = "#{@item.name}.jpg"
        base64_image = params[:item][:base64].sub(/^data:.*,/, '')
        decoded_image = Base64.decode64(base64_image)
        image_io = StringIO.new(decoded_image)
        @picture = { io: image_io, filename: image_name }
        @item.image.attach(@picture)
        @item.base64 = nil # no need to store in database anymore
        @item.save
        if @item.save
          render :show, status: :ok, location: @item
        else
          render json: @item.errors, status: :unprocessable_entity
        end
      else #if base64 is set to null, remove image
        @item.image.purge if @item.image.attached?
        if @item.save
          render :show, status: :ok, location: @item
        else
          render json: @item.errors, status: :unprocessable_entity
        end
      end 
    end
  end


  private

  def permit_item
    params.require(:item).permit(:name, :description, :user_id, :image, :base64, :tags)
  end

end
