class HashtagsController < ApplicationController

  # with optional search
  def index
    # if a query is included, show hashtag matching EXACTLY that query
    if ( params[:id] )
      show_id(params[:id])
      render :show
      return
    elsif ( params[:query] )
      show(params[:query])
      render :show
      return
    end

    # otherwise, list all hashtags
    @hashtags = SimpleHashtag::Hashtag.all.order(id: :desc)

    # enable pagination
    # @hashtags = @hashtags.page(page).per(per_page)
    # @per_page = per_page.to_i
  end

  def show(query=nil)
    param ||= query || params[:hashtag]
    @hashtag = SimpleHashtag::Hashtag.find_by_name(param)
    @hashtagged = @hashtag.hashtaggables if @hashtag
  end

  def show_id (id=nil)
    param ||= id || params[:id]
    @hashtag = SimpleHashtag::Hashtag.find(param)
    @hashtagged = @hashtag.hashtaggables if @hashtag
  end

end
