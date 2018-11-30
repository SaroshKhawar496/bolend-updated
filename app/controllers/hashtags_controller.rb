class HashtagsController < ApplicationController

  def index
    @hashtags = SimpleHashtag::Hashtag.all

    # enable pagination
    @hashtags = @hashtags.page(page).per(per_page)
    @per_page = per_page.to_i
  end

  def show
    @hashtag = SimpleHashtag::Hashtag.find_by_name(params[:hashtag]).includes([:items, :users])#.includes(:users)
    @hashtagged = @hashtag.hashtaggables if @hashtag
  end

end
