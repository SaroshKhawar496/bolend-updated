class RemoveOwnerFromItem < ActiveRecord::Migration[5.2]
  def change
    remove_column :items, :owner, :string
  end
end
