json.items @items.reverse do |item|
  if ! item.borrower.present?
    json.id item.id
    json.name item.name
    json.desc item.description
    json.user item.user
    json.image rails_blob_url(@item.image) if @item.image.attached?
    json.total_hits item.hits
    json.hits_1week item.hits(1.week.ago)
  end
end

# JSON Containing results of the pages for items
json.pages do
	json.current_page @items.current_page
	json.see_per_page @items.per_page
	json.total_results @items.total_entries
	json.total_pages @items.total_pages 

end




      # :current_page => @posts.current_page,
      # :per_page => @posts.per_page,
      # :total_entries => @posts.total_entries,
      # :entries => @posts
