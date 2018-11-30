json.pages do 
	json.page model.current_page
	json.perpage per_page
	json.total_results model.total_count
	json.total_pages model.total_pages 
end
