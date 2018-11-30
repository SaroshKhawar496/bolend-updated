class HashtagsController < ApplicationController

  # with optional search
  def index
    # if a query is included, show hashtag matching EXACTLY that query
    if ( params[:query] )
      show(params[:query])
      render :show
      return
    end

    # otherwise, list all hashtags
    @hashtags = SimpleHashtag::Hashtag.all

    # enable pagination
    @hashtags = @hashtags.page(page).per(per_page)
    @per_page = per_page.to_i
  end

  def show(query=nil)
    param ||= query || params[:hashtag]
    @hashtag = SimpleHashtag::Hashtag.find_by_name(param)
    @hashtagged = @hashtag.hashtaggables if @hashtag
  end

end
