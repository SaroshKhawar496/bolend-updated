json.partial! "items/item", item: @item
json.name @item.name
json.description @item.description
json.total_hits @item.hits
json.hits_1week @item.hits(1.week.ago)