class AddOwnerToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :owner, :string
  end
end
