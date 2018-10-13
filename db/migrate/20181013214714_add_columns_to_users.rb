class AddColumnsToUsers < ActiveRecord::Migration[5.2]
  def change
  	add_column :users, :gender, :string
  	add_column :users, :dateofbirth, :date
  end
end
