class AddTagsToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :tags, :string
  end
end
