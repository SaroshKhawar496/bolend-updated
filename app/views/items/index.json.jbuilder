json.item @items.reverse do |item|
  json.id item.id
  json.name item.name
  json.desc item.description
  json.user item.user
end