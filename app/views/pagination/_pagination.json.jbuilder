# do not include pagination info if there is nothing to display
if model && model.current_page && per_page
	json.pages do 
		json.page model.current_page
		json.perpage per_page
		json.total_results model.total_count
		json.total_pages model.total_pages 
	end
end