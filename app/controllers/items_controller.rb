require 'base64'
require 'stringio'

class ItemsController < ApplicationController
  #using current_user.id now
  
  # after_action only: [:index], {set_pagination_headers :items}
  # after_action Proc.new{ set_pagination_headers(:items) }, only: [:index]
  
  def new
    @item = Item.new
    @user = User.find(current_user.id)
  end

  def page
    page_param = (request.headers["page"])
    # puts("-------------------------------page_param #{page_param}----------------------------------")
    # @page ||= params[:page] || 1
    @page ||= page_param || 1
  end

  def per_page
    per_page_param = (request.headers["perpage"])
    puts("-------------------------------per_page_param #{per_page_param}----------------------------------")
    @per_page ||= per_page_param || 10
  end

  def index

    #to search send GET request to localhost:3000/api/items?search_item=hel
    #search_item=hel searching for item with name hel

    # Send Get to localhost:3000/api/items?search_item=el&page=2 for pagination
    # localhost:3000/api/items?search_item=el&page=2&per_page=5

    if params[:query].present?

      @items = Item.item_search(params[:query])

      if @items.length == 0
        render json: {
          "message": "We could not find what you were looking for!",
          "items": []
        }

      end

    else

      @items = Item.includes([:user, :loan, :borrower]).all

    end
    

    #paginating in either case, uses params[:page] if present otherwise uses page 1 of results.
    #option to change the numOfresults shown perpage also available 
    @items = @items.page(page).per(per_page)
    @per_page = per_page.to_i
    
    # numOfPages = @items.total_pages

    # check for not lettting page exceeding the last page, if it does show last page
    # if (params[:page].to_i > numOfPages.to_i)



    #   # @items = @items.page(numOfPages).per(per_page)



    # end
       # puts("-------------------------------per_page_param #{per_page}----------------------------------")
       
    # set_pagination_headers(@items)



  end

  # # sending the pagination params via request headers
  # def set_pagination_headers(v_name)
  #   # render json: {
  #   #   "message": "Set Pagination Headers called"
  #   # }
  #   pageCollect = instance_variable_get("@#{v_name}")

  #   headers["X-Total-Count"] = pageCollect.total_count

  #   links = []
  #   links << page_link(1,"first") unless pageCollect.first_page?
  #   links << page_link(pageCollect.prev_page, "prev") if pageCollect.prev_page

  #   links << page_link(pageCollect.next_page, "next") if pageCollect.next_page
  #   links << page_link(pageCollect.total_pages, "last") unless pageCollect.last_page?
  #   headers["Link"] = links.join(", ") if links.present?


  # end

  # def page_link(page, rel)
  #   base_uri = request.url.split("?").first
  #   # "<#{items_url(request.query_parameters.merge(page: page))}>; rel='#{rel}'"
  #   "<#{base_uri}?#{request.query_parameters.merge(page: page).to_param}>; rel='#{rel}'"
  # end

  # # methods for pagination controls
  # def page
  #   @page ||= params[:page] || 1
  # end

  # def per_page
  #   @per_page ||= params[:per_page] || 10
  # end



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
